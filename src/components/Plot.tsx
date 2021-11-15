import React from 'react';
import Plotly from 'react-plotly.js';
import { AutoSizer } from 'react-virtualized';

import './Plot.scss';


export interface PlotProps {
    title: string;
    traces: Plotly.Data[];
}

interface State {}


export class Plot extends React.Component<PlotProps, State> {
    render() {
        const { title, traces } = this.props;

        return (
            <div className='plot'>
                <p className='graph-header'>{title}</p>
                <div className='plot-wrapper-outer'>
                    <div className='plot-wrapper-inner'>
                        <AutoSizer defaultHeight={100}>{
                            ({ width, height }) =>
                                <Plotly
                                    data={traces}
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
