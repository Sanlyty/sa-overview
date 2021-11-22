import React from 'react';
import DayPicker from 'react-day-picker';
import { ButtonGroup, Button } from 'react-bootstrap';

import 'react-day-picker/lib/style.css';

type DateQuickChoice = 'day' | 'week' | 'month' | [number, number]

export interface QuickButtonsProps {
    selected: DateQuickChoice;
    onChange: (selected: DateQuickChoice) => void;
}

export class QuickButtons extends React.Component<QuickButtonsProps> {
    render() {
        return <ButtonGroup size='sm'>
            <Button variant='secondary' active>Day</Button>
            <Button variant='secondary'>Week</Button>
            <Button variant='secondary'>Month</Button>
            <Button variant='secondary'>Custom</Button>
        </ButtonGroup>;
    }
}

export class Calendar extends React.Component {
    render() {
        return <div className='calendar'>
            <DayPicker numberOfMonths={2} fixedWeeks />
        </div>;
    }
}
