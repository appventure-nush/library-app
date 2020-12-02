import React from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigatePrevIcon from '@material-ui/icons/NavigateBefore';
import CalendarIcon from '@material-ui/icons/Today';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { getDDMMM } from './utils';
import { DateTime } from 'luxon';

export interface WeekPickerProps {
  currentWeekTitle: String;
  startDate: DateTime;
  onChangeNextWeek: () => void;
  onChangePrevWeek: () => void;
  hasNext?: Boolean;
  hasPrev?: Boolean;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 2, 1),
  },
}));

const WeekPicker: React.FC<WeekPickerProps> = props => {
  const {
    currentWeekTitle,
    startDate,
    onChangeNextWeek,
    onChangePrevWeek,
    hasNext,
    hasPrev,
  } = props;
  const endDate = startDate.endOf('weeks').minus({ days: 2 });
  const classes = useStyles();
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  return (
    <Grid
      container
      className={classes.root}
      justify="space-between"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="body1">{currentWeekTitle}</Typography>
      </Grid>
      <Grid item>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <IconButton
              aria-label="previous week"
              disabled={!!hasPrev}
              onClick={onChangePrevWeek}
            >
              <NavigatePrevIcon />
            </IconButton>
            <IconButton
              size={isSmallScreen ? 'small' : 'medium'}
              aria-label="next week"
              disabled={!!hasNext}
              onClick={onChangeNextWeek}
            >
              <NavigateNextIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="body1" display="inline">
              {getDDMMM(startDate)} - {getDDMMM(endDate)} <CalendarIcon />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WeekPicker;
