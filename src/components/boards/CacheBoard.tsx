import React from 'react';
import { CardBoard } from '../CardBoard';

import '../../utils/fakeData';
import { generateFakeTimeSeries } from '../../utils/fakeData';
import { Temporal } from '@js-temporal/polyfill';
import { DateTime } from '../../utils/temporal';

const { max } = Math;


const gen = () => {
    const { x, y } = generateFakeTimeSeries(
        DateTime.now().subtract({ days: 30 }),
        DateTime.now().add({ days: 30 }),
        Temporal.Duration.from({ minutes: 10 }),
        8,
        0.4
    );
    return { x: x.map(_ => new Date(_)), y: y.map(_ => max(_, 0)) };
};
export class CacheBoard extends React.Component {
    render () {
        return <CardBoard>
            {{
                'cache-path-usage': {
                    title: 'Usage Rate of Cache Paths analysis',
                    color: '#ffb8e2',
                    plots: {
                        'mps-to-hies': {
                            title: 'Cache: Usage rates of access path between MP units and HIEs.',
                            layout: { x: 0, y: 0, w: 2, h: 1 },
                            traces: [
                                {
                                    name: 'MPU-010.HIE-01G',
                                    type: 'scattergl', mode: 'lines',
                                    marker: {color: 'red'},
                                    ...gen(),
                                },
                                {
                                    name: 'MPU-210.HIE-21G',
                                    type: 'scattergl', mode: 'lines',
                                    ...gen(),
                                },
                            ],
                        },
                        'hies-to-isws': {
                            title: 'Cache: Usage rates of access path between HIEs units and ISWs.',
                            layout: { x: 0, y: 1, w: 2, h: 1 },
                            traces: [
                                {
                                    name: 'HIE-01G.ISW01',
                                    type: 'scattergl', mode: 'lines',
                                    marker: {color: 'blue'},
                                    ...gen(),
                                },
                                {
                                    name: 'HIE-21G.ISW11',
                                    type: 'scattergl', mode: 'lines',
                                    marker: {color: 'green'},
                                    ...gen(),
                                },
                            ],
                        },
                    },
                },
                'write-pending': {
                    title: 'Write Pending analysis',
                    color: '#ffe189',
                    plots: {
                        'write-pending-rate': {
                            title: 'Cache: Write pending rate.',
                            layout: { x: 0, y: 0, w: 2, h: 1 },
                            traces: [
                                {
                                    name: 'ALL',
                                    type: 'scattergl', mode: 'lines',
                                    marker: {color: 'blue'},
                                    ...gen(),
                                },
                            ],
                        },
                    }
                },
                'foobar-lipsum': {
                    title: 'Lorem ipsum.',
                    color: '#59c96d',
                    plots: {
                        'dolor-sit': {
                            title: 'Dolor sit.',
                            layout: { x: 0, y: 0, w: 1, h: 1 },
                            traces: [
                                {
                                    name: 'ALL',
                                    type: 'scattergl', mode: 'lines',
                                    marker: {color: 'green'},
                                    ...gen(),
                                },
                            ],
                        },
                        'amet-adipiscing': {
                            title: 'Amet adipiscing.',
                            layout: { x: 1, y: 0, w: 1, h: 1 },
                            traces: [
                                {
                                    name: 'ALL',
                                    type: 'scattergl', mode: 'lines',
                                    marker: {color: 'green'},
                                    ...gen(),
                                },
                            ],
                        },
                    },
                },
            }}
        </CardBoard>;
    }
}
