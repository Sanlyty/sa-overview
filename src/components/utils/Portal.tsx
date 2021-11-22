import React from 'react';
import ReactDOM from 'react-dom';

export interface Props {
    root: React.RefObject<Element> | Element | null
}

export class Portal extends React.Component<Props> {
    render() {
        let el = this.props.root;
        if (!el) return null;
        if ('current' in el) el = el.current;
        if (!el) return null;

        return ReactDOM.createPortal(this.props.children, el);
    }
}
