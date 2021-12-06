import React from 'react';
import Plotly from 'react-plotly.js';
import { AutoSizer } from 'react-virtualized';
import { debounce } from 'lodash';

import './Plot.scss';


export interface PlotProps {
    title: string;
    traces: Plotly.Data[];
}

interface State {
    width: number;
    height: number;
}


export class Plot extends React.Component<PlotProps, State> {
    state = { width: 300, height: 300 };

    onResize = debounce(
        ({ width, height }) => this.setState({ width, height }),
        400,
        { leading: true, trailing: true }
    )

    render() {
        const { title, traces } = this.props;
        const { width, height } = this.state;

        return (
            <div className='plot'>
                <p className='graph-header'>{title}</p>
                <div className='plot-wrapper-outer'>
                    <div className='plot-wrapper-inner'>
                        <AutoSizer defaultHeight={100} onResize={this.onResize}>{
                            _ =>
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
