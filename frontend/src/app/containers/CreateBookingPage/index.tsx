import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { createBookingPageSaga } from './saga';
import { selectCreateBookingPage } from './selectors';
import { reducer, sliceKey } from './slice';
import { Form, Formik, FormikHelpers } from 'formik';
import CreateBookingStepper from './components/CreateBookingStepper';
import { DateTime } from 'luxon';
import api from 'app/api';
import { toast } from 'react-toastify';

interface Props {}

export interface BookingFormValues {
  purpose: String;
  details: String;
  timeSlot?: { start: DateTime; end: DateTime };
}

export const CreateBookingPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createBookingPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dashboardPage = useSelector(selectCreateBookingPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory();

  return (
    <>
      <Helmet>
        <title>Create Booking</title>
        <meta name="description" content="NUSH Library App Dashboard" />
      </Helmet>
      <Formik
        initialValues={{
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
              toast.error(err);
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
