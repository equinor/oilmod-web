import { TableColumnProp } from '../../vendor/ngx-datatable/types';


/**
 * Column Type
 *  {object}
 */
export interface ColumnGroup {

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


  properties?: TableColumnProp[];
  columns?: string[];

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
   * Header template ref
   *
   *  {*}
   * @memberOf TableColumn
   */
  headerTemplate?: any;


  /**
   * CSS classes for the header
   *
   *
   * @memberOf TableColumn
   */
  headerClass?: string | ((data: any) => string|any);



}
