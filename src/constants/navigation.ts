import type { NavItems } from "../types/navigation";

export const navItems: NavItems = [
  {
    id: 1,
    title: {
      ru: "Главная",
      en: "Home",
    },
    link: "/home",
  },
  {
    id: 2,
    title: {
      ru: "О проекте",
      en: "About",
    },
    link: "/about",
  },
  {
    id: 3,
    title: {
      ru: "Цены",
      en: "Pricing",
    },
    link: "/price",
  },
  // {
  //   id: 4,
  //   title: {
  //     ru: "Контакты",
  //     en: "Contact",
  //   },
  //   link: "/contact",
  // },
];
