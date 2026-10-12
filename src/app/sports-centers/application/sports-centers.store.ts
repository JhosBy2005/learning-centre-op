import {computed, inject, Service, signal} from '@angular/core';
import {Observable, switchMap, tap, throwError} from 'rxjs';
import {SportsCentersApi} from '../infrastructure/sports-centers-api';
import {SportsCenter} from '../domain/model/sports-center.entity';
import {Reservation} from '../domain/model/reservation.entity';

/**
 * Holds the sports centers and reservations state and coordinates the reservation registration.
 *
 * @author José Santana
 */
@Service()
export class SportsCentersStore {
  private readonly sportsCentersApi = inject(SportsCentersApi);

  private readonly sportsCentersSignal = signal<SportsCenter[]>([]);

  /**
   * Readonly signal with the list of sports centers.
   */
  readonly sportsCenters = this.sportsCentersSignal.asReadonly();

  private readonly reservationsSignal = signal<Reservation[]>([]);

  /**
   * Readonly signal with the list of reservations.
   */
  readonly reservations = this.reservationsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if data is loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal with the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal with the total participants registered per sports center id.
   */
  readonly totalParticipantsBySportsCenter = computed(() => {
    const totals = new Map<number, number>();
    this.reservations().forEach(reservation => {
      const current = totals.get(reservation.sportsCenterId) ?? 0;
      totals.set(reservation.sportsCenterId, current + reservation.participants);
    });
    return totals;
  });

  /**
   * Reloads sports centers and reservations from the API.
   */
  refresh(): void {
    this.loadSportsCenters();
    this.loadReservations();
  }

  /**
   * Finds the sports center that offers the given activity type.
   * @param activityType - Activity type selected by the user.
   * @returns The sports center or undefined when it does not exist.
   */
  getSportsCenterByActivityType(activityType: string): SportsCenter | undefined {
    return this.sportsCenters().find(center => center.activityType === activityType);
  }

  /**
   * Gets the reservations of a sports center.
   * @param sportsCenterId - Sports center identifier.
   * @returns The reservations registered for the sports center.
   */
  getReservationsBySportsCenterId(sportsCenterId: number): Reservation[] {
    return this.reservations().filter(reservation => reservation.sportsCenterId === sportsCenterId);
  }

  /**
   * Gets the total participants of a sports center.
   * @param sportsCenterId - Sports center identifier.
   * @returns Sum of participants of all the reservations of the sports center.
   */
  getTotalParticipants(sportsCenterId: number): number {
    return this.totalParticipantsBySportsCenter().get(sportsCenterId) ?? 0;
  }

  /**
   * Gets the available capacity of a sports center.
   * @param sportsCenter - Sports center to evaluate.
   * @returns Capacity minus total participants.
   */
  getAvailableCapacity(sportsCenter: SportsCenter): number {
    return sportsCenter.capacity - this.getTotalParticipants(sportsCenter.id);
  }

  /**
   * Registers a new reservation.
   *
   * @remarks
   * Before the POST the reservations are queried again to recalculate the available capacity.
   *
   * @param reservation - Reservation to register.
   * @returns Stream with the created reservation.
   */
  addReservation(reservation: Reservation): Observable<Reservation> {
    const sportsCenter = this.sportsCenters().find(center => center.id === reservation.sportsCenterId);
    if (!sportsCenter) {
      return throwError(() => new Error('center-not-found'));
    }
    return this.sportsCentersApi.getReservations().pipe(
      tap(reservations => this.reservationsSignal.set(reservations)),
      switchMap(() => {
        const availableCapacity = this.getAvailableCapacity(sportsCenter);
        if (reservation.participants <= 0 || reservation.participants > availableCapacity) {
          return throwError(() => new Error('capacity-error'));
        }
        return this.sportsCentersApi.createReservation(reservation);
      }),
      tap(created => this.reservationsSignal.update(reservations => [...reservations, created]))
    );
  }

  /**
   * Loads all sports centers from the API.
   */
  private loadSportsCenters(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.sportsCentersApi.getSportsCenters().subscribe({
      next: sportsCenters => {
        this.sportsCentersSignal.set(sportsCenters);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load sports centers'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all reservations from the API.
   */
  private loadReservations(): void {
    this.sportsCentersApi.getReservations().subscribe({
      next: reservations => this.reservationsSignal.set(reservations),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load reservations'))
    });
  }

  /**
   * Normalizes unknown errors into a display friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
