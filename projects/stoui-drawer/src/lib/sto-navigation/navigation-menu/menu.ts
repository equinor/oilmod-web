export interface Menu {
  groups: MenuGroup[];

  [ key: string ]: any; // Other possible usages e.g for identifiers
}

export interface MenuGroup {
  hasDivider?: boolean;
  icon?: string;
  svgIcon?: boolean;
  items: MenuItem[];
  name?: string;
}

export interface MenuItem {
  id?: string;
  name?: string;
  icon?: string;
  svgIcon?: boolean;
  command?: MenuItemCommand;
  error?: string;
}

export interface MenuItemCommand {
  type: MenuItemTypes;
  /**
   * For internal urls: RouterCommands.
   * For external urls, should just be array with one element (the full url)
   */
  arguments: Array<string | number>;
}

export interface NavigateCommand {
  $event: MouseEvent | KeyboardEvent;
  command: Array<string | number>;
}

export enum MenuItemTypes {
  External = 'externalLink',
  ExternalNew = 'externalLinkNewWindow',
  Internal = 'internalLink',
  Navigate = 'navigate'
}
