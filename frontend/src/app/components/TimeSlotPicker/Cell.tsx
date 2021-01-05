import clsx from 'clsx';
import React from 'react';

import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { HALF_AN_HOUR_IN_PIXELS } from './utils';

interface CellProps {
  disabled?: Boolean;
}

const useStyles = makeStyles(theme => ({
  root: {
    height: `${HALF_AN_HOUR_IN_PIXELS}px`,
  },
  disabled: {
    backgroundColor: theme.palette.grey[300],
  },
}));

const Cell: React.FC<CellProps> = props => {
  const classes = useStyles();

  return (
    <Box
      border={1}
      borderColor={'grey.200'}
      className={clsx(classes.root, {
        [classes.disabled]: props.disabled,
      })}
    />
  );
};

export default Cell;
