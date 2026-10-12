import {Component, computed, inject, signal} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';
import {SportsCentersStore} from '../../../application/sports-centers.store';
import {WeatherStore} from '../../../../weather/application/weather.store';
import {SportsCenter} from '../../../domain/model/sports-center.entity';
import {Reservation} from '../../../domain/model/reservation.entity';

/**
 * Validates that a text control does not contain only blank spaces.
 * @param control - Control to validate.
 * @returns The error object or null when the value is valid.
 */
const notBlankValidator = (control: AbstractControl): ValidationErrors | null =>
  (control.value ?? '').toString().trim().length === 0 ? {required: true} : null;

/**
 * View with the reactive form used to register a new reservation.
 *
 * @author José Santana
 */
@Component({
  selector: 'app-reservation-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './reservation-form.html',
  styleUrl: './reservation-form.css'
})
export class ReservationForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly store = inject(SportsCentersStore);
  protected readonly weatherStore = inject(WeatherStore);

  /**
   * Activity types available in the platform.
   */
  protected readonly activityTypes = ['fitness', 'yoga', 'swimming', 'cycling'];

  /**
   * Reactive form of the reservation.
   */
  protected readonly form = this.fb.nonNullable.group({
    activityType: ['', Validators.required],
    participantName: ['', [Validators.required, notBlankValidator]],
    participants: [1, [Validators.required, Validators.min(1)]]
  });

  /**
   * Sports center associated with the selected activity type.
   */
  protected readonly selectedSportsCenter = signal<SportsCenter | null>(null);

  /**
   * Available capacity of the selected sports center.
   */
  protected readonly availableCapacity = computed(() => {
    const sportsCenter = this.selectedSportsCenter();
    return sportsCenter ? this.store.getAvailableCapacity(sportsCenter) : 0;
  });

  /**
   * Indicates if the reservation is being saved.
   */
  protected readonly saving = signal(false);

  /**
   * Translation key of the error shown to the user.
   */
  protected readonly errorKey = signal<string | null>(null);

  constructor() {
    this.store.refresh();
    this.weatherStore.clear();
  }

  /**
   * Handles the selection of an activity type: identifies the sports center and queries the weather.
   * @param activityType - Selected activity type.
   */
  protected onActivityTypeChange(activityType: string): void {
    this.errorKey.set(null);
    const sportsCenter = this.store.getSportsCenterByActivityType(activityType) ?? null;
    this.selectedSportsCenter.set(sportsCenter);
    if (!sportsCenter) {
      this.weatherStore.clear();
      this.errorKey.set('reservation-form.center-not-found');
      return;
    }
    const participantsControl = this.form.controls.participants;
    participantsControl.setValidators([Validators.required, Validators.min(1),
      Validators.max(this.availableCapacity())]);
    participantsControl.updateValueAndValidity();
    this.loadWeather();
  }

  /**
   * Queries the current weather of the selected sports center.
   */
  protected loadWeather(): void {
    const sportsCenter = this.selectedSportsCenter();
    if (sportsCenter) {
      this.weatherStore.loadCurrentWeather(sportsCenter.latitude, sportsCenter.longitude);
    }
  }

  /**
   * Indicates if the reservation can be created.
   * @returns True when the form is valid and there is a valid temperature.
   */
  protected canCreate(): boolean {
    return this.form.valid && !!this.selectedSportsCenter() && !!this.weatherStore.currentWeather()
      && !this.weatherStore.loading() && !this.saving();
  }

  /**
   * Creates the reservation and navigates to home when it is saved.
   */
  protected submit(): void {
    this.form.markAllAsTouched();
    const sportsCenter = this.selectedSportsCenter();
    const weather = this.weatherStore.currentWeather();
    if (!this.canCreate() || !sportsCenter || !weather) return;

    const values = this.form.getRawValue();
    const reservation = new Reservation({
      id: 0,
      sportsCenterId: sportsCenter.id,
      activityType: sportsCenter.activityType,
      participantName: values.participantName.trim(),
      participants: Number(values.participants),
      weatherTemperature: weather.temperature,
      reservedAt: new Date()
    });

    this.saving.set(true);
    this.errorKey.set(null);
    this.store.addReservation(reservation).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/home']).then();
      },
      error: (err: Error) => {
        this.saving.set(false);
        this.errorKey.set(err.message === 'capacity-error' || err.message === 'center-not-found'
          ? `reservation-form.${err.message}` : 'reservation-form.save-error');
      }
    });
  }

  /**
   * Returns to home without saving.
   */
  protected cancel(): void {
    this.router.navigate(['/home']).then();
  }
}
