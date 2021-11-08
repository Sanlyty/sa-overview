import React, { createRef } from 'react';
import { Card as C, Collapse, AccordionButton } from 'react-bootstrap';
import './Card.scss';

export interface CardProps {
    uid: string,
    title: string,
    color: string,
    dragStarted?(self: Card): void,
    dragEnded?(self: Card): void,
}

interface State {
    collapsed: boolean,
    inDragMode: boolean,
}

export class Card extends React.Component<CardProps, State> {
    state = { collapsed: false, inDragMode: false }
    headerRef = createRef<HTMLDivElement>()

    toggleCollapsed = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.matches('.accordion-button')) return;

        this.setState({ collapsed: !this.state.collapsed });
    }

    dragStart = (e: React.DragEvent<HTMLElement>) => {
        e.dataTransfer.setData('a', 'a');

        const previewEl = this.headerRef.current;
        if (previewEl) e.dataTransfer.setDragImage(previewEl, 0, 0);

        this.setState({ inDragMode: true });
        this.props.dragStarted?.(this);
    }

    dragEnd = () => {
        this.setState({ inDragMode: false });
        this.props.dragEnded?.(this);
    };

    render() {
        const { uid, title, color, children } = this.props;
        const { collapsed, inDragMode } = this.state;

        const classNames: string[] = ['overview-card'];
        if (inDragMode) classNames.push('drag-mode');

        return <C className={classNames.join(' ')} data-uid={uid}>
            <AccordionButton
                as={C.Header}
                ref={this.headerRef}
                onClick={this.toggleCollapsed}
                style={{ background: color }}
                className={/* dirty hack */ collapsed ? '' : 'collapsednt'}
            >
                <span
                    draggable
                    className='grabbity-header'
                    onDragStart={this.dragStart}
                    onDragEnd={this.dragEnd}
                >
                    {title}
                </span>
            </AccordionButton>
            <Collapse in={!(collapsed || inDragMode)}>
                <C.Body>
                    {children}
                </C.Body>
            </Collapse>
        </C>;
    }
}
