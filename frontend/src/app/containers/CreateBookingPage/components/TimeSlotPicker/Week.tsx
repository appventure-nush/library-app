import { useField } from 'formik';
import { DateTime } from 'luxon';
import React, { createRef, useEffect, useState } from 'react';
import Day, { DayCallables } from './Day';
import { OccupiedSlot, Slot } from 'types/Week';

export interface WeekProps {
  fieldName: string;
  referenceDate: DateTime;
  occupiedSlots?: OccupiedSlot[];
  maximumDuration: number;
}

const Week: React.FC<WeekProps> = props => {
  const {
    fieldName,
    referenceDate,
    maximumDuration,
    occupiedSlots = [],
  } = props;
  const [divEl, setDivEL] = useState<HTMLDivElement | null>(null);
  const [divHeight, setDivHeight] = useState(0);
  const [dayRefs, setDayRefs] = useState<Array<React.RefObject<DayCallables>>>(
    [],
  );
  const [field, , helpers] = useField(fieldName);

  useEffect(() => {
    setDayRefs(dayRefs =>
      Array.from(Array(5).keys()).map(i => dayRefs[i] || createRef()),
    );
  }, []);

  useEffect(() => {
    if (divEl !== null) {
      setDivHeight(divEl.getBoundingClientRect().height);
    }
  }, [divEl, divEl?.getBoundingClientRect]);

  useEffect(() => {
    if (field.value === null) {
      dayRefs.forEach((dayRef, i) => {
        dayRef.current && dayRef.current.removeSelection();
      });
    }
  }, [dayRefs, field.value]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="grid grid-cols-11 items-center justify-center">
        <div />
        {Array.from(Array(5).keys(), delta => {
          const day = referenceDate.plus({ days: delta });
          return (
            <div
              key={delta}
              className="col-span-2 text-center text-black dark:text-white"
            >
              <p className="text-sm md:text-md font-semibold">
                {day.weekdayShort}
              </p>
              <p className="text-xs md:text-sm">
                ({day.day} {day.monthShort})
              </p>
            </div>
          );
        })}
      </div>

      <div ref={el => setDivEL(el)} className="flex-1 mt-1">
        <div className="grid grid-cols-11 w-full h-full">
          <div className="text-black dark:text-white text-xs font-extralight text-right pr-2">
            {Array.from(Array(19).keys(), i => (
              <div
                key={i}
                style={{
                  height: divHeight / 19,
                }}
              >
                {i % 2 === 0 ? (
                  <p>{String(i / 2 + 8).padStart(2, '0')}00</p>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div className="col-span-10 grid grid-cols-5 relative border-t border-r border-b border-gray-400">
            {Array.from(Array(5).keys(), delta => {
              const date = referenceDate.plus({ days: delta });
              return (
                <Day
                  key={delta}
                  ref={dayRefs[delta]}
                  available
                  date={date}
                  maximumDuration={maximumDuration}
                  numberOfIntervals={19}
                  occupiedSlots={occupiedSlots}
                  onSelectStart={() => {
                    dayRefs.forEach((columnRef, i) => {
                      delta !== i &&
                        columnRef.current &&
                        columnRef.current.removeSelection();
                    });
                  }}
                  onSelectFinish={(selection: Slot) => {
                    helpers.setValue(selection);
                  }}
                />
              );
            })}
            <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
              {Array.from(Array(19).keys(), i => (
                <div
                  key={i}
                  className={`pointer-events-none ${
                    i % 2 && 'border-b border-gray-400'
                  }`}
                  style={{
                    height: divHeight / 19,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Week;
