import React from 'react';
import { CardBoard } from './CardBoard';
import { Plot } from './Plot';


export class CacheBoard extends React.Component {
    render () {
        return <CardBoard>
            {{
                'cache-path-usage': {
                    uid: 'cache-path-usage',
                    title: 'Usage Rate of Cache Paths analysis',
                    color: '#ffb8e2',
                    children: <>
                        Lorem ipsum dolor sit amet.
                        <br/>
                        <Plot
                            title='Cache: Usage rates of access path between MP units and HIEs.'
                            traces={[
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
                        />
                        <br/>
                        <Plot
                            title='Cache: Usage rates of access path between HIEs units and ISWs.'
                            traces={[
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
                        />
                    </>
                },
                'write-pending': {
                    uid: 'write-pending',
                    title: 'Write Pending analysis',
                    color: '#ffe189',

                    children: <>
                        <Plot
                            title='Cache: Write pending rate.'
                            traces={[
                                {
                                    name: 'ALL',
                                    type: 'scatter', mode: 'lines',
                                    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                    y: [4, 4, 6, 4, 4, 2, 4, 4, 4, 3],
                                    marker: {color: 'blue'},
                                },
                            ]}
                        />
                    </>
                },
                'foobar-lipsum': {
                    uid: 'foobar-lipsum',
                    title: 'Lorem ipsum.',
                    color: '#59c96d',

                    children: <>
                        <Plot
                            title='Dolor sit.'
                            traces={[
                                {
                                    name: 'ALL',
                                    type: 'scatter', mode: 'lines',
                                    x: [1, 2, 3],
                                    y: [3,-2, 6],
                                    marker: {color: 'green'},
                                },
                            ]}
                        />
                        <Plot
                            title='Amet adipiscing.'
                            traces={[
                                {
                                    name: 'ALL',
                                    type: 'scatter', mode: 'lines',
                                    x: [1, 2, 3],
                                    y: [-8, 0, 64],
                                    marker: {color: 'green'},
                                },
                            ]}
                        />
                    </>
                },
            }}
        </CardBoard>;
    }
}
