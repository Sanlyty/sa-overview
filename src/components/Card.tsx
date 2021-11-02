import React from 'react';
import { Card as C, Collapse, AccordionButton } from 'react-bootstrap';
import './Card.scss';

interface Props {
    title: string,
    color: string,
}

interface State {
    collapsed: boolean
}

export class Card extends React.Component<Props, State> {
    state = { collapsed: false }

    toggleCollapsed = () => this.setState({ collapsed: !this.state.collapsed })

    render() {
        const { title, color, children } = this.props;
        const { collapsed } = this.state;

        return <C className='overview-card'>
            <AccordionButton
                style={{ background: color }}
                as={C.Header}
                onClick={this.toggleCollapsed}
            >
                {title}
            </AccordionButton>
            <Collapse in={!collapsed}>
                <C.Body>
                    {children}
                </C.Body>
            </Collapse>
        </C>;
    }
}
