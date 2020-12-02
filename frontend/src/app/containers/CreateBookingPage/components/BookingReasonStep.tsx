import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { useField } from 'formik';

interface BookingReasonStepProps {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  purposeField: {
    minWidth: 120,
    marginBottom: theme.spacing(2),
  },
}));

const BookingReasonStep: React.FC<BookingReasonStepProps> = props => {
  const { handleBack, handleNext } = props;
  const classes = useStyles();
  const [purposeField, , purposeHelper] = useField<String>('purpose');
  const [detailsField, , detailsHelper] = useField<String>('details');
  const [purpose, setPurpose] = useState<String>('');
  const [details, setDetails] = useState<String>('');

  useEffect(() => {
    setPurpose(purposeField.value);
    setDetails(detailsField.value);
  }, [detailsField.value, purposeField.value]);
  return (
    <div className={classes.actionsContainer}>
      <FormControl variant="outlined" required className={classes.purposeField}>
        <InputLabel id="purpose-label">Purpose</InputLabel>
        <Select
          value={purpose}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            purposeHelper.setValue(e.target.value as String);
            setPurpose(e.target.value as String);
          }}
          labelId="purpose-label"
          label="purpose"
          autoWidth
        >
          <MenuItem value="Project">Project</MenuItem>
          <MenuItem value="Meeting">Meeting</MenuItem>
          <MenuItem value="Study">Study</MenuItem>
        </Select>
      </FormControl>
      <br />
      <TextField
        required
        value={details}
        onChange={(e: React.FocusEvent<HTMLInputElement>) => {
          setDetails(e.target.value);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          detailsHelper.setValue(e.target.value);
        }}
        label="Details"
        variant="outlined"
        fullWidth
        multiline
        rowsMax={4}
      />
      <div>
        <Button onClick={handleBack} className={classes.button}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleNext}
          className={classes.button}
          disabled={!!!purpose || !!!details}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default BookingReasonStep;
