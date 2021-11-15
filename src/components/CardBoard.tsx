import React, { createRef } from 'react';
import { debounce } from 'lodash';
import { Card, CardProps } from './Card';
import './CardBoard.scss';

export interface CardBoardItem
extends CardProps {
    children?: React.ReactNode
}

export interface CardBoardProps {
    children: { [id: string]: CardBoardItem }
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
        const sortedCards: CardBoardItem[] = [];

        // collect cards with sorting preferences
        for (let i = 0; i < sortedIds.length; i++) {
            const id = sortedIds[i];
            if (cards[id] === undefined) continue;
            sortedCards.push(cards[id]);
        }

        // put cards without sorting preferences at the end
        for (const card of Object.values(cards)) {
            if (!sortedCards.includes(card)) sortedCards.push(card);
        }

        this.sortedIds = sortedCards.map(c => c.uid);
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
        console.log(card.props.uid);
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
        console.log(index, originalIndex);
        if (originalIndex === -1) return;

        if (index === originalIndex || index === originalIndex + 1) return;

        sortedIds.splice(originalIndex, 1); // delete original position
        if (index > originalIndex) index--; // account for deleted position
        sortedIds.splice(index, 0, uid); // insert at new position

        sortedIds = [...sortedIds];
        console.log(sortedIds);
        this.sortedIds = sortedIds;
        this.forceUpdate();
    }

    render() {
        return <div className='card-board' ref={this.ref}>
            {this.computeSortedCards().map(p =>
                <Card {...p} key={p.uid} dragStarted={this.dragStarted} dragEnded={this.dragEnded} />
            )}
        </div>;
    }
}