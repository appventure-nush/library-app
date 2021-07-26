import React from 'react';
import { Slot } from 'types/Week';
import { toPosition, toHeight } from './utils';

export interface SelectionSlotProps {
  selection: Slot;
  intervalInPixels: number;
  slotColor?: string;
  selectable?: boolean;
}

const SelectionSlot: React.FC<SelectionSlotProps> = props => {
  const {
    selection,
    intervalInPixels,
    slotColor = 'bg-teal-300',
    selectable = true,
  } = props;

  return (
    <div
      className={`${
        selectable ? 'pointer-events-none' : ''
      } absolute ${slotColor} rounded-sm md:rounded-md z-20`}
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
