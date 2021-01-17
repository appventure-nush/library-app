import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';

import { Grid } from '@material-ui/core';

import Cell from './Cell';
import TimeSlot from './TimeSlot';
import { SlotIdx } from './types';
import { getRoundedPosIdx } from './utils';

export interface ColumnProps {
  delta: number; // 0 -> Monday, 4 -> Friday
  disabledSlotIdxes: SlotIdx[];
  bookedSlotIdxes: SlotIdx[];
  onSlotIdxSelectStart: (delta: number) => void;
  onSlotIdxSelected: (delta: number, slotIdx?: SlotIdx) => void;
  maxSlotNumber?: number;
}

export interface ColumnCallables {
  removeSelectedTimeSlots: () => void;
}

const selectedColor = 'volcano';

const Column = React.forwardRef<ColumnCallables, ColumnProps>((props, ref) => {
  const {
    delta,
    disabledSlotIdxes,
    bookedSlotIdxes,
    onSlotIdxSelectStart,
    onSlotIdxSelected,
    maxSlotNumber,
  } = props;
  const [selectedSlotIndexes, setSelectedSlotIndexes] = useState<
    Array<SlotIdx>
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    removeSelectedTimeSlots: () => {
      selectedSlotIndexes.length !== 0 && setSelectedSlotIndexes([]);
    },
  }));

  const processedSlots = useMemo(() => {
    var resultSlots = Array.from(Array(16).keys()).map(() => false);
    disabledSlotIdxes.forEach(disabledSlotIdx => {
      for (
        let disabledIndex = disabledSlotIdx.startIdx;
        disabledIndex <= disabledSlotIdx.endIdx;
        disabledIndex++
      ) {
        resultSlots[disabledIndex] = true;
      }
    });
    return resultSlots;
  }, [disabledSlotIdxes]);

  const cancelDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    onSlotIdxSelected(
      delta,
      selectedSlotIndexes[selectedSlotIndexes.length - 1],
    );
  };
  const isOverlapping = (posIdx: number): Boolean =>
    !!disabledSlotIdxes.find(
      slot => slot.startIdx <= posIdx && posIdx <= slot.endIdx,
    ) ||
    !!bookedSlotIdxes.find(
      slot => slot.startIdx <= posIdx && posIdx <= slot.endIdx,
    );
  const exceededMaximumSlots = (posIdx: number): Boolean =>
    !!(
      maxSlotNumber &&
      Math.abs(
        posIdx - selectedSlotIndexes[selectedSlotIndexes.length - 1].startIdx,
      ) >
        maxSlotNumber - 1
    );
  const onDragStarted = (start: number) => {
    let posIdx = getRoundedPosIdx(start);
    if (!isOverlapping(posIdx)) {
      onSlotIdxSelectStart(delta);
      setIsDragging(true);
      setSelectedSlotIndexes([
        { startIdx: posIdx, endIdx: posIdx, color: selectedColor },
      ]);
    }
  };
  const onDragMoved = (newPos: number) => {
    if (!isDragging) return;
    let posIdx = getRoundedPosIdx(newPos);
    if (isOverlapping(posIdx) || exceededMaximumSlots(posIdx)) {
      cancelDrag();
    } else if (
      posIdx !== selectedSlotIndexes[selectedSlotIndexes.length - 1].endIdx
    )
      setSelectedSlotIndexes([
        {
          startIdx:
            selectedSlotIndexes[selectedSlotIndexes.length - 1].startIdx,
          endIdx: posIdx,
          color: selectedColor,
        },
      ]);
  };

  return (
    <div
      style={{
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
        if (divRef.current != null) {
          let bounds = divRef.current.getBoundingClientRect();
          let y = e.clientY - bounds.top;
          onDragStarted(y);
        }
      }}
      onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
        if (divRef.current != null) {
          let bounds = divRef.current.getBoundingClientRect();
          let y = e.touches[0].clientY - bounds.top;
          onDragStarted(y);
        }
      }}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
        if (divRef.current != null) {
          let bounds = divRef.current.getBoundingClientRect();
          let y = e.clientY - bounds.top;
          onDragMoved(y);
        }
      }}
      onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (divRef.current != null) {
          let bounds = divRef.current.getBoundingClientRect();
          let y = e.touches[0].clientY - bounds.top;
          onDragMoved(y);
        }
      }}
      onMouseUp={cancelDrag}
      onMouseLeave={cancelDrag}
      onTouchCancel={cancelDrag}
      onTouchEnd={cancelDrag}
      ref={divRef}
    >
      {selectedSlotIndexes.map((slotIdx, key) => (
        <TimeSlot
          key={key}
          slotIdx={slotIdx}
          onDelete={() => {
            setSelectedSlotIndexes([]);
            onSlotIdxSelected(delta, undefined);
          }}
        />
      ))}
      {bookedSlotIdxes.map((slotIdx, key) => (
        <TimeSlot key={key} slotIdx={slotIdx} disabled />
      ))}
      <Grid
        container
        direction="column"
        spacing={0}
        alignItems="stretch"
        justify="space-around"
      >
        {processedSlots.map((disabled, key) => (
          <Grid item xs key={key}>
            <Cell disabled={disabled} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default Column;
