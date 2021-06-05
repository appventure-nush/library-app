import api from 'app/api';
import { Form, Formik, FormikHelpers } from 'formik';
import { DateTime } from 'luxon';
import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import CreateBookingStepper from './components/CreateBookingStepper';
import { createBookingPageSaga } from './saga';
import { reducer, sliceKey } from './slice';

import { TimePicker } from 'antd';

const { RangePicker } = TimePicker;

interface Props {}

export interface BookingFormValues {
  roomId: number;
  purpose: String;
  details: String;
  timeSlot?: { start: DateTime; end: DateTime };
}

export const CreateBookingPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createBookingPageSaga });

  const history = useHistory();

  return (
    <>
      <Helmet>
        <title>Create Booking</title>
        <meta name="description" content="NUSH Library App Dashboard" />
      </Helmet>
      <div className="md:hidden">
        <form className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                <div>
                  <label
                    htmlFor="timerange"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Time
                  </label>
                  <RangePicker
                    name="timerange"
                    className="mt-1"
                    hideDisabledOptions
                    format="HH:mm"
                    minuteStep={30}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="hidden md:block">
        <Formik
          initialValues={{
            roomId: 0,
            purpose: '',
            details: '',
          }}
          onSubmit={(
            values: BookingFormValues,
            { setSubmitting }: FormikHelpers<BookingFormValues>,
          ) => {
            if (values.timeSlot === undefined) {
              setSubmitting(false);
              return;
            }

            api.booking
              .createBooking({
                roomId: values.roomId,
                purpose: values.purpose,
                details: values.details,
                startTime: values.timeSlot.start.toJSDate(),
                endTime: values.timeSlot.end.toJSDate(),
              })
              .then(() => {
                setSubmitting(false);
                toast.success('Booking successful');
                history.push('/');
              })
              .catch(err => {
                toast.error('Booking failed');
              });
          }}
        >
          <Form>
            <CreateBookingStepper />
          </Form>
        </Formik>
      </div>
    </>
  );
});
