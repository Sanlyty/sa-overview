import React from 'react';
import { Portal } from './utils/Portal';
import './Header.scss';
import { Calendar, QuickButtons } from './DatePicker';
const Void = void 0 as void;

let mainEl: HTMLHeadingElement | null;
let stickyEl: HTMLDivElement | null;
let updateContent = () => Void;
let updateStuck = (_: boolean) => Void;


interface State {
    stuck: boolean
}

export class Root extends React.Component<unknown, State> {
    state = { stuck: false };

    observer = new IntersectionObserver(
        ([e]) => {
            const stuck = e.intersectionRatio < 1;
            this.setState({ stuck });
            updateStuck(stuck);
        },
        {threshold: [1]}
    );

    mainRefChanged = (el: HTMLHeadingElement | null) => {
        mainEl = el;
        updateContent();
    }

    stickyRefChanged = (el: HTMLDivElement) => {
        stickyEl = el;
        this.observer.disconnect();
        if (stickyEl) this.observer.observe(stickyEl);
    }

    componentDidMount() {
        this.mainRefChanged(mainEl);
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    render () {
        const { stuck } = this.state;
        const stuckClass = stuck ? ' stuck' : '';

        return <>
            <header ref={this.mainRefChanged} className='overview-header header-main'></header>
            <nav ref={this.stickyRefChanged} className={'overview-header header-sticky' + stuckClass}></nav>
        </>;
    }
}


interface Props {
    title: React.ReactChild
}

export class Content extends React.Component<Props, State> {
    state = { stuck: false };

    componentDidMount() {
        updateContent = () => this.forceUpdate();
        updateStuck = stuck => this.setState({ stuck });
        this.forceUpdate();
    }

    componentWillUnmount() {
        updateContent = () => Void;
        updateStuck = () => Void;
    }

    render () {
        const { title } = this.props;

        return <>
            <Portal root={mainEl}>
                <div className='left'>
                    <h1 className='title'>{title}</h1>
                </div>
                <div className='right'>
                    <Calendar />
                </div>
            </Portal>
            <Portal root={stickyEl}>
                <QuickButtons selected='day' onChange={() => Void} />
                <span>1. 1. 1900 – 2. 2. 1900</span>
            </Portal>
        </>;
    }
}
