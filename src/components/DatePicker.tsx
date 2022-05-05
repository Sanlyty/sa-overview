import React from 'react';
import DayPicker, { CaptionElementProps, DayModifiers } from 'react-day-picker';
import { ButtonGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { DateRange, DateRangeLike, DateTime, Duration, isDayEqual, toLegacyDate, toLegacyDateRange, toTemporal } from '../utils/temporal';
const { round } = Math;
const { isArray } = Array;

import 'react-day-picker/lib/style.css';
import './DatePicker.scss';

const yeet = (err: unknown = new Error('Assertion error.')) => { throw err; };
const assertSome = <T,>(value: T | undefined | null): T => value ?? yeet(`Expected a value, found ${value}`);


export class DateRangeContext
{
    // a bulletproof way to check if there's been an update
    public counter = 0;
    incrementCounter() {
        this.counter++;
        if (this.counter >= Number.MAX_SAFE_INTEGER) this.counter = 0;
    }

    constructor (
        private component: DateRangeProvider,
        private _value: DateRangeLike | undefined = 'day'
    ) {}

    private previousValue: DateRangeLike = 'day';

    get value(): DateRangeLike | undefined { return this._value; }

    setValue(value: DateRangeLike | 'custom' | undefined) {
        this.previousValue = this._value ?? this.previousValue;
        if (value === 'custom') value = undefined;

        const processedValue = this.dateRangeLikeToDateRange(value);
        const eventResult = this.component.props.onChange?.(processedValue);

        // the event decided to veto the update
        if (eventResult === false) return;

        this._value = value;
        this.incrementCounter();
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
        const now = DateTime.now();
        if (value === undefined) value = this.previousValue;

        switch (value) {
            case 'day': {
                const from = DateTime.startOfDay(now);
                const to = DateTime.endOfDay(now);
                return { from, to };
            }

            case 'week': {
                const from = DateTime.startOfWeek(now);
                const to = DateTime.endOfWeek(now);
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
    month: DateTime;
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
    readonly monthCount = 2;

    static contextType = dateRangeContext;
    context!: React.ContextType<typeof QuickButtons.contextType>;

    state: CalendarState = { clickState: ClickState.Empty, month: DateTime.now() };
    dragging = Dragging.None;

    _dragReference: DateTime | undefined = undefined;
    get dragReference(): DateTime | undefined {
        return this._dragReference;
    }
    set dragReference(value: DateTime | undefined) {
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
                const days = round(assertSome(this.dragReference).until(day).total('days'));
                selected = { from: from.add({ days }), to: to.add({ days }) };
                break;
            }

            case Dragging.MightDrag: {
                const ref = assertSome(this.dragReference);
                const { from, to } = assertSome(this.preDragSelected);

                if (!isDayEqual(day, ref)) {
                    if (isDayEqual(ref, from)) this.dragging = Dragging.From;
                    else if (isDayEqual(ref, to)) this.dragging = Dragging.To;
                    else if (DateTime.isBetween(ref, from, to)) this.dragging = Dragging.Range;
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

        if (DateTime.isBetween(day, from, to)) {
            this.dragReference = day;
            this.preDragSelected = this.context.currentRange();
            this.dragging = Dragging.MightDrag;
        }
    }

    dayMouseUp = (_day: Date, _: DayModifiers, e: React.MouseEvent) => {
        const day = toTemporal(_day);
        const { from, to } = this.context.currentRange();
        if (e.button !== 0) return;

        if (DateTime.isBetween(day, from, to)) {
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

    monthChange = (_month: Date) => {
        const month = toTemporal(_month);
        this.setState({ month });
    }

    moveRangeToView = () => {
        const selectedRange = this.context.currentRange();
        const monthRange = {
            from: DateTime.startOfMonth(this.state.month),
            to: DateTime.endOfMonth(this.state.month),
        };

        if (DateRange.areOverlaping(selectedRange, monthRange)) return;

        let month: DateTime | null = null;
        if (DateTime.lt(monthRange.to, selectedRange.from)) {
            month = DateTime.startOfMonth(selectedRange.from).subtract({
                months: this.monthCount - 1,
            });
        }
        else if (DateTime.lt(selectedRange.to, monthRange.from)) {
            month = DateTime.startOfMonth(selectedRange.to);
        }

        if (month !== null) this.setState({ month });
    }

    lastCounter = 0;
    componentDidUpdate() {
        if (this.context.counter !== this.lastCounter) {
            this.lastCounter = this.context.counter;

            if (this.dragging === Dragging.None) this.moveRangeToView();

            if (this.context.value === undefined) {
                this.setState({ clickState: ClickState.Empty });
            } else {
                this.setState({ clickState: ClickState.RangeSelected });
            }
        }
    }

    isLeftmostMonth = (_date: Date) => {
        const date = toTemporal(_date);
        const { month } = this.state;

        return date.month === month.month;
    }

    isRightmostMonth = (_date: Date) => {
        const date = toTemporal(_date);
        const { month } = this.state;

        const monthShifted = month.add({ months: this.monthCount - 1 });
        return monthShifted.month === date.month;
    }

    nextMonth = () => this.setState({ month: this.state.month.add({ months: 1 }) });
    previousMonth = () => this.setState({ month: this.state.month.subtract({ months: 1 }) });


    render() {
        const selected = this.context.value === undefined ? undefined : this.context.currentRange();
        const { preview, month } = this.state;

        return <div className='calendar'>
            <DayPicker
                fixedWeeks
                numberOfMonths={this.monthCount}
                month={toLegacyDate(month)}
                onDayClick={this.dayClicked}
                onDayMouseEnter={this.dayHovered}
                onDayMouseDown={this.dayMouseDown}
                onDayMouseUp={this.dayMouseUp}
                onMonthChange={this.monthChange}
                modifiers={{
                    selected: toLegacyDateRange(selected),
                    preview: toLegacyDateRange(preview),
                    selectedStart: toLegacyDate(selected?.from),
                    selectedEnd: toLegacyDate(selected?.to),
                    previewStart: toLegacyDate(preview?.from),
                    previewEnd: toLegacyDate(preview?.to),
                }}
                renderDay={day => <span className='day'>{day.getDate()}</span>}
                captionElement={(props: CaptionElementProps) =>
                    <div className='DayPicker-Caption'>
                        <div className='flex'>
                            {this.isLeftmostMonth(props.date)
                                ? <div className='icon' onClick={this.previousMonth}>
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                </div>
                                : <div className='icon' />
                            }
                            <div className='grow'>
                                {toTemporal(props.date).toLocaleString('en-GB', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </div>
                            {this.isRightmostMonth(props.date)
                                ? <div className='icon' onClick={this.nextMonth}>
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </div>
                                : <div className='icon' />
                            }
                        </div>
                    </div>
                }
            />
        </div>;
    }
}
