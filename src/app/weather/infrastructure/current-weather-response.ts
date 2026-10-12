/**
 * Resource with the current values returned by Open-Meteo.
 *
 * @remarks
 * Attribute names follow the provider format and are mapped by the assembler.
 *
 * @author José Santana
 */
export interface CurrentWeatherResource {
  time: string;
  interval: number;
  temperature_2m: number;
}

/**
 * Response returned by the Open-Meteo forecast endpoint.
 */
export interface CurrentWeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeatherResource;
}
