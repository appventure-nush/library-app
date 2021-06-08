import React from 'react';
import { Slot } from './types';
import { toPosition, toHeight } from './utils';

export interface SelectionSlotProps {
  selection: Slot;
  intervalInPixels: number;
}

const SelectionSlot: React.FC<SelectionSlotProps> = props => {
  const { selection, intervalInPixels } = props;

  return (
    <div
      className="absolute bg-teal-300 rounded-sm md:rounded-md z-20"
      style={{
        top: toPosition(selection.start, intervalInPixels) + 4,
        height: toHeight(selection, intervalInPixels) - 8,
        left: 4,
        width: 'calc(100% - 8px)',
      }}
    />
  );
};

export default React.memo(SelectionSlot, (prevProps, nextProps) => {
  if (prevProps.intervalInPixels !== nextProps.intervalInPixels) return false;
  if (!prevProps.selection.start.equals(nextProps.selection.start))
    return false;
  if (!prevProps.selection.end.equals(nextProps.selection.end)) return false;
  return true;
});
