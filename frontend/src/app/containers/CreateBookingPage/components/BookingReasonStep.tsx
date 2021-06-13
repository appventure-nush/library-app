import { useField } from 'formik';
import React, { Fragment, useEffect, useState } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

interface BookingReasonStepProps {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const purposes = ['Study', 'Project', 'Meeting'];

const BookingReasonStep: React.FC<BookingReasonStepProps> = props => {
  const { handleBack } = props;
  const [purposeField, , purposeHelper] = useField<string>('purpose');
  const [detailsField, , detailsHelper] = useField<string>('details');
  const [purpose, setPurpose] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    setPurpose(purposeField.value);
    setDetails(detailsField.value);
  }, [detailsField.value, purposeField.value]);

  return (
    <div className="sm:mt-5 space-y-6 sm:space-y-5">
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
        <label
          htmlFor="purpose"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2"
        >
          Purpose
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <div className="max-w-lg flex">
            <Listbox
              value={purpose}
              onChange={val => {
                purposeHelper.setValue(val);
                setPurpose(val);
              }}
            >
              <div className="relative mt-1 w-full">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                  <span className="block truncate">{purpose || ' - '}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {purposes.map((purposeText, idx) => (
                      <Listbox.Option
                        key={idx}
                        className={({ active }) =>
                          `${
                            active
                              ? 'text-amber-900 bg-amber-100'
                              : 'text-gray-900'
                          }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                        }
                        value={purposeText}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${
                                selected ? 'font-medium' : 'font-normal'
                              } block truncate`}
                            >
                              {purposeText}
                            </span>
                            {selected ? (
                              <span
                                className={`${
                                  active ? 'text-amber-600' : 'text-amber-600'
                                }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor="detail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2"
        >
          Detail
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <textarea
            id="detail"
            name="detail"
            rows={3}
            className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
            defaultValue={''}
            value={details}
            onChange={(e: React.FocusEvent<HTMLTextAreaElement>) => {
              setDetails(e.target.value);
            }}
            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
              detailsHelper.setValue(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mt-2">
        <button
          type="submit"
          className="disabled:opacity-50 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          disabled={purposeField.value === '' || detailsField.value === ''}
        >
          Submit
        </button>
        <button
          type="button"
          className="mr-1 disabled:opacity-50 bg-transparent hover:bg-teal-500 text-teal-700 dark:text-gray-300 font-bold py-2 px-4 border border-teal-500 hover:border-transparent rounded"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default BookingReasonStep;
