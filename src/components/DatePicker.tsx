import React from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { ButtonGroup, Button } from 'react-bootstrap';
import { toTemporalInstant, Temporal } from '@js-temporal/polyfill';
const { abs } = Math;
const { isArray } = Array;

import 'react-day-picker/lib/style.css';
import './DatePicker.scss';

const yeet = (err: unknown = new Error('Assertion error.')) => { throw err; };
const assertSome = <T,>(value: T | undefined | null): T => value ?? yeet(`Expected a value, found ${value}`);

type DateTime = Temporal.ZonedDateTime;
type Duration = Temporal.Duration;

export interface DateRange {
    from: DateTime;
    to: DateTime;
}

interface LegacyDateRange {
    from: Date;
    to: Date;
}

const toTemporal = (d: Date): DateTime =>
    toTemporalInstant
        .call(d)
        .toZonedDateTimeISO(Temporal.Now.timeZone());

function toDate (d: DateTime): Date;
function toDate (d: DateTime | undefined): Date | undefined;
function toDate (d?: DateTime) {
    if (d === undefined) return;
    return new Date(d.epochMilliseconds);
}

function toLegacyDateRange (r: DateRange): LegacyDateRange;
function toLegacyDateRange (r: DateRange | undefined): LegacyDateRange | undefined;
function toLegacyDateRange (r?: DateRange) {
    if (r === undefined) return;
    return {
        from: toDate(r.from),
        to: toDate(r.to),
    };
}

const DateTime = {
    lt: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) < 0,
    lte: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) <= 0,
    gte: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) >= 0,
    gt: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) > 0,
    eq: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) === 0,
};

const Duration = {
    lt: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) < 0,
    lte: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) <= 0,
    gte: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) >= 0,
    gt: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) > 0,
    eq: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) === 0,
};


function daysBetween(a: DateTime, b: DateTime) {
    return a.until(b).total({ unit: 'days' });
}

function isDayBetween(date: DateTime, from: DateTime, to: DateTime) {
    return DateTime.gte(date, from) && DateTime.lte(date, to);
}

function isDayEqual(a: DateTime, b: DateTime) {
    return abs(daysBetween(a, b)) < 1;
}

export type DateRangeLike = DateRange | 'day' | 'week' | 'month';

export class DateRangeContext {
    constructor (
        private component: DateRangeProvider,
        private _value: DateRangeLike | undefined = 'day'
    ) {}

    private previousValue: DateRangeLike = 'day';

    get value(): DateRangeLike | undefined { return this._value; }

    setValue(value: DateRangeLike | 'custom' | undefined) {
        console.log('setting value:', value);

        this.previousValue = this._value ?? this.previousValue;
        if (value === 'custom') value = undefined;

        const processedValue = this.dateRangeLikeToDateRange(value);
        const eventResult = this.component.props.onChange?.(processedValue);

        // the event decided to veto the update
        if (eventResult === false) return;

        this._value = value;
        this.component.setState({ data: this });
    }

    optionName(): 'day' | 'week' | 'month' | 'custom' {
        if (typeof this._value == 'string') return this._value;
        return 'custom';
    }

    currentRange(): DateRange {
        return this.dateRangeLikeToDateRange(this._value);
    }

    private dateRangeLikeToDateRange = (value: DateRangeLike | undefined): DateRange => {
        const now = Temporal.Now.zonedDateTimeISO();
        if (value === undefined) value = this.previousValue;

        switch (value) {
            case 'day': {
                const from = now.startOfDay();
                const to = from.add({ days: 1 });
                return { from, to };
            }

            case 'week': {
                const to = now.startOfDay().add({ days: 1 });
                const from = to.subtract({ weeks: 1 });
                return { from, to };
            }

            case 'month': {
                const to = now.startOfDay().add({ days: 1 });
                const from = to.subtract({ months: 1 });
                return { from, to };
            }

            default:
                return value;
        }
    }
}

export interface DateRangeProviderProps {
    defaultValue?: DateRangeLike;
    onChange?: (range: DateRange) => boolean | void;
}

export interface DateRangeProviderState {
    data: DateRangeContext;
}

export const dateRangeContext = React.createContext<DateRangeContext>(null!);
dateRangeContext.displayName = 'DateRangeContext';

export class DateRangeProvider
extends React.Component<DateRangeProviderProps, DateRangeProviderState>
{
    state = { data: new DateRangeContext(this, this.props.defaultValue) };

    render() {
        return <dateRangeContext.Provider value={Object.create(this.state.data)}>
            {this.props.children}
        </dateRangeContext.Provider>;
    }
}


export interface QuickButtonsProps {
    onChange?: (selected: QuickButtonKeys) => boolean | void;
}

type QuickButtonKeys = 'day' | 'week' | 'month' | 'custom';

const fakeL10n: Record<QuickButtonKeys, string> = {
    day: 'Day',
    week: 'Week',
    month: 'Month',
    custom: 'Custom',
};

export class QuickButtons extends React.Component<QuickButtonsProps> {
    static contextType = dateRangeContext;
    context!: React.ContextType<typeof QuickButtons.contextType>;

    render() {
        const selected: QuickButtonKeys = this.context.optionName();

        return <ButtonGroup size='sm'>
            {
                (['day', 'week', 'month', 'custom'] as const).map(k =>
                    <Button
                        key={k}
                        variant='secondary'
                        active={selected === k || isArray(selected) && k === 'custom'}
                        onClick={() => {
                            const eventResult = this.props.onChange?.(k);
                            if (eventResult === false) return;
                            this.context.setValue(k);
                        }}
                    >
                        {fakeL10n[k]}
                    </Button>
                )
            }
        </ButtonGroup>;
    }
}


