import {CurrentWeather} from '../domain/model/current-weather.entity';
import {CurrentWeatherResponse} from './current-weather-response';

/**
 * Maps the Open-Meteo response to the CurrentWeather domain entity.
 *
 * @author José Santana
 */
export class CurrentWeatherAssembler {
  /**
   * Converts a CurrentWeatherResponse to a CurrentWeather entity.
   * @param response - Response returned by Open-Meteo.
   * @returns The converted CurrentWeather entity.
   */
  toEntityFromResponse = (response: CurrentWeatherResponse): CurrentWeather =>
    new CurrentWeather({
      latitude: response.latitude,
      longitude: response.longitude,
      temperature: response.current.temperature_2m,
      time: new Date(response.current.time)
    });
}
