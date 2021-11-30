import React from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { ButtonGroup, Button } from 'react-bootstrap';
import { toTemporalInstant } from '@js-temporal/polyfill';
const { abs } = Math;

import 'react-day-picker/lib/style.css';
import './DatePicker.scss';

type DateQuickChoice = 'day' | 'week' | 'month' | [number, number]
const toTemporal = (d: Date) => toTemporalInstant.call(d);

function daysBetween(a: Date, b: Date) {
    return toTemporal(a).until(toTemporal(b)).total({ unit: 'days' });
}

function shiftByDays(date: Date, days: number) {
    return new Date(toTemporal(date).add({ hours: days * 24 }).toString());
}

function isDayBetween(date: Date, from: Date, to: Date) {
    return date >= from && date <= to;
}

function isDayEqual(a: Date, b: Date) {
    return abs(daysBetween(a, b)) < 1;
}


export interface QuickButtonsProps {
    selected: DateQuickChoice;
    onChange: (selected: DateQuickChoice) => void;
}

export class QuickButtons extends React.Component<QuickButtonsProps> {
    render() {
        return <ButtonGroup size='sm'>
            <Button variant='secondary' active>Day</Button>
            <Button variant='secondary'>Week</Button>
            <Button variant='secondary'>Month</Button>
            <Button variant='secondary'>Custom</Button>
        </ButtonGroup>;
    }
}


interface CalendarProps {
    carousel?: boolean;
}

type Range = { from: Date, to: Date };

interface CalendarState {
    clickState: ClickState;
    selected?: Range;
    preview?: Range;
}

enum ClickState {
    Empty = 0,
    FirstDaySelected,
    RangeSelected,
}

enum Dragging {
    None = 0,
    MightDrag,
    From,
    To,
    Range,
    PostDrag,
}

export class Calendar extends React.Component<CalendarProps, CalendarState> {
    state: CalendarState = { clickState: ClickState.Empty };
    dragging = Dragging.None;
    dragReference: Date | undefined = undefined;
    preDragSelected: Range | undefined = undefined;

    get clickState() {
        if (!this.state.selected && this.state.clickState !== ClickState.Empty) {
            this.setState({ clickState: ClickState.Empty });
            return ClickState.Empty;
        }

        return this.state.clickState;
    }

    getRangePreview = (day: Date): Range => {
        const { selected } = this.state;
        const { from, to } = selected ?? {};

        switch (this.clickState) {
            case ClickState.Empty:
                return { from: day, to: day };

            case ClickState.FirstDaySelected:
                if (day < from!) return { from: day, to: to! };
                else return { from: from!, to: day };

            case ClickState.RangeSelected:
                if (day < from!) return { from: day, to: to! };
                else if (day > to!) return { from: from!, to: day };
                else if (abs(+day - +from!) < abs(+day - +to!)) return { from: day, to: to! };
                else return { from: from!, to: day };
        }
    }

    dayClicked = (day: Date, mods: DayModifiers) => {
        if (this.dragging !== Dragging.None) {
            this.dragging = Dragging.None;
            this.dragReference = undefined;
            this.preDragSelected = undefined;
            return;
        }

        if (mods.outside || mods.disabled) return;

        switch (this.clickState) {
            case ClickState.Empty:
                this.setState({ clickState: ClickState.FirstDaySelected });
                break;

            case ClickState.FirstDaySelected:
                this.setState({ clickState: ClickState.RangeSelected });
                break;

            case ClickState.RangeSelected:
                break;
        }

        this.setState({ selected: this.getRangePreview(day) });
    }

    dayHovered = (day: Date): void => {
        let preview: Range | undefined, selected: Range | undefined;
        const { from, to } = this.state.selected ?? {};

        switch (this.clickState) {
            case ClickState.FirstDaySelected:
                preview = this.getRangePreview(day);
                break;
        }

        switch (this.dragging) {
            case Dragging.From:
                selected = { from: day, to: to! };
                break;

            case Dragging.To:
                selected = { from: from!, to: day };
                break;

            case Dragging.Range: {
                const { from, to } = this.preDragSelected!;
                const diff = daysBetween(this.dragReference!, day);
                selected = { from: shiftByDays(from, diff), to: shiftByDays(to, diff) };
                break;
            }

            case Dragging.MightDrag: {
                const ref = this.dragReference!;
                const { from, to } = this.preDragSelected!;

                if (!isDayEqual(day, ref)) {
                    if (isDayEqual(ref, from)) this.dragging = Dragging.From;
                    else if (isDayEqual(ref, to)) this.dragging = Dragging.To;
                    else if (isDayBetween(ref, from, to)) this.dragging = Dragging.Range;
                    else this.dragging = Dragging.None;

                    return this.dayHovered(day);
                }

                break;
            }
        }

        if (selected && selected.from > selected.to) {
            [selected.from, selected.to] = [selected.to, selected.from];
            if (this.dragging === Dragging.From) this.dragging = Dragging.To;
            else if (this.dragging === Dragging.To) this.dragging = Dragging.From;
        }

        if (selected) this.setState({ preview, selected });
        else this.setState({ preview });
    }

    dayMouseDown = (day: Date, _: DayModifiers, e: React.MouseEvent) => {
        const { from, to } = this.state.selected ?? {};
        if (e.button !== 0) return;

        if (from && to && isDayBetween(day, from, to)) {
            this.dragReference = day;
            this.preDragSelected = this.state.selected;
            this.dragging = Dragging.MightDrag;
        }
    }

    dayMouseUp = (day: Date, _: DayModifiers, e: React.MouseEvent) => {
        const { from, to } = this.state.selected ?? {};
        if (e.button !== 0) return;

        if (from && to && isDayBetween(day, from, to)) {
            this.dragReference = undefined;
            this.preDragSelected = undefined;

            switch (this.dragging) {
                case Dragging.None:
                case Dragging.PostDrag:
                case Dragging.MightDrag:
                    this.dragging = Dragging.None;
                    break;

                default:
                    this.dragging = Dragging.PostDrag;
                    break;
            }
        }
    }


    render() {
        const { selected, preview } = this.state;

        return <div className='calendar'>
            <DayPicker
                fixedWeeks
                numberOfMonths={2}
                onDayClick={this.dayClicked}
                onDayMouseEnter={this.dayHovered}
                onDayMouseDown={this.dayMouseDown}
                onDayMouseUp={this.dayMouseUp}
                modifiers={{
                    selected, preview,
                    selectedStart: selected?.from,
                    selectedEnd: selected?.to,
                    previewStart: preview?.from,
                    previewEnd: preview?.to,
                }}
                renderDay={day => <span className='day'>{day.getDate()}</span>}
            />
        </div>;
    }
}
