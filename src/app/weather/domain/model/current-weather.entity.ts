/**
 * Represents the current weather conditions of a location.
 *
 * @author José Santana
 */
export class CurrentWeather {
  /**
   * Latitude of the location.
   */
  #latitude: number;

  /**
   * Longitude of the location.
   */
  #longitude: number;

  /**
   * Current temperature in Celsius degrees.
   */
  #temperature: number;

  /**
   * Time of the measurement.
   */
  #time: Date;

  /**
   * Creates a new current weather entity.
   * @param props - Initialization values.
   */
  constructor(props: { latitude: number; longitude: number; temperature: number; time: Date }) {
    this.#latitude = props.latitude;
    this.#longitude = props.longitude;
    this.#temperature = props.temperature;
    this.#time = props.time;
  }

  get latitude(): number {
    return this.#latitude;
  }

  get longitude(): number {
    return this.#longitude;
  }

  get temperature(): number {
    return this.#temperature;
  }

  get time(): Date {
    return this.#time;
  }
}
