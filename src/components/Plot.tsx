import React from 'react';
import Plotly from 'react-plotly.js';

interface Props {
    title: string,
    traces: Plotly.Data[],
}

interface State {}


export class Plot extends React.Component<Props, State> {
    render() {
        const { title, traces } = this.props;

        return (
            <Plotly
                data={traces}
                config={{ displaylogo: false }}
                layout={{
                    title,
                    width: 900,
                    height: 300,
                    legend: { orientation: 'h', y: -0.15 }
                }}
            />
        );
    }
}
