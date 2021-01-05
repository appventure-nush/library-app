import { useField } from 'formik';
import { DateTime } from 'luxon';
import React, { createRef, useEffect, useMemo, useState } from 'react';

import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Column, { ColumnCallables } from './Column';
import { Slot, SlotIdx } from './types';
import { getDayString, mapToSlot, mapToSlotIdx } from './utils';

export interface WeekCalendarProps {
  fieldName: string;
  referenceDate: DateTime;
  disabledSlots: Slot[];
  bookedSlots: Slot[];
  maxSlotNumber?: number;
}

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

const WeekCalendar: React.FC<WeekCalendarProps> = props => {
  const {
    fieldName,
    referenceDate,
    disabledSlots,
    bookedSlots,
    maxSlotNumber,
  } = props;
  const [columnRefs, setColumnRefs] = useState<
    Array<React.RefObject<ColumnCallables>>
  >([]);
  const classes = useStyles();
  const [field, , helpers] = useField(fieldName);

  useEffect(() => {
    setColumnRefs(columnRefs =>
      Array.from(Array(5).keys()).map(i => columnRefs[i] || createRef()),
    );
  }, []);

  useEffect(() => {
    if (field.value === undefined) {
      columnRefs.forEach((columnRef, i) => {
        columnRef.current && columnRef.current.removeSelectedTimeSlots();
      });
    }
  }, [columnRefs, field.value]);

  const processedDisabledSlots = useMemo(() => {
    var disabledSlotIndexes: SlotIdx[][] = Array.from(
      Array(5).keys(),
    ).map(() => []);
    disabledSlots.forEach(disabledSlot => {
      disabledSlotIndexes[disabledSlot.startTime.weekday - 1].push(
        mapToSlotIdx(disabledSlot),
      );
    });
    return disabledSlotIndexes;
  }, [disabledSlots]);

  const processedBookedSlots = useMemo(() => {
    var bookedSlotIndexes: SlotIdx[][] = Array.from(
      Array(5).keys(),
    ).map(() => []);
    bookedSlots.forEach(bookedSlot => {
      bookedSlotIndexes[bookedSlot.startTime.weekday - 1].push(
        mapToSlotIdx(bookedSlot),
      );
    });
    return bookedSlotIndexes;
  }, [bookedSlots]);

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item className={classes.leadingColumn}>
          <Typography variant="body2">&nbsp;</Typography>
        </Grid>
        {[0, 1, 2, 3, 4].map(delta => (
          <Grid item xs container justify="center" key={delta}>
            <Typography variant="body2">
              {getDayString(referenceDate.plus({ days: delta }))}
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
                  delta={delta}
                  maxSlotNumber={maxSlotNumber}
                  disabledSlotIdxes={processedDisabledSlots[delta]}
                  bookedSlotIdxes={processedBookedSlots[delta]}
                  onSlotIdxSelectStart={(delta: number) => {
                    columnRefs.forEach((columnRef, i) => {
                      delta !== i &&
                        columnRef.current &&
                        columnRef.current.removeSelectedTimeSlots();
                    });
                  }}
                  onSlotIdxSelected={(delta: number, slotIdx?: SlotIdx) => {
                    if (slotIdx) {
                      const slot = mapToSlot(
                        slotIdx,
                        referenceDate.plus({ days: delta }),
                      );
                      helpers.setValue({
                        start: slot.startTime,
                        end: slot.endTime,
                      });
                    } else {
                      helpers.setValue(undefined);
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
