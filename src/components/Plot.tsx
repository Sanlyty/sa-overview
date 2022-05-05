import React from 'react';
import Plotly from 'react-plotly.js';
import { AutoSizer } from 'react-virtualized';
import { debounce } from 'lodash';

import './Plot.scss';
import { dateRangeContext } from './DatePicker';
import { TypedArray } from 'plotly.js';
import { DateRange, DateTime, Duration, toTemporal } from '../utils/temporal';

const { floor, max } = Math;

type RequiredPlotDataKeys = 'x' | 'y' | 'type';
export interface PlotData extends
    Partial<Omit<Plotly.PlotData, RequiredPlotDataKeys>>,
    Pick<Plotly.PlotData, RequiredPlotDataKeys> {}

export interface PlotProps {
    title: string;
    traces: PlotData[];
}

interface State {
    width: number;
    height: number;
    filteredTraces?: PlotData[];
    previousRange?: DateRange;
}


export class Plot extends React.Component<PlotProps, State> {
    static contextType = dateRangeContext;
    context!: React.ContextType<typeof Plot.contextType>;

    state: State = { width: 300, height: 300 };

    onResize = debounce(
        ({ width, height }) => this.setState({ width, height }),
        400,
        { leading: true, trailing: true }
    )

    componentDidMount() {
        this.setState({
            filteredTraces: this.props.traces.map(this.filterTraceData),
            previousRange: this.context.currentRange(),
        });
    }

    componentDidUpdate() {
        const { previousRange } = this.state;
        const currentRange = this.context.currentRange();

        if (previousRange === undefined || !DateRange.eq(previousRange, currentRange)) {
            this.setState({
                filteredTraces: this.props.traces.map(this.filterTraceData),
                previousRange: currentRange,
            });
        }
    }

    findDateInHomogeneousTimeSeries = (date: DateTime, trace: PlotData): number => {
        const { x } = trace as { x: Date[] };
        if (!(x[0] instanceof Date)) throw new TypeError('Expected a time series');

        const dateMs = date.epochMilliseconds;
        const fromMs = +x[0];
        const toMs = +x[x.length - 1];

        if (dateMs < fromMs) return 0;
        if (dateMs > toMs) return x.length - 1;

        const totalDuration = toMs - fromMs;
        const partialDuration = dateMs - fromMs;

        const t = partialDuration / totalDuration;

        let i = floor(t * 0.99 * (x.length - 1)) - 1;
        while (i > 0 && +x[i] > dateMs) { i = max(0, i - 10); }
        while (i < x.length - 1 && +x[i] < dateMs) { i++; }

        return i;
    }

    filterTraceData = (unfiltered: PlotData): PlotData => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let { x, y }: { x: any[] | TypedArray, y: any[] | TypedArray } = unfiltered;
        if (!(x[0] instanceof Date)) return unfiltered;
        if (this.context === null) return unfiltered;

        const { from, to } = this.context.currentRange();
        const startIndex = this.findDateInHomogeneousTimeSeries(from, unfiltered);
        const endIndex = this.findDateInHomogeneousTimeSeries(to, unfiltered);

        y = y.slice(startIndex, endIndex);
        x = x.slice(startIndex, endIndex);

        return {
            ...unfiltered,
            ...{ x, y },
        };
    }

    render() {
        const { title, traces } = this.props;
        const { width, height } = this.state;

        let { filteredTraces } = this.state;
        filteredTraces = filteredTraces ?? traces.map(this.filterTraceData);

        return (
            <div className='plot'>
                <p className='graph-header'>{title}</p>
                <div className='plot-wrapper-outer'>
                    <div className='plot-wrapper-inner'>
                        <AutoSizer defaultHeight={100} onResize={this.onResize}>{
                            _ =>
                                <Plotly
                                    data={filteredTraces!}
                                    config={{ displaylogo: false }}
                                    layout={{
                                        width, height,
                                        legend: { orientation: 'h', y: -0.15 },
                                        margin: { l: 25, r: 25, t: 0, b: 0 },
                                    }}
                                />
                        }</AutoSizer>
                    </div>
                </div>
            </div>
        );
    }
}
