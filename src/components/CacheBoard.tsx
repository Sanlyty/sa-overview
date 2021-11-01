import React from 'react';
import { Card } from 'react-bootstrap';
import Plot from 'react-plotly.js';

class CacheBoard extends React.Component {
    render () {
        return <>
            <Card>
                <Card.Header style={{ background: '#ffb8e2' }}>
                    Usage Rate of Cache Paths analysis
                </Card.Header>
                <Card.Body>
                    Lorem ipsum dolor sit amet.
                    <br/>
                    <Plot
                        layout={{
                            title: 'Cache: Usage rates of access path between MP units and HIEs.',
                            width: 900,
                            height: 300,
                            legend: { orientation: 'h', y: -0.15 }
                        }}
                        data={[
                            {
                                name: 'MPU-010.HIE-01G',
                                type: 'scatter', mode: 'lines',
                                x: [1, 2, 3, 4, 5, 6],
                                y: [2, 6, 4, 5, 7, 6],
                                marker: {color: 'red'},
                            },
                            {
                                name: 'MPU-210.HIE-21G',
                                type: 'scatter', mode: 'lines',
                                x: [1, 2, 3, 4, 5, 6],
                                y: [5, 8, 3, 2, 4, 1],
                            },
                        ]}
                        config={{ displaylogo: false }}
                    />
                    <br/>
                    <Plot
                        layout={{
                            title: 'Cache: Usage rates of access path between HIEs units and ISWs.',
                            width: 900,
                            height: 300,
                            legend: { orientation: 'h', y: -0.15 }
                        }}
                        data={[
                            {
                                name: 'HIE-01G.ISW01',
                                type: 'scatter', mode: 'lines',
                                x: [1, 2, 3, 4, 5, 6],
                                y: [23, 14, 18, 10, 7, 8],
                                marker: {color: 'blue'},
                            },
                            {
                                name: 'HIE-21G.ISW11',
                                type: 'scatter', mode: 'lines',
                                x: [1, 2, 3, 4, 5, 6],
                                y: [15, 18, 17, 14, 18, 16],
                                marker: {color: 'green'},
                            },
                        ]}
                        config={{ displaylogo: false }}
                    />
                </Card.Body>
            </Card>
            <Card>
                <Card.Header style={{ background: '#ffe189' }}>
                    Write Pending analysis
                </Card.Header>
                <Card.Body>
                    <Plot
                        layout={{
                            title: 'Cache: Write pending rate.',
                            width: 900,
                            height: 300,
                            legend: { orientation: 'h', y: -0.15 }
                        }}
                        data={[
                            {
                                name: 'ALL',
                                type: 'scatter', mode: 'lines',
                                x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                y: [4, 4, 6, 4, 4, 2, 4, 4, 4, 3],
                                marker: {color: 'blue'},
                            },
                        ]}
                        config={{ displaylogo: false }}
                    />
                </Card.Body>
            </Card>
        </>;
    }
}

export default CacheBoard;
