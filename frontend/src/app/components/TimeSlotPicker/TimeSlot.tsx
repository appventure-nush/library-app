import React from 'react';

import {
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseOutlined';

import { SlotIdx } from './types';
import { getDurationFromIdx, HALF_AN_HOUR_IN_PIXELS } from './utils';

export interface TimeSlotProps {
  slotIdx: SlotIdx;
  onDelete?: () => void;
  disabled?: Boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = props => {
  const { disabled, onDelete, slotIdx } = props;
  const start =
    (slotIdx.startIdx < slotIdx.endIdx ? slotIdx.startIdx : slotIdx.endIdx) *
    HALF_AN_HOUR_IN_PIXELS;
  const end =
    (slotIdx.startIdx < slotIdx.endIdx ? slotIdx.endIdx : slotIdx.startIdx) *
      HALF_AN_HOUR_IN_PIXELS +
    HALF_AN_HOUR_IN_PIXELS;
  const theme = useTheme();

  return (
    <Paper
      onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{
        position: 'absolute',
        backgroundColor: disabled
          ? theme.palette.error.main
          : theme.palette.primary.light,
        width: 'calc(100% - 10px)',
        height: `${end - start - 10}px`,
        top: `${start + 5}px`,
        left: `5px`,
      }}
    >
      <Grid container justify="space-between" alignItems="center">
        <Typography
          style={{ color: '#FFFFFF', padding: theme.spacing(1, 0, 0, 1) }}
        >
          {getDurationFromIdx(slotIdx)}
        </Typography>
        {!disabled && (
          <IconButton
            onClick={onDelete && onDelete}
            size="small"
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Grid>
    </Paper>
  );
};

export default TimeSlot;
