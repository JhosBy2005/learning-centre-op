import {inject, Service, signal} from '@angular/core';
import {Subscription} from 'rxjs';
import {WeatherApi} from '../infrastructure/weather-api';
import {CurrentWeather} from '../domain/model/current-weather.entity';

/**
 * Holds the state of the current weather consulted for a sports center.
 *
 * @author José Santana
 */
@Service()
export class WeatherStore {
  private readonly weatherApi = inject(WeatherApi);
  private currentRequest?: Subscription;

  private readonly currentWeatherSignal = signal<CurrentWeather | null>(null);

  /**
   * Readonly signal with the last weather obtained.
   */
  readonly currentWeather = this.currentWeatherSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if the weather is being loaded.
   */
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal with the last error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Loads the current weather for the given coordinates.
   * @param latitude - Latitude of the location.
   * @param longitude - Longitude of the location.
   */
  loadCurrentWeather(latitude: number, longitude: number): void {
    this.currentRequest?.unsubscribe();
    this.currentWeatherSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(true);
    this.currentRequest = this.weatherApi.getCurrentWeather(latitude, longitude).subscribe({
      next: weather => {
        this.currentWeatherSignal.set(weather);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err instanceof Error ? err.message : 'Failed to fetch current weather');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Clears the weather state.
   */
  clear(): void {
    this.currentRequest?.unsubscribe();
    this.currentWeatherSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }
}
