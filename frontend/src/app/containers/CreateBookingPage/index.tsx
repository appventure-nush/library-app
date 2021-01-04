import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { createBookingPageSaga } from './saga';
import { reducer, sliceKey } from './slice';
import { Form, Formik, FormikHelpers } from 'formik';
import CreateBookingStepper from './components/CreateBookingStepper';
import { DateTime } from 'luxon';
import api from 'app/api';
import { toast } from 'react-toastify';

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
    </>
  );
});
