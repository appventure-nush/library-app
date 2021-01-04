import { Button, Paper, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRooms } from '../selectors';
import { actions } from '../slice';
import TimeSlotTab from './TimeSlotTab';

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
  const [tabValue, setTabValue] = React.useState(0);

  const rooms = useSelector(selectRooms);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadBookableRooms());
  }, [dispatch]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
    dispatch(actions.updateCurrentRoom(newValue));
  };

  return (
    <div className={classes.actionsContainer}>
      <Paper square>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="disabled tabs example"
        >
          {rooms.map(room => (
            <Tab key={room.id} label={room.name} />
          ))}
        </Tabs>
      </Paper>
      <div
        role="tabpanel"
        id={`wrapped-tabpanel`}
        aria-labelledby={`wrapped-tab`}
      >
        <TimeSlotTab />
      </div>
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
