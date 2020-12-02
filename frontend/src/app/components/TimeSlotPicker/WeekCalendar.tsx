import { Grid, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import React, { useState, useEffect, createRef } from 'react';
import Column, { ColumnCallables } from './Column';
import {
  TimeSlotIdx,
  getStartingDay,
  getDayString,
  getTimeFromTimeSlotIdx,
} from './utils';

export interface DayCalendarProps {}

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(0, 2),
  },
  root: {
    padding: theme.spacing(0, 2, 2),
  },
  leadingColumn: {
    height: '100%',
    marginRight: theme.spacing(1),
    width: '25px',
  },
  dayColumn: {
    height: '100%',
  },
}));

const WeekCalendar: React.FC<DayCalendarProps> = props => {
  const [columnRefs, setColumnRefs] = useState<
    Array<React.RefObject<ColumnCallables>>
  >([]);
  const classes = useStyles();
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setColumnRefs(columnRefs =>
      Array.from(Array(5).keys()).map(i => columnRefs[i] || createRef()),
    );
  }, []);

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item className={classes.leadingColumn}>
          <Typography variant="body2">&nbsp;</Typography>
        </Grid>
        {[0, 1, 2, 3, 4].map(delta => (
          <Grid item xs container justify="center" key={delta}>
            <Typography variant="body2">
              {getDayString(getStartingDay(delta))}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container className={classes.root}>
        <Grid item>
          <Grid
            container
            className={classes.leadingColumn}
            direction="column"
            spacing={0}
            justify="space-around"
            alignItems="flex-start"
          >
            {Array.from(Array(10).keys()).map(key => (
              <Grid item xs key={key}>
                <Box border={1} borderColor="#00000000">
                  <Typography variant="body2">
                    {(8 + key).toString().padStart(2, '0')}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid className={classes.dayColumn} container justify="space-around">
            {Array.from(Array(5).keys()).map(delta => (
              <Grid item xs key={delta}>
                <Column
                  ref={columnRefs[delta]}
                  day={delta}
                  disabledSlots={[]}
                  onTimeSlotSelectStart={(day: number) => {
                    columnRefs.forEach((columnRef, i) => {
                      day !== i &&
                        columnRef.current &&
                        columnRef.current.removeSelectedTimeSlots();
                    });
                  }}
                  onTimeSlotSelected={(day: number, timeSlot?: TimeSlotIdx) => {
                    if (timeSlot) {
                      setFieldValue(
                        'timeSlot',
                        getTimeFromTimeSlotIdx(timeSlot, day),
                      );
                    } else {
                      setFieldValue('timeSlot', undefined);
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default WeekCalendar;
