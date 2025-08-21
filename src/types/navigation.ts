export interface NavItemTitle {
  ru: string;
  en: string;
}

export interface NavItem {
  id: number;
  title: NavItemTitle;
  link: string;
}

// тип для "/Frontend/src/pages/landing/sections/Features/"
export interface CardItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

// тип для "/Frontend/src/pages/landing/sections/AgentAI/"
export interface DescreptionItem {
  id: number;
  description: string;
}

export type NavItems = NavItem[];
