export interface NavItemTitle {
  ru: string;
  en: string;
}

export interface NavItem {
  id: number;
  title: NavItemTitle;
  link: string;
}

export type NavItems = NavItem[];
