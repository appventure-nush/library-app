/**
 *
 * Asynchronously loads the component for DashboardPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateBookingPage = lazyLoad(
  () => import('./index'),
  module => module.CreateBookingPage,
);
