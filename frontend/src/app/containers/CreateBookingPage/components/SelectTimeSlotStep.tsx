import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TimeSlotPicker } from 'app/components/TimeSlotPicker';
import { useField } from 'formik';
import React from 'react';

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

  return (
    <div className={classes.actionsContainer}>
      <TimeSlotPicker currentWeekTitle="Week 1" />
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
