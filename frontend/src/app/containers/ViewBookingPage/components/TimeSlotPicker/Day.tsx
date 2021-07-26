import { DateTime } from 'luxon';
import React, {
  MouseEvent,
  TouchEvent,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { toDate } from './utils';
import { DisabledSlot, OccupiedSlot, Slot } from 'types/Week';
import SelectionSlot from './SelectionSlot';

export interface DayCallables {
  removeSelection: () => void;
}

export interface DayProps {
  available?: boolean;
  numberOfIntervals: number;
  date: DateTime;
  maximumDuration: number;

  disabledSlots?: DisabledSlot[];
  occupiedSlots?: OccupiedSlot[];

  onSelectStart?: () => void;
  onSelectFinish?: (selection: Slot) => void;
}

const Day = React.forwardRef<DayCallables, DayProps>((props, ref) => {
  const {
    available,
    numberOfIntervals,
    date,
    maximumDuration,
    disabledSlots = [],
    occupiedSlots = [],
    onSelectStart,
    onSelectFinish,
  } = props;

  const dayHasPassed = date < DateTime.local().startOf('days');
  const divRef = useRef<HTMLDivElement>(null);
  const [parentDiv, setParentDiv] = useState<HTMLDivElement | null>(null);
  const [parentDivHeight, setParentDivHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState<Slot | null>(null);

  useImperativeHandle(ref, () => ({
    removeSelection: () => {
      selection !== null && setSelection(null);
    },
  }));

  useEffect(() => {
    if (parentDiv !== null) {
      setParentDivHeight(parentDiv.getBoundingClientRect().height);
    }
  }, [parentDiv, parentDiv?.getBoundingClientRect]);

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

    setSelection({ start: dateAtPosition, end: end });
    setIsDragging(true);
    onSelectStart && onSelectStart();
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || selection === null) return;
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
      endDateAtPosition <= selection.start ||
      endDateAtPosition.diff(selection.start, 'minutes').minutes >
        maximumDuration ||
      endDateAtPosition.hour >= 18
    )
      return;

    if (isInIllegalSlot(dateAtPosition)) {
      setIsDragging(false);
      return;
    }

    setSelection({ start: selection.start, end: endDateAtPosition });
  };

  const handleEnd = () => {
    if (isDragging) {
      onSelectFinish && selection !== null && onSelectFinish(selection);
      setIsDragging(false);
    }
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
      ref={el => setParentDiv(el)}
      className={`h-full select-none relative border-l border-solid border-gray-400 ${
        dayHasPassed && 'bg-gray-600'
      }`}
    >
      {!dayHasPassed && available && (
        <div
          ref={divRef}
          className="h-full w-full absolute cursor-default z-10"
          onMouseDown={handleMouseDown}
          onMouseUp={handleEnd}
          onMouseOut={handleEnd}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        />
      )}
      {selection && selection.start.day === date.day && (
        <SelectionSlot
          selection={selection}
          intervalInPixels={parentDivHeight / numberOfIntervals}
        />
      )}
      {occupiedSlots
        .filter(slot => slot.start.day === date.day)
        .map((slot, idx) => (
          <SelectionSlot
            key={idx}
            selection={slot}
            intervalInPixels={parentDivHeight / numberOfIntervals}
            slotColor="bg-gray-600"
            selectable={false}
          />
        ))}
    </div>
  );
});

export default Day;
