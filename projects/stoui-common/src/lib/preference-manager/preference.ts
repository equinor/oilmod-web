export class Preference {
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
   * If no filters are marked as d
   */
  default?: boolean;
  /**
   * payload is the value of the preference (e.g the filters)
   */
  payload: Object;

  constructor(identifierKey: string) {
    this.name = 'New preference';
    this.identifierKey = identifierKey;
  }
}
