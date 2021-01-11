import { getTimeString } from 'app/components/TimeSlotPicker';
import { DateTime } from 'luxon';
import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from '@material-ui/core';
import { BookingListViewData, BookingStatus } from 'types/Booking';
import api from 'app/api';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

interface DashboardCardProps {
  booking: BookingListViewData;
}

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
    marginBottom: theme.spacing(2),
  },
}));

const DashboardCard: React.FC<DashboardCardProps> = props => {
  const { id, purpose, room, status } = props.booking;
  const now = DateTime.local();
  const startTime = DateTime.fromISO(props.booking.startTime);
  const endTime = DateTime.fromISO(props.booking.endTime);
  const classes = useStyles();
  const history = useHistory();
  const [openCheckInDialog, setOpenCheckInDialog] = React.useState(false);
  const [openCheckOutDialog, setOpenCheckOutDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');
  const [pin, setPin] = React.useState('');

  const handleCheckIn = () => {
    setIsSubmitting(true);
    api.booking
      .checkInBooking(id, pin)
      .then(() => {
        setOpenCheckInDialog(false);
        history.go(0);
      })
      .catch(() => {
        setIsSubmitting(false);
        setHelperText('Wrong PIN');
      });
  };

  const handleCheckOut = () => {
    setIsSubmitting(true);
    api.booking
      .checkOutBooking(id)
      .then(() => {
        setOpenCheckOutDialog(false);
        history.go(0);
      })
      .catch(() => {
        setIsSubmitting(false);
        toast.error('Checkout failed');
      });
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {`${startTime.day} ${startTime.monthShort} (${
            startTime.weekdayShort
          }), ${getTimeString(startTime)} - ${getTimeString(endTime)}`}
        </Typography>
        <Typography color="textSecondary">
          {purpose} in {room.name}
        </Typography>
        {status === BookingStatus.CONFIRMED &&
          now.diff(startTime, 'minutes').minutes >= 0 &&
          now.diff(endTime, 'minutes').minutes < 0 && (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenCheckInDialog(true)}
              >
                Check In
              </Button>
              <Dialog
                open={openCheckInDialog}
                onClose={() => setOpenCheckInDialog(false)}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Check In</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please key in the current room PIN to check in
                  </DialogContentText>
                  <TextField
                    error={!!helperText}
                    helperText={helperText}
                    autoFocus
                    margin="dense"
                    type="tel"
                    inputProps={{ maxLength: 6 }}
                    onChange={e => setPin(e.target.value)}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenCheckInDialog(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCheckIn}
                    disabled={isSubmitting || pin.length < 6}
                    color="primary"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        {status === BookingStatus.CHECKEDIN &&
          now.diff(startTime, 'minutes').minutes >= 0 &&
          now.diff(endTime, 'minutes').minutes < 0 && (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenCheckOutDialog(true)}
              >
                Check Out
              </Button>
              <Dialog
                open={openCheckOutDialog}
                onClose={() => setOpenCheckOutDialog(false)}
              >
                <DialogTitle id="alert-dialog-title">Check Out</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Confirm checking out room? Your remaining time will become
                    bookable by others
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenCheckOutDialog(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCheckOut}
                    color="primary"
                    disabled={isSubmitting}
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
