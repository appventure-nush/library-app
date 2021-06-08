import api from 'app/api';
import { Form, Formik, FormikHelpers } from 'formik';
import React, {
  createRef,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { createBookingPageSaga } from './saga';
import { reducer, sliceKey } from './slice';

import Week from './components/TimeSlotPicker/Week';
import { Slot } from './components/TimeSlotPicker/types';

interface Props {}

export interface BookingFormValues {
  roomId: number;
  purpose: String;
  details: String;
  selection: Slot | null;
}

export const CreateBookingPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: createBookingPageSaga });

  const stepLength = 3;
  const [stepCurrentIdx, setStepCurrentIdx] = useState(0);
  const [stepRefs, setStepRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const scrollToNextStep = useCallback(() => {
    if (stepCurrentIdx + 1 === stepLength || stepRefs.length !== stepLength)
      return;
    const stepNextIndex = stepCurrentIdx + 1;
    const stepNext = stepRefs[stepNextIndex];
    if (stepNext === null || stepNext.current === null) return;
    stepNext.current.scrollIntoView({ behavior: 'smooth' });
    setStepCurrentIdx(stepNextIndex + 1);
  }, [stepRefs, stepCurrentIdx]);

  const history = useHistory();

  useEffect(() => {
    setStepRefs(stepRefs =>
      Array.from(Array(stepLength), (_, i) => stepRefs[i] || createRef()),
    );
  }, []);

  const initialValues: BookingFormValues = {
    roomId: 0,
    purpose: '',
    details: '',
    selection: null,
  };

  return (
    <>
      <Helmet>
        <title>Create Booking</title>
        <meta name="description" content="NUSH Library App Create Booking" />
      </Helmet>
      <div className="h-full px-4 pb-8 md:pt-8">
        <Formik
          initialValues={initialValues}
          onSubmit={(
            values: BookingFormValues,
            { setSubmitting }: FormikHelpers<BookingFormValues>,
          ) => {
            if (values.selection === null) {
              setSubmitting(false);
              return;
            }

            api.booking
              .createBooking({
                roomId: values.roomId,
                purpose: values.purpose,
                details: values.details,
                startTime: values.selection.start.toJSDate(),
                endTime: values.selection.end.toJSDate(),
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
          <Form className="h-full">
            <div ref={stepRefs[0]} className="h-full">
              <Week fieldName={'selection'} />
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
});
