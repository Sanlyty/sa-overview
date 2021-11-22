import React, { createRef } from 'react';
import { Card as C, Collapse, AccordionButton } from 'react-bootstrap';
import _GridLayout, { WidthProvider, Layout } from 'react-grid-layout';
import './Card.scss';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const GridLayout = WidthProvider(_GridLayout);
const noop = () => void 0;

export interface CardProps {
    uid: string;
    title: string;
    subtitle?: string;
    color: string;
    layout: Layout[];
    dragStarted?(self: Card): void;
    dragEnded?(self: Card): void;
}

interface State {
    collapsed: boolean;
    inDragMode: boolean;
}

export class Card extends React.Component<CardProps, State> {
    state = { collapsed: false, inDragMode: false }
    headerRef = createRef<HTMLDivElement>()

    toggleCollapsed = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.matches('.accordion-button, .collapse-button-mask')) return;

        this.setState({ collapsed: !this.state.collapsed });
    }

    dragStart = (e: React.DragEvent<HTMLElement>) => {
        e.dataTransfer.setData('UwU', 'xoxo');

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
        const { uid, title, subtitle, color, layout, children } = this.props;
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
                <span className='collapse-button-mask' />
            </AccordionButton>
            <Collapse in={!(collapsed || inDragMode)}>
                <C.Body>
                    {subtitle}
                    <GridLayout
                        rowHeight={300} cols={2} layout={layout}
                        isResizable
                        isDraggable
                        useCSSTransforms
                        preventCollision

                        margin={[ 10, 10 ]}
                        compactType='vertical'

                        draggableHandle='.graph-header'
                        onLayoutChange={noop}
                    >
                        {children}
                    </GridLayout>
                </C.Body>
            </Collapse>
        </C>;
    }
}
