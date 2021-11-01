import React from 'react';

export interface Theme {
    darkMode?: boolean;
}

export const ThemeContext = React.createContext<Theme>({ darkMode: false });
