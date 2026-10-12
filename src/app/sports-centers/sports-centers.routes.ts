import {Routes} from '@angular/router';

const reservationForm = () => import('./presentation/views/reservation-form/reservation-form').then(m => m.ReservationForm);

/**
 * Route tree for the sports centers bounded context.
 *
 * @author José Santana
 */
export const sportsCentersRoutes: Routes = [
  { path: 'new', loadComponent: reservationForm, title: 'UrbanFit Sports Centers - New Reservation' }
];
