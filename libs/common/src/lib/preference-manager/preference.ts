/**
 * Preference interface for type safety and object literals
 *
 * Note: Intentionally shares name with Preference class below for declaration merging.
 * This allows backwards compatibility with `new Preference()` while providing type safety.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface Preference {
  id: string;
  /**
   * Userdefined name for the filter
   */
  name: string;
  /**
   * Username of the person who owns the filter
   */
  user: string;
  /**
   * identifierKey is used to distinguish between which area of the application the filter is used
   * For example, identifierKey can be report_filter for a list of reports, and report_columns for the same list's column setup
   */
  identifierKey: string;
  /**
   * default determines if this is the default filter if no others are selected
   */
  default?: boolean;
  /**
   * payload is the value of the preference (e.g the filters)
   */
  payload: Record<string, unknown>;
  /**
   * external determines if the preference is external, and if so, if it should be possible to save immediately.
   */
  external?: boolean;
}

/**
 * Factory function to create a new Preference with default values.
 * Preferred over using the Preference class constructor.
 *
 * @param identifierKey The identifier key for the preference
 * @returns A new Preference object with default values
 *
 * @example
 * const pref = createPreference('reports_filter');
 */
export function createPreference(identifierKey: string): Preference {
  return {
    id: '',
    name: 'New preference',
    user: '',
    identifierKey,
    payload: {},
    default: false,
    external: false,
  };
}

/**
 * @deprecated Use createPreference() factory function instead for better type safety and initialization.
 * This class is maintained for backwards compatibility only.
 *
 * Intentional declaration merging with Preference interface above for backwards compatibility.
 * The class implements the interface contract while allowing `new Preference()` syntax.
 *
 * @example
 * // Old way (deprecated):
 * const pref = new Preference('reports_filter');
 *
 * // New way (recommended):
 * const pref = createPreference('reports_filter');
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Preference {
  id = '';
  name = 'New preference';
  user = '';
  identifierKey: string;
  default?: boolean = false;
  payload: Record<string, unknown> = {};
  external?: boolean = false;

  constructor(identifierKey: string) {
    this.identifierKey = identifierKey;
  }
}
