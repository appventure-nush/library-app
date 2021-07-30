/* eslint-disable jsx-a11y/anchor-is-valid */
import { Dialog, Transition } from '@headlessui/react';
import { ClipboardListIcon } from '@heroicons/react/outline';
import React, { Fragment, useRef, useState } from 'react';

const BookingRulesButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const completeButtonRef = useRef(null);

  return (
    <>
      <button
        className="flex-1 text-white hover:bg-teal-500 hover:bg-opacity-75 group focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md"
        onClick={() => setOpen(true)}
      >
        <ClipboardListIcon
          className="mr-2 flex-shrink-0 h-6 w-6 text-teal-200"
          aria-hidden="true"
        />
        Booking Rules
      </button>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setOpen(false)}
          initialFocus={completeButtonRef}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full md:w-auto max-w-9xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Booking of Node Spaces by Students
                </Dialog.Title>

                <div
                  className="overflow-scroll md:overflow-auto relative p-2 sm:p-4 lg:p-6"
                  style={{ height: '32rem' }}
                >
                  <div className="text-lg max-w-prose mx-auto min-w-full">
                    <p className="my-4 text-gray-500 leading-8">
                      <strong>Library Opening Hours</strong>
                      <br /> 0800—1630 hours
                      <br /> Monday—Friday (School Days only)
                    </p>
                  </div>
                  <div className="text-lg max-w-prose mx-auto min-w-full">
                    <p className="text text-gray-500 leading-8">
                      <strong>Booking Guidelines</strong>
                    </p>
                  </div>
                  <div className="prose prose-teal prose-sm text-gray-500 mx-auto min-w-full">
                    <ol style={{ marginTop: 0 }}>
                      <li>
                        Students are entitled to book the four discussion
                        rooms—Nary 1, Nary 0, Lemma 2 and Lemma 3.
                      </li>
                      <li>
                        Booking is limited to a maximum of two sessions of 2
                        hours a week.
                      </li>
                      <li>Only one room can be booked for any time slot.</li>
                      <li>
                        Students can book the rooms one week in advance,
                        including the current week.
                      </li>
                      <li>
                        Usage of Discussion Zone (Phi Commons), Quiet Room and
                        Study Zone (Proton and Neutron) does not require
                        booking.
                      </li>
                      <strong>
                        The following usage requests must be approved by staff
                        and can only be done through them.
                      </strong>
                      <li>Booking for Electron and Vivo</li>
                      <li>Usage of library spaces after 4.30pm</li>
                      <li>
                        Set up of additional ICT equipment and/or request for
                        ICT or logistical support
                      </li>
                    </ol>
                  </div>
                  <div className="grid grid-cols-9 min-w-max md:min-w-min grid-flow-row auto-rows-max md:auto-rows-min">
                    <div className="col-span-2 border-r px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Library Space for booking
                    </div>
                    <div className="col-span-4 border-r px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facilities, Access and Recommended Use
                    </div>
                    <div className="col-span-3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Protocol
                    </div>
                    <div className="border-t border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Discussion Room
                      <br />
                      <strong>Nary 1</strong>
                    </div>
                    <div className="border-t border-r col-span-4 row-span-4 px-6 py-2 prose prose-teal prose-sm text-gray-500 min-w-full">
                      <ul>
                        <li>1 table with 6—8 chairs</li>
                        <li>TV Screen that enables projection from laptop</li>
                      </ul>
                      <p>
                        Recommended for small group discussions, consultations
                        and assessments.
                      </p>
                      <p>
                        Booking is limited to a maximum of two sessions of 2
                        hours a week. <br />
                        Only one room can be booked for any given time slot.
                        Students can book the rooms one week in advance,
                        including the current week.
                      </p>
                    </div>
                    <div className="border-t col-span-3 row-span-4 px-6 py-2 prose prose-teal prose-sm text-gray-500">
                      <p>
                        Book via <a href="#">https://library.nush.app/</a>
                      </p>
                      <p>
                        You must key in the room pin that is indicated on the
                        monitor of the library counter. Please check with the
                        librarian for issues in keying in the pin.
                      </p>
                      <p>
                        Decentralised lights and air-con for each room. Please
                        switch off after usage.
                      </p>
                    </div>
                    <div className="border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Discussion Room
                      <br />
                      <strong>Nary 0</strong>
                    </div>
                    <div className="border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Discussion Room
                      <br />
                      <strong>Lemma 2</strong>
                    </div>
                    <div className="border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Discussion Room
                      <br />
                      <strong>Lemma 3</strong>
                    </div>
                    <div className="border-t border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Tiered Seating Area
                      <br />
                      <strong>Vivo</strong>
                    </div>
                    <div className="border-t border-r col-span-4 px-6 py-2 prose prose-teal prose-sm text-gray-500 min-w-full">
                      <ul>
                        <li>
                          Tied seating area that can accommodate about 25—28
                          students
                        </li>
                        <li>
                          No projector and projector screen, unless approval is
                          given for set-up by IT dept
                        </li>
                      </ul>
                      <p>
                        Suitable for performance, open discussions and
                        presentations.
                      </p>
                      <p>
                        As it is an open area that can be accessed by all
                        students, users who have booked the space may have to
                        ask other users to vacate.
                      </p>
                    </div>
                    <div className="border-t col-span-3 row-span-2 px-6 py-2 prose prose-teal prose-sm text-gray-500">
                      <p>
                        Students are able to use the space for independent
                        events, if their proposal to library committee is
                        approved.
                        <br />
                        However,{' '}
                        <strong>
                          students will not be able to book the space. Hence
                          staff will book on behalf of the students.
                        </strong>
                      </p>
                    </div>
                    <div className="border-t border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Group Study Area
                      <br />
                      <strong>Electron</strong>
                    </div>
                    <div className="border-t border-r col-span-4 px-6 py-2 prose prose-teal prose-sm text-gray-500 min-w-full">
                      <ul>
                        <li>
                          Enclosed venue that can be accessed by both staff and
                          students through the library
                        </li>
                        <li>
                          Projector, screen and mobile flipchart whiteboards are
                          available
                        </li>
                        <li>
                          Currently there are 6 tables with 4 chairs, though the
                          space can accommodate more
                        </li>
                      </ul>
                      <p>
                        Suitable for events, seminars, workshops, discussions
                        and seminars with group work and use of ICT.
                      </p>
                      <p>
                        When Safe-Distancing Measures are lifted, Electron will
                        be opened for students’ regular usage (for reading,
                        studying etc). Hence users who book the room for events
                        will need to ask the other users to vacate.
                      </p>
                    </div>
                    <div className="border-t border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Discussion Zone
                      <br />
                      <strong>Phi Commons</strong>
                    </div>
                    <div className="border-t border-r col-span-4 px-6 py-2 prose prose-teal prose-sm text-gray-500 min-w-full">
                      <p>
                        Open space that can be used for discussions and
                        consultations.
                      </p>
                      <em>No booking required</em>
                    </div>
                    <div className="border-t col-span-3 row-span-2 px-6 py-2 prose prose-teal prose-sm text-gray-500" />
                    <div className="border-t border-r col-span-2 px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                      Quiet Room and Study Zone
                      <br />
                      <strong>Proton &amp; Neutron </strong>
                    </div>
                    <div className="border-t border-r col-span-4 px-6 py-2 prose prose-teal prose-sm text-gray-500 min-w-full">
                      <p>
                        Partitioned tables that can be used for studying,
                        reading and assessments.
                      </p>
                      <em>No booking required</em>
                    </div>
                  </div>
                  <div className="text-lg max-w-prose mx-auto min-w-full">
                    <p className="text text-gray-500 leading-8">
                      <strong>Floor Plan of Node</strong>
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-5/6">
                      <img
                        alt="floor plan"
                        src={`${process.env.PUBLIC_URL}/floor_plan.png`}
                        className="max-w-max md:max-w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-row justify-between w-full">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-transparent rounded-md hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() =>
                      window.open(
                        `${process.env.PUBLIC_URL}/bookingrules.pdf`,
                        '_blank',
                      )
                    }
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    ref={completeButtonRef}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default BookingRulesButton;
