import { DateTime } from 'luxon';
import React, { useRef } from 'react';
import Day from './Day';

export interface WeekProps {
  fieldName: string;
}

const Week: React.FC<WeekProps> = props => {
  const { fieldName } = props;
  const referenceDate = DateTime.local().startOf('weeks');
  const divRef = useRef<HTMLDivElement>(null);

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

      <div ref={divRef} className="h-full mt-1">
        <div className="grid grid-cols-11 w-full h-full">
          <div className="text-black dark:text-white text-xs font-extralight text-right pr-2">
            {divRef && divRef.current && (
              <>
                {Array.from(Array(19).keys(), i => (
                  <div
                    key={i}
                    style={{
                      height:
                        divRef.current!.getBoundingClientRect().height / 19,
                    }}
                  >
                    {i % 2 === 0 ? (
                      <p>{String(i / 2 + 8).padStart(2, '0')}00</p>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="col-span-10 grid grid-cols-5 relative border-t border-r border-b border-gray-400">
            {Array.from(Array(5).keys(), delta => (
              <Day
                key={delta}
                fieldName={fieldName}
                available
                date={referenceDate.plus({ days: delta })}
                numberOfIntervals={19}
              />
            ))}
            {divRef && divRef.current && (
              <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
                {Array.from(Array(19).keys(), i => (
                  <div
                    key={i}
                    className={`pointer-events-none ${
                      i % 2 && 'border-b border-gray-400'
                    }`}
                    style={{
                      height:
                        divRef.current!.getBoundingClientRect().height / 19,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Week;
