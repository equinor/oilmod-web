import { PipeTransform } from '@angular/core';
import { ValueGetter } from '../utils/column-prop-getters';

/**
 * Column property that indicates how to retrieve this column's
 * value from a row.
 * 'a.deep.value', 'normalprop', 0 (numeric)
 */
export type TableColumnProp = string|number;

/**
 * Column Type
 *  {object}
 */
export interface TableColumn {

  /**
   * Internal unique id
   *
   *  {string}
   * @memberOf TableColumn
   */
  $$id?: string;

  /**
   * Internal for column width distributions
   *
   *  {number}
   * @memberOf TableColumn
   */
  $$oldWidth?: number;

  /**
   * Internal for setColumnDefaults
   *
   *  {ValueGetter}
   * @memberOf TableColumn
   */
  $$valueGetter?: ValueGetter;

  /**
   * Determines if column is checkbox
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  checkboxable?: boolean;

  /**
   * Determines if the column is frozen to the left
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  frozenLeft?: boolean;

  /**
   * Determines if the column is frozen to the right
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  frozenRight?: boolean;

  /**
   * The grow factor relative to other columns. Same as the flex-grow
   * API from http =//www.w3.org/TR/css3-flexbox/. Basically;
   * take any available extra width and distribute it proportionally
   * according to all columns' flexGrow values.
   *
   *  {number}
   * @memberOf TableColumn
   */
  flexGrow?: number;

  /**
   * Min width of the column
   *
   *  {number}
   * @memberOf TableColumn
   */
  minWidth?: number;

  /**
   * Max width of the column
   *
   *  {number}
   * @memberOf TableColumn
   */
  maxWidth?: number;

  /**
   * The default width of the column, in pixels
   *
   *  {number}
   * @memberOf TableColumn
   */
  width?: number;

  /**
   * Can the column be resized
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  resizeable?: boolean;

  /**
   * Custom sort comparator
   *
   *  {*}
   * @memberOf TableColumn
   */
  comparator?: any;

  /**
   * Custom pipe transforms
   *
   *  {PipeTransform}
   * @memberOf TableColumn
   */
  pipe?: PipeTransform;

  /**
   * Can the column be sorted
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  sortable?: boolean;

  /**
   * Can the column be re-arranged by dragging
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  draggable?: boolean;

  /**
   * Whether the column can automatically resize to fill space in the table.
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  canAutoResize?: boolean;

  /**
   * Column name or label
   *
   *  {string}
   * @memberOf TableColumn
   */
  name?: string;

  /**
   * Property to bind to the row. Example:
   *
   * `someField` or `some.field.nested`, 0 (numeric)
   *
   * If left blank, will use the name as camel case conversion
   *
   *  {TableColumnProp}
   * @memberOf TableColumn
   */
  prop?: TableColumnProp;

  /**
   * Cell template ref
   *
   *  {*}
   * @memberOf TableColumn
   */
  cellTemplate?: any;

  /**
   * Header template ref
   *
   *  {*}
   * @memberOf TableColumn
   */
  headerTemplate?: any;

  /**
   * CSS Classes for the cell
   *
   *
   * @memberOf TableColumn
   */
  cellClass?: string | ((data: any) => string|any);

  /**
   * CSS classes for the header
   *
   *
   * @memberOf TableColumn
   */
  headerClass?: string | ((data: any) => string|any);

  /**
   * Header checkbox enabled
   *
   *  {boolean}
   * @memberOf TableColumn
   */
  headerCheckboxable?: boolean;

}
