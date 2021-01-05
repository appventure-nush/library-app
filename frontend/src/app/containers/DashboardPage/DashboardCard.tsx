import { getTimeString } from 'app/components/TimeSlotPicker';
import { DateTime } from 'luxon';
import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface DashboardCardProps {
  purpose: string;
  startTime: string;
  endTime: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
    marginBottom: theme.spacing(2),
  },
}));

const DashboardCard: React.FC<DashboardCardProps> = props => {
  const { purpose } = props;
  const startTime = DateTime.fromISO(props.startTime);
  const endTime = DateTime.fromISO(props.endTime);
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {`${startTime.day} ${startTime.monthShort} (${
            startTime.weekdayShort
          }), ${getTimeString(startTime)} - ${getTimeString(endTime)}`}
        </Typography>
        <Typography color="textSecondary">{purpose}</Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
