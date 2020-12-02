import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { HALF_AN_HOUR_IN_PIXELS } from './utils';

interface CellProps {}

const useStyles = makeStyles(theme => ({
  root: {
    height: `${HALF_AN_HOUR_IN_PIXELS}px`,
  },
}));

const Cell: React.FC<CellProps> = props => {
  const classes = useStyles();

  return <Box border={1} borderColor={'grey.200'} className={classes.root} />;
};

export default Cell;
