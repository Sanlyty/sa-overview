import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './ScrollToTopButton.scss';
import { Theme, ThemeContext } from '../ThemeContext';

interface Props {
    root: Element
}

interface State {
    visible: boolean
}

class ScrollToTopButton extends React.Component<Props, State, Theme> {
    static contextType = ThemeContext;
    state = { visible: false }

    componentDidMount() {
        this.props.root.addEventListener('scroll', this.scrollListener);
    }

    componentWillUnmount() {
        this.props.root.removeEventListener('scroll', this.scrollListener);
    }

    scrollToTop = () => {
        this.props.root.scrollTop = 0;
    }

    scrollListener = () => {
        const visible = this.props.root.scrollTop > 20;
        if (this.state.visible !== visible) this.setState({ visible });
    }

    render () {
        const { visible } = this.state;
        return (
            <Button
                id='overview-scroll-to-top'
                size='lg'
                variant={this.context.darkMode ? 'dark' : 'light'}
                onClick={this.scrollToTop}
                style={visible ? {} : { display: 'none' }}
            >
                <FontAwesomeIcon icon={faAngleUp} />
            </Button>
        );
    }
}

export default ScrollToTopButton;
