import React from 'react';
import GridLayout from 'react-grid-layout';
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
        const layout = [
            { i: 'a', x: 0, y: 0, h: 1, w: 1 },
            { i: 'b', x: 0, y: 1, h: 1, w: 1 }
        ];
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
                        <GridLayout layout={layout} rowHeight={20} cols={6} width={700}>{
                            [
                                <div key='a'>Ahoj</div>,
                                <div key='b'>Čaudy</div>
                            ]
                        }</GridLayout>
                        <CacheBoard />
                    </div>
                </div>
                <ScrollToTopButton />
            </ThemeContext.Provider>
        );
    }
}

export default OverviewView;
