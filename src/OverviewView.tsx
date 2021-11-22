import React from 'react';
import { CacheBoard } from './components/boards/CacheBoard';
import { ThemeContext } from './ThemeContext';
import './OverviewView.scss';
import ScrollToTopButton from './components/ScrollToTopButton';
import 'bootstrap/scss/bootstrap.scss';
import * as Header from './components/Header';


interface Props {
    darkMode?: boolean,
}

class OverviewView extends React.Component<Props> {
    root = document.getElementById('root')!;

    render () {
        const { darkMode } = this.props;
        return (
            <ThemeContext.Provider value={{ darkMode }}>
                {/* <Helmet>
                    <link rel='stylesheet' href={`${process.env.PUBLIC_URL}/${darkMode ? 'bootstrap-dark.min.css' : 'bootstrap-light.min.css'}`} />
                </Helmet> */}
                <Header.Root />
                <div className='overview-view'>
                    <div className='overview-inner'>
                        <CacheBoard />
                    </div>
                </div>
                <ScrollToTopButton root={this.root} />
            </ThemeContext.Provider>
        );
    }
}

export default OverviewView;
