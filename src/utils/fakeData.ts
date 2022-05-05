import { DateTime, Duration } from './temporal';
import random from 'random';
const { round, log2 } = Math;

function roundToPow2(x: number): number {
    return 2 ** round(log2(x));
}

/**
 * Generate a fake series of timestamped values using the Midpoint Method
 * @see https://web.archive.org/web/20170812230846/http://www.gameprogrammer.com/fractal.html#midpoint
 *
 * @param from The date & time of the first timestamp
 * @param to The date & time of the last timestamp
 * @param approximateStep Approximate duration between two samples
 * @param subsampleCount The number of subsamples used for the Midpoint Method, must be 2^n - 1
 * @param subsampleWeight Weight of the noise to add on each subsequent midpoint
 * @param generatePoint Function which will generate random value at timestamp, given fraction t∈[0,1]
 * @param generateNoise Function which will generate noise, given t∈[0,1]
 *                      and the order of the midpoint k=1,2,...log2(steps+1)
 */
export function generateFakeTimeSeries(
    from: DateTime,
    to: DateTime,
    approximateStep: Duration,
    subsampleCount = 3,
    subsampleWeight = 0.5,
    generatePoint: (t: number) => number = () => random.float(),
    generateNoise: (k: number, t: number) => number = () => random.float() - 0.5,
): { x: number[], y: number[] }
{
    subsampleCount = roundToPow2(subsampleCount + 1) - 1;
    if (DateTime.gt(from, to)) [from, to] = [to, from];

    const N = subsampleCount + 1;
    const passCount = log2(N);
    const totalDuration = from.until(to);

    const samplesEstimate = Duration.div(totalDuration, approximateStep);
    const samples = round(samplesEstimate / N) * N + 1;
    const t = (i: number) => i / samples;

    const y = Array<number>(samples).fill(0);

    // generate the primary points
    for (let i = 0; i < samples; i += N) {
        y[i] = generatePoint(t(i));
    }

    // incrementally add details
    let n = N;
    for (let k = 1; k <= passCount; k++) {
        n /= 2;
        for (let i = n; i < samples; i += 2*n) {
            const avg = (y[i-n] + y[i+n]) / 2;
            y[i] = avg + generateNoise(k, t(i)) * subsampleWeight ** k;
        }
    }

    const fromMs = from.epochMilliseconds;
    const toMs = to.epochMilliseconds;

    const x = Array(samples).fill(0).map(
        (_, i) => fromMs + (toMs - fromMs) * t(i)
    );

    return { x, y };
}
