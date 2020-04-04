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
  name?: string;
  icon?: string;
  svgIcon?: boolean;
  command?: MenuItemCommand;
  error?: string;
}

export interface MenuItemCommand {
  type: MenuItemTypes;
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
