import React from 'react';
import Helmet from 'react-helmet';
import CacheBoard from './components/CacheBoard';
import './OverviewView.scss';


interface Props {
    darkMode?: boolean,
}

class OverviewView extends React.Component<Props> {
    render () {
        return (
            <>
                <Helmet>
                    <link rel='stylesheet' href={`${process.env.PUBLIC_URL}/${this.props.darkMode ? 'bootstrap-dark.min.css' : 'bootstrap-light.min.css'}`} />
                </Helmet>
                <div className='overview-view'>
                    <div className='overview-inner'>
                        <h1>Overview</h1>
                        Something something
                        <br/><br/>
                        <CacheBoard />
                    </div>
                </div>
            </>
        );
    }
}

export default OverviewView;
