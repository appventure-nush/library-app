import { getTimeString } from 'app/components/TimeSlotPicker';
import { useFormikContext } from 'formik';
import { DateTime } from 'luxon';
import React from 'react';

import {
  makeStyles,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from '@material-ui/core';

import { BookingFormValues } from '../';
import BookingReasonStep from './BookingReasonStep';
import SelectTimeSlotStep from './SelectTimeSlotStep';

interface CreateBookingStepperProps {}

const STEP_COUNT = 2;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  stepper: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const getSelectedTimeString = (timeSlot: { start: DateTime; end: DateTime }) =>
  `${timeSlot.start.weekdayLong}, ${getTimeString(
    timeSlot.start,
  )} - ${getTimeString(timeSlot.end)}`;

const CreateBookingStepper: React.FC<CreateBookingStepperProps> = props => {
  const [activeStep, setActiveStep] = React.useState(0);
  const classes = useStyles();
  const { values } = useFormikContext<BookingFormValues>();

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (activeStep !== STEP_COUNT - 1) {
      e.preventDefault();
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Stepper
        className={classes.stepper}
        activeStep={activeStep}
        orientation="vertical"
      >
        <Step>
          <StepLabel>
            {values.selection
              ? `You have selected ${getSelectedTimeString(values.selection)}`
              : 'Please select a time slot'}
          </StepLabel>
          <StepContent>
            <SelectTimeSlotStep handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Booking Reason</StepLabel>
          <StepContent>
            <BookingReasonStep
              handleBack={handleBack}
              handleNext={handleNext}
            />
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
};

export default CreateBookingStepper;
