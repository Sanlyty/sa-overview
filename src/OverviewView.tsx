import React from 'react';
import { CacheBoard } from './components/CacheBoard';
import { ThemeContext } from './ThemeContext';
import './OverviewView.scss';
import ScrollToTopButton from './components/ScrollToTopButton';
import 'bootstrap/scss/bootstrap.scss';


interface Props {
    darkMode?: boolean,
}

class OverviewView extends React.Component<Props> {
    render () {
        const { darkMode } = this.props;
        return (
            <ThemeContext.Provider value={{ darkMode }}>
                {/* <Helmet>
                    <link rel='stylesheet' href={`${process.env.PUBLIC_URL}/${darkMode ? 'bootstrap-dark.min.css' : 'bootstrap-light.min.css'}`} />
                </Helmet> */}
                <div className='overview-view'>
                    <div className='overview-inner'>
                        <div style={{ margin: '2rem' }}>
                            <h1>Overview</h1>
                            Something something
                        </div>
                        <CacheBoard />
                    </div>
                </div>
                <ScrollToTopButton />
            </ThemeContext.Provider>
        );
    }
}

export default OverviewView;
