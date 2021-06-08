import { DateTime } from 'luxon';
import React, { MouseEvent, TouchEvent, useRef, useState } from 'react';
import { toDate } from './utils';
import { DisabledSlot, OccupiedSlot, Slot } from './types';
import SelectionSlot from './SelectionSlot';
import { useField } from 'formik';

export interface DayProps {
  available?: boolean;
  fieldName: string;
  numberOfIntervals: number;
  date: DateTime;

  disabledSlots?: DisabledSlot[];
  occupiedSlots?: OccupiedSlot[];

  onStartSelect?: () => void;
}

const Day: React.FC<DayProps> = props => {
  const {
    available,
    fieldName,
    numberOfIntervals,
    date,
    disabledSlots = [],
    occupiedSlots = [],
    onStartSelect,
  } = props;

  const parentDivRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [field, , helpers] = useField<Slot | null>(fieldName);

  const isInIllegalSlot = (date: DateTime) => {
    for (let i = 0; i < disabledSlots.length; i++) {
      const slot = disabledSlots[i];
      if (date >= slot.start && date < slot.end) return true;
    }
    for (let i = 0; i < occupiedSlots.length; i++) {
      const slot = occupiedSlots[i];
      if (date >= slot.start && date < slot.end) return true;
    }
    return false;
  };

  const relativeY = (clientY: number, bound: DOMRect) => {
    const { top, height } = bound;
    const realY = clientY - top;
    const snapTo = height / numberOfIntervals;
    return Math.floor(realY / snapTo) * snapTo;
  };

  const handleStart = (clientY: number) => {
    if (divRef === null || divRef.current === null) return;
    const divBound = divRef.current.getBoundingClientRect();
    const position = relativeY(clientY, divBound);

    const dateAtPosition = toDate(
      date,
      position,
      divBound.height / numberOfIntervals,
    );

    if (isInIllegalSlot(dateAtPosition)) {
      return;
    }

    let end = dateAtPosition.plus({ minutes: 30 });
    helpers.setValue({ start: dateAtPosition, end: end });
    setIsDragging(true);
    onStartSelect && onStartSelect();
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || field.value === null) return;
    if (divRef === null || divRef.current === null) return;
    let divBound = divRef.current.getBoundingClientRect();
    const position = relativeY(clientY, divBound);

    const dateAtPosition = toDate(
      date,
      position,
      divBound.height / numberOfIntervals,
    );
    const endDateAtPosition = dateAtPosition.plus({ minutes: 30 });

    if (
      endDateAtPosition <= field.value.start ||
      endDateAtPosition.diff(field.value.start, 'minutes').minutes > 120
    )
      return;

    if (isInIllegalSlot(dateAtPosition)) {
      setIsDragging(false);
      return;
    }
    helpers.setValue({ start: field.value.start, end: endDateAtPosition });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    handleStart(e.clientY);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    handleStart(e.touches[0].clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientY);
  };

  return (
    <div
      ref={parentDivRef}
      className="h-full select-none relative border-l border-solid border-gray-400"
    >
      {available && (
        <div
          ref={divRef}
          className="h-full w-full absolute cursor-default z-10"
          onMouseDown={handleMouseDown}
          onMouseUp={handleEnd}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        />
      )}
      {field.value &&
        field.value.start.day === date.day &&
        parentDivRef &&
        parentDivRef.current && (
          <SelectionSlot
            selection={field.value}
            intervalInPixels={
              parentDivRef.current.getBoundingClientRect().height /
              numberOfIntervals
            }
          />
        )}
    </div>
  );
};

export default Day;
