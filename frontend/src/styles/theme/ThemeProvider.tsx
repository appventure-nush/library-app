import React from 'react';
import { useSelector } from 'react-redux';
import { useInjectReducer } from 'redux-injectors';
import { ThemeProvider as OriginalThemeProvider } from 'styled-components';

import { reducer, selectTheme, themeSliceKey } from './slice';

export const ThemeProvider = (props: { children: React.ReactChild }) => {
  useInjectReducer({ key: themeSliceKey, reducer: reducer });

  const theme = useSelector(selectTheme);
  return (
    <OriginalThemeProvider theme={theme}>
      {React.Children.only(props.children)}
    </OriginalThemeProvider>
  );
};
