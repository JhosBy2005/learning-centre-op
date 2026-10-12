import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CurrentWeather} from '../domain/model/current-weather.entity';
import {CurrentWeatherResponse} from './current-weather-response';
import {CurrentWeatherAssembler} from './current-weather-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for the Open-Meteo forecast endpoint.
 *
 * @author José Santana
 */
export class CurrentWeatherApiEndpoint {
  private readonly endpointUrl = `${environment.weatherProviderApiBaseUrl}${environment.weatherProviderForecastEndpointPath}`;
  private readonly assembler = new CurrentWeatherAssembler();

  /**
   * Creates an instance of CurrentWeatherApiEndpoint.
   * @param http - The HttpClient used to make API requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Gets the current weather for the given coordinates.
   * @param latitude - Latitude of the location.
   * @param longitude - Longitude of the location.
   * @returns Stream with the current weather.
   */
  getByCoordinates(latitude: number, longitude: number): Observable<CurrentWeather> {
    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude)
      .set('current', environment.weatherProviderCurrentVariables);
    return this.http.get<CurrentWeatherResponse>(this.endpointUrl, {params}).pipe(
      map(response => {
        if (response?.current?.temperature_2m === undefined || response.current.temperature_2m === null) {
          throw new Error('Temperature not available');
        }
        return this.assembler.toEntityFromResponse(response);
      }),
      catchError(() => throwError(() => new Error('Failed to fetch current weather')))
    );
  }
}
