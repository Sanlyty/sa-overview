import React from 'react';
import Helmet from 'react-helmet';
import CacheBoard from './components/CacheBoard';
import { ThemeContext } from './ThemeContext';
import './OverviewView.scss';
import ScrollToTopButton from './components/ScrollToTopButton';


interface Props {
    darkMode?: boolean,
}

class OverviewView extends React.Component<Props> {
    render () {
        const { darkMode } = this.props;
        return (
            <ThemeContext.Provider value={{ darkMode }}>
                <Helmet>
                    <link rel='stylesheet' href={`${process.env.PUBLIC_URL}/${darkMode ? 'bootstrap-dark.min.css' : 'bootstrap-light.min.css'}`} />
                </Helmet>
                <div className='overview-view'>
                    <div className='overview-inner'>
                        <br/>
                        <h1>Overview</h1>
                        Something something
                        <CacheBoard />
                    </div>
                </div>
                <ScrollToTopButton />
            </ThemeContext.Provider>
        );
    }
}

export default OverviewView;
