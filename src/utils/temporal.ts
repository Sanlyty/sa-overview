import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
const { abs, round } = Math;

export type DateTime = Temporal.ZonedDateTime;
export type Duration = Temporal.Duration;

export interface DateRange {
    from: DateTime;
    to: DateTime;
}

export interface LegacyDateRange {
    from: Date;
    to: Date;
}

export const toTemporal = (d: Date): DateTime =>
    toTemporalInstant
        .call(d)
        .toZonedDateTimeISO(Temporal.Now.timeZone());

export function toLegacyDate (d: DateTime): Date;
export function toLegacyDate (d: DateTime | undefined): Date | undefined;
export function toLegacyDate (d?: DateTime) {
    if (d === undefined) return;
    return new Date(d.epochMilliseconds);
}

export function toLegacyDateRange (r: DateRange): LegacyDateRange;
export function toLegacyDateRange (r: DateRange | undefined): LegacyDateRange | undefined;
export function toLegacyDateRange (r?: DateRange) {
    if (r === undefined) return;
    return {
        from: toLegacyDate(r.from),
        to: toLegacyDate(r.to),
    };
}

export const DateTime = {
    now: () => Temporal.Now.zonedDateTimeISO(),

    lt: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) < 0,
    lte: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) <= 0,
    gte: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) >= 0,
    gt: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) > 0,
    eq: (a: DateTime, b: DateTime) => Temporal.ZonedDateTime.compare(a, b) === 0,

    max: (...args: DateTime[]) => args.reduce((a, b) => DateTime.gte(a, b) ? a : b),
    min: (...args: DateTime[]) => args.reduce((a, b) => DateTime.lte(a, b) ? a : b),

    isBetween: (date: DateTime, start: DateTime, end: DateTime) =>
        DateTime.gte(date, start) && DateTime.lte(date, end),

    clamp: (date: DateTime, start: DateTime, end: DateTime) =>
        DateTime.lt(date, start) ? start :
            DateTime.gt(date, end) ? end :
                date,

    startOfDay: (date: DateTime) => date.startOfDay(),
    endOfDay: (date: DateTime) => date.startOfDay().add({ days: 1 }).subtract({ seconds: 1 }),

    startOfWeek: (date: DateTime) => date.subtract({ days: date.dayOfWeek }).startOfDay(),
    endOfWeek: (date: DateTime) => DateTime.startOfWeek(date).add({ weeks: 1 }).subtract({ seconds: 1 }),

    startOfMonth: (date: DateTime) => date.startOfDay().with({ day: 1 }),
    endOfMonth: (date: DateTime) => DateTime.startOfMonth(date).add({ months: 1 }).subtract({ seconds: 1 }),

    areSameDay: (a: DateTime, b: DateTime) => DateTime.eq(a.startOfDay(), b.startOfDay()),
};

export const Duration = {
    lt: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) < 0,
    lte: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) <= 0,
    gte: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) >= 0,
    gt: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) > 0,
    eq: (a: Duration, b: Duration) => Temporal.Duration.compare(a, b) === 0,

    max: (...args: Duration[]) => args.reduce((a, b) => Duration.gte(a, b) ? a : b),
    min: (...args: Duration[]) => args.reduce((a, b) => Duration.lte(a, b) ? a : b),

    isBetween: (duration: Duration, min: Duration, max: Duration) =>
        Duration.gte(duration, min) && Duration.lte(duration, max),

    clamp: (duration: Duration, min: Duration, max: Duration) =>
        Duration.lt(duration, min) ? min :
            Duration.gt(duration, max) ? max :
                duration,

    div,

    scale: (s: number, d: Duration, unit: keyof Temporal.DurationLike = 'microseconds') =>
        Temporal.Duration.from({ [unit]: round(s * d.total(unit)) }),
};

function div(a: Duration, b: Duration, unit?: Temporal.DurationTotalOf): number
function div(a: Duration, b: number, unit?: keyof Temporal.DurationLike): Duration
function div(a: Duration, b: Duration | number, unit: Temporal.DurationTotalOf = 'microseconds') {
    if (typeof b === 'number') {
        const u = unit as keyof Temporal.DurationLike;
        return Temporal.Duration.from({ [u]: round(a.total(u) / b) });
    } else {
        return a.total(unit) / b.total(unit);
    }
}

export const DateRange = {
    areOverlaping: (a: DateRange, b: DateRange) => {
        const from = DateTime.max(a.from, b.from);
        const to = DateTime.min(a.to, b.to);
        return DateTime.lt(from, to);
    },

    eq: (a: DateRange, b: DateRange) =>
        DateTime.eq(a.from, b.from) && DateTime.eq(a.to, b.to),
};

export function isDayEqual(a: DateTime, b: DateTime) {
    return abs(a.until(b).total('days')) < 1;
}

export type DateRangeLike = DateRange | 'day' | 'week' | 'month';
