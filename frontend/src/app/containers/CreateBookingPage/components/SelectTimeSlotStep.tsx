import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TimeSlotPicker } from 'app/components/TimeSlotPicker';
import { Slot } from 'app/components/TimeSlotPicker/types';
import { useField } from 'formik';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCreateBookingPage } from '../selectors';
import { actions } from '../slice';

interface SelectTimeSlotStepProps {
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const SelectTimeSlotStep: React.FC<SelectTimeSlotStepProps> = props => {
  const { handleNext } = props;
  const classes = useStyles();
  const timeSlot = useField('timeSlot');

  const { bookedSlots, disabledSlots } = useSelector(selectCreateBookingPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadCurrentWeekSlots());
  }, [dispatch]);

  return (
    <div className={classes.actionsContainer}>
      <TimeSlotPicker
        fieldName="timeSlot"
        currentWeek={{ title: 'Week 1', weekYear: 2020, weekNumber: 53 }}
        disabledSlots={disabledSlots.map(slot => {
          const pickerSlot: Slot = {
            startTime: DateTime.fromISO(slot.startTime),
            endTime: DateTime.fromISO(slot.endTime),
            color: 'volcano',
          };
          return pickerSlot;
        })}
        bookedSlots={bookedSlots.map(slot => {
          const pickerSlot: Slot = {
            startTime: DateTime.fromISO(slot.startTime),
            endTime: DateTime.fromISO(slot.endTime),
            color: 'volcano',
          };
          return pickerSlot;
        })}
        hasNextWeek={false}
        hasPreviousWeek={false}
        onChangeNextWeek={() => {}}
        onChangePrevWeek={() => {}}
      />
      <div>
        <Button disabled className={classes.button}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleNext}
          className={classes.button}
          disabled={!!!timeSlot[0].value}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SelectTimeSlotStep;
