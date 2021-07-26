import { Helmet } from 'react-helmet-async';
import React from 'react';
import Week from './components/TimeSlotPicker/Week';
import { selectOccupiedSlots } from './selectors';

import { getCurrentUser } from 'app/containers/AuthenticatedPages/selectors';
import { useSelector } from 'react-redux';
import { Slot } from 'types/Week';
import { DateTime } from 'luxon';
import { Role } from 'types/User';

interface Props {}

export interface BookingFormValues {
  roomId: number;
  purpose: string;
  details: string;
  selection: Slot | null;
}

export const ViewBookingPage = (props: Props) => {
  const occupiedSlots = useSelector(selectOccupiedSlots);
  const referenceDate = DateTime.local().startOf('weeks');
  const [deltaWeek] = React.useState(0);
  const currentUser = useSelector(getCurrentUser);
  if (currentUser == null) {
    return <></>;
  }
  return (
    <div>
      <Helmet>
        <title>Create Booking</title>
        <meta name="description" content="NUSH Library App Create Booking" />
      </Helmet>
      <div className={'h-full px-4 pb-8 md:pt-8'}>
        <div className="flex-1 mt-2" style={{ height: '100%' }}>
          <Week
            referenceDate={referenceDate.plus({ weeks: deltaWeek })}
            occupiedSlots={occupiedSlots}
            maximumDuration={currentUser.role === Role.STUDENT ? 120 : 750}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewBookingPage;
