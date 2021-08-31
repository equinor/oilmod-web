type CommonNavigation = {
  /**
   * label is the displayed text to the user
   */
  label: string;
  /**
   * disabled determines if the link should be disabled or not.
   */
  disabled?: boolean;
}

export type Navigation = CommonNavigation & {
  /**
   * icon is used in the collapsed view. Required for top-level
   */
  icon: string;
  /**
   * chldren is a list of {@link NavigationChild} used to show collapse / expand icons or build a menu
   */
  children: Array<NavigationChild>;
}

export type NavigationChild = CommonNavigation & {
  /**
   * route is used for internal routing in the same application
   */
  route?: Array<string | number>;
  /**
   * link is used for external links to different applications (reports or other micro-frontends)
   */
  link?: string;
  /**
   * target is used for external links to determine how to open (new tab/window etc)
   */
  target?: string;
}

