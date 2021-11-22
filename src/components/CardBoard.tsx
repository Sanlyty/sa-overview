import React, { createRef } from 'react';
import { debounce, omit } from 'lodash';
import { Layout } from 'react-grid-layout';

import { Card, CardProps } from './Card';
import { Plot, PlotProps as PlotComponentProps } from './Plot';

import './CardBoard.scss';
import * as Header from './Header';


interface PlotProps
extends PlotComponentProps {
    layout: Omit<Layout, 'i'>
}

export interface CardBoardItem
extends Omit<CardProps, 'layout' | 'uid'> {
    plots: Record<string, PlotProps>
}

export interface CardBoardProps {
    children: Record<string, CardBoardItem>
}

interface State {
    draggingId: string | null,
}

export class CardBoard extends React.Component<CardBoardProps, State> {
    state: State = { draggingId: null }
    ref = createRef<HTMLDivElement>()
    breakpoints: Array<{ uid: string, y: number }> = []
    sortedIds: string[] = []

    computeSortedCards() {
        const cards = this.props.children;
        const { sortedIds } = this;
        const sortedCards: { card: CardBoardItem, id: string }[] = [];

        // collect cards with sorting preferences
        for (let i = 0; i < sortedIds.length; i++) {
            const id = sortedIds[i];
            if (cards[id] === undefined) continue;
            sortedCards.push({ card: cards[id], id });
        }

        // put cards without sorting preferences at the end
        for (const [id, card] of Object.entries(cards)) {
            if (!sortedCards.some(c => c.card === card)) {
                sortedCards.push({ card, id });
            }
        }

        this.sortedIds = sortedCards.map(c => c.id);
        return sortedCards;
    }

    computeBreakPoints = (parentEl: HTMLDivElement) => {
        const breakpoints: Array<{ uid: string, y: number }> = [];

        for (const childEl of parentEl.children) {
            const uid = childEl.getAttribute('data-uid');
            if (uid === null) continue;

            const bounds = childEl.getBoundingClientRect();
            const y = (bounds.top + bounds.bottom)/2 + window.scrollY;

            breakpoints.push({ uid, y });
        }

        this.breakpoints = breakpoints;
    }

    dragStarted = (card: Card) => {
        this.setState({ draggingId: card.props.uid });
        window.addEventListener('drag', this.draggityDrag);
    }
    dragEnded = () => {
        this.setState({ draggingId: null });
        window.removeEventListener('drag', this.draggityDrag);
    }

    draggityDrag = debounce((e: MouseEvent) => {
        const { breakpoints } = this;
        const { draggingId } = this.state;
        const parentEl = this.ref.current;
        if (!parentEl || draggingId === null) return;

        this.computeBreakPoints(parentEl);

        let i = breakpoints.findIndex(bp => bp.y > e.pageY);
        if (i === -1) i = breakpoints.length;

        this.moveCardToIndex(draggingId, i);
    }, 200, { maxWait: 200 })

    moveCardToIndex(uid: string, index: number) {
        let { sortedIds } = this;

        const originalIndex = sortedIds.indexOf(uid);
        if (originalIndex === -1) return;

        if (index === originalIndex || index === originalIndex + 1) return;

        sortedIds.splice(originalIndex, 1); // delete original position
        if (index > originalIndex) index--; // account for deleted position
        sortedIds.splice(index, 0, uid); // insert at new position

        sortedIds = [...sortedIds];
        this.sortedIds = sortedIds;
        this.forceUpdate();
    }

    render() {
        return <div className='card-board' ref={this.ref}>
            <Header.Content title='Cache Board' />
            {this.computeSortedCards().map(({ card, id }) => {
                const layout: Layout[] = [];
                const children: React.ReactChild[] = [];

                for (const [key, plot] of Object.entries(card.plots)) {
                    layout.push({ ...plot.layout, i: key });
                    children.push( <div key={key}><Plot {...plot} /></div> );
                }

                const props = Object.assign(omit(card, 'plots'), { layout, children });

                return <Card {...props} key={id} uid={id} dragStarted={this.dragStarted} dragEnded={this.dragEnded} />;
            })}
        </div>;
    }
}
