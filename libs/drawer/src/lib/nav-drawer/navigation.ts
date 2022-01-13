type CommonNavigation = {
  /**
   * label is the displayed text to the user
   */
  label: string;
  /**
   * disabled determines if the link should be disabled or not.
   */
  disabled?: boolean;
  /**
   * route is used for internal routing in the same application
   */
  route?: Array<string | number>;
  /**
   * link is used for external links to different applications (reports or other micro-frontends)
   */
  link?: string;
}

export type Navigation = CommonNavigation & {
  /**
   * icon is used in the collapsed view. Required for top-level
   */
  icon: string;
  /**
   * svgIcon determines if you want to use an svgIcon
   */
  svgIcon?: boolean;
  /**
   * chldren is a list of {@link NavigationChild} used to show collapse / expand icons or build a menu
   */
  children?: Array<NavigationChild>;
  /**
   * title is shown in the expanded mat-menu. If not supplied, no top-level menu-item will be created.
   */
  title?: string;
}

export type NavigationChild = CommonNavigation & {
  /**
   * target is used for external links to determine how to open (new tab/window etc)
   */
  target?: string;
}

