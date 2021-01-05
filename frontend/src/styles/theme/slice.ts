import { RootState } from 'types';

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { themes } from './themes';
import { ThemeKeyType, ThemeState } from './types';
import { getThemeFromStorage, isSystemDark } from './utils';

export const initialState: ThemeState = {
  selected: getThemeFromStorage() || 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<ThemeKeyType>) {
      state.selected = action.payload;
    },
  },
});

export const selectTheme = createSelector(
  [(state: RootState) => state.theme || initialState],
  theme => {
    if (theme.selected === 'system') {
      return isSystemDark ? themes.dark : themes.light;
    }
    return themes[theme.selected];
  },
);

export const selectThemeKey = createSelector(
  [(state: RootState) => state.theme || initialState],
  theme => theme.selected,
);

export const { changeTheme } = themeSlice.actions;
export const reducer = themeSlice.reducer;
export const themeSliceKey = themeSlice.name;