interface CalendarProps {}

interface CalendarState {
    clickState: ClickState;
    preview?: DateRange;
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
    static contextType = dateRangeContext;
    context!: React.ContextType<typeof QuickButtons.contextType>;

    state: CalendarState = { clickState: ClickState.Empty };
    dragging = Dragging.None;

    _dragReference: DateTime | undefined = undefined;
    get dragReference(): DateTime | undefined {
        console.log(`Getting dragReference: ${this._dragReference}`);
        return this._dragReference;
    }
    set dragReference(value: DateTime | undefined) {
        console.log(`Setting dragReference to: ${this._dragReference}`);
        this._dragReference = value;
    }

    preDragSelected: DateRange | undefined = undefined;

    get clickState() {
        if (this.context.value === undefined && this.state.clickState !== ClickState.Empty) {
            this.setState({ clickState: ClickState.Empty });
            return ClickState.Empty;
        }

        return this.state.clickState;
    }

    getRangePreview = (day: DateTime): DateRange => {
        const { from, to } = this.context.currentRange();

        switch (this.clickState) {
            case ClickState.Empty:
                return { from: day, to: day };

            case ClickState.FirstDaySelected:
                if (DateTime.lt(day, from)) return { from: day, to: to };
                else return { from: from, to: day };

            case ClickState.RangeSelected:
                if (DateTime.lt(day, from)) return { from: day, to: to };
                else if (DateTime.gt(day, to)) return { from: from, to: day };
                else if (Duration.lt(from.until(day), day.until(to))) return { from: day, to: to };
                else return { from: from, to: day };
        }
    }

    dayClicked = (_day: Date, mods: DayModifiers) => {
        const day = toTemporal(_day);

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

        this.context.setValue(this.getRangePreview(day));
    }

    dayHovered = (_day: Date): void => {
        const day = toTemporal(_day);

        let preview: DateRange | undefined, selected: DateRange | undefined;
        const { from, to } = this.context.currentRange();

        switch (this.clickState) {
            case ClickState.FirstDaySelected:
                preview = this.getRangePreview(day);
                break;
        }

        switch (this.dragging) {
            case Dragging.From:
                selected = { from: day, to: assertSome(to) };
                break;

            case Dragging.To:
                selected = { from: assertSome(from), to: day };
                break;

            case Dragging.Range: {
                const { from, to } = assertSome(this.preDragSelected);
                const days = daysBetween(assertSome(this.dragReference), day);
                selected = { from: from.add({ days }), to: to.add({ days }) };
                break;
            }

            case Dragging.MightDrag: {
                const ref = assertSome(this.dragReference);
                const { from, to } = assertSome(this.preDragSelected);

                if (!isDayEqual(day, ref)) {
                    if (isDayEqual(ref, from)) this.dragging = Dragging.From;
                    else if (isDayEqual(ref, to)) this.dragging = Dragging.To;
                    else if (isDayBetween(ref, from, to)) this.dragging = Dragging.Range;
                    else this.dragging = Dragging.None;

                    return this.dayHovered(_day);
                }

                break;
            }
        }

        if (selected && DateTime.gt(selected.from, selected.to)) {
            [selected.from, selected.to] = [selected.to, selected.from];
            if (this.dragging === Dragging.From) this.dragging = Dragging.To;
            else if (this.dragging === Dragging.To) this.dragging = Dragging.From;
        }

        if (selected) {
            this.setState({ preview });
            this.context.setValue(selected);
        } else {
            this.setState({ preview });
        }
    }

    dayMouseDown = (_day: Date, _: DayModifiers, e: React.MouseEvent) => {
        const day = toTemporal(_day);
        const { from, to } = this.context.currentRange();
        if (e.button !== 0) return;

        if (from && to && isDayBetween(day, from, to)) {
            this.dragReference = day;
            this.preDragSelected = this.context.currentRange();
            this.dragging = Dragging.MightDrag;
        }
    }

    dayMouseUp = (_day: Date, _: DayModifiers, e: React.MouseEvent) => {
        const day = toTemporal(_day);
        const { from, to } = this.context.currentRange();
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

    getSnapshotBeforeUpdate() { return this.context.value ?? null; }

    componentDidUpdate(_: unknown, __: unknown, value: DateRangeLike | undefined) {
        const oldValue = value ?? undefined;
        const newValue = this.context.value;

        // date range has been updated
        if (newValue !== oldValue) {
            if (newValue === undefined) {
                this.setState({ clickState: ClickState.Empty });
            } else {
                this.setState({ clickState: ClickState.RangeSelected });
            }
        }
    }


    render() {
        const selected = this.context.value === undefined ? undefined : this.context.currentRange();
        const { preview } = this.state;

        return <div className='calendar'>
            <DayPicker
                fixedWeeks
                numberOfMonths={2}
                onDayClick={this.dayClicked}
                onDayMouseEnter={this.dayHovered}
                onDayMouseDown={this.dayMouseDown}
                onDayMouseUp={this.dayMouseUp}
                modifiers={{
                    selected: toLegacyDateRange(selected),
                    preview: toLegacyDateRange(preview),
                    selectedStart: toDate(selected?.from),
                    selectedEnd: toDate(selected?.to),
                    previewStart: toDate(preview?.from),
                    previewEnd: toDate(preview?.to),
                }}
                renderDay={day => <span className='day'>{day.getDate()}</span>}
            />
        </div>;
    }
}
