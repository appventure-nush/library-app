import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Cell from './Cell';
import TimeSlot from './TimeSlot';
import { getRoundedPosIdx, getTimeSlotIdxFromTime, TimeSlotIdx } from './utils';
import { useField } from 'formik';
import { DateTime } from 'luxon';

export interface ColumnProps {
  day: number; // 0 -> Monday, 4 -> Friday
  disabledSlots: Array<TimeSlotIdx>;
  onTimeSlotSelectStart: (day: number) => void;
  onTimeSlotSelected: (day: number, timeSlot?: TimeSlotIdx) => void;
}

export interface ColumnCallables {
  removeSelectedTimeSlots: () => void;
}

const Column = React.forwardRef<ColumnCallables, ColumnProps>((props, ref) => {
  const {
    day,
    disabledSlots,
    onTimeSlotSelectStart,
    onTimeSlotSelected,
  } = props;
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<
    Array<TimeSlotIdx>
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [field, ,] = useField<{ start: DateTime; end: DateTime } | undefined>(
    'timeSlot',
  );

  useImperativeHandle(ref, () => ({
    removeSelectedTimeSlots: () => {
      selectedTimeSlots.length !== 0 && setSelectedTimeSlots([]);
    },
  }));

  useEffect(() => {
    field.value &&
      field.value.start.weekday === day + 1 &&
      setSelectedTimeSlots([getTimeSlotIdxFromTime(field.value)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    onTimeSlotSelected(day, selectedTimeSlots[0]);
  };
  const isOverlapping = (posIdx: number): Boolean =>
    !!disabledSlots.find(
      slot => slot.startIdx <= posIdx && posIdx <= slot.endIdx,
    );
  const onDragStarted = (start: number) => {
    if (!isOverlapping(start)) {
      onTimeSlotSelectStart(day);
      setIsDragging(true);
      let posIdx = getRoundedPosIdx(start);
      setSelectedTimeSlots([{ startIdx: posIdx, endIdx: posIdx }]);
    }
  };
  const onDragMoved = (newPos: number) => {
    if (!isDragging) return;
    let posIdx = getRoundedPosIdx(newPos);
    if (isOverlapping(posIdx)) {
      cancelDrag();
    } else if (posIdx !== selectedTimeSlots[0].endIdx)
      setSelectedTimeSlots([
        { startIdx: selectedTimeSlots[0].startIdx, endIdx: posIdx },
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
      {selectedTimeSlots.map((timeSlot, key) => (
        <TimeSlot
          key={key}
          timeSlot={timeSlot}
          onDelete={() => {
            setSelectedTimeSlots([]);
            onTimeSlotSelected(day, undefined);
          }}
        />
      ))}
      {disabledSlots.map((timeSlot, key) => (
        <TimeSlot key={key} timeSlot={timeSlot} disabled />
      ))}
      <Grid
        container
        direction="column"
        spacing={0}
        alignItems="stretch"
        justify="space-around"
      >
        {Array.from(Array(20).keys()).map(key => (
          <Grid item xs key={key}>
            <Cell />
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default Column;
