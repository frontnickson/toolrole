import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../../components/ui/Button/Button";
import { navItems } from "../../../../constants/navigation";
import type { NavItem } from "../../../../types/navigation";
import LandingMobileMenu from "./LandingMobileMenu";

import styles from "./LandingHeader.module.scss";

const LandingHeader: React.FC = () => {

  const [openBurger, setOpenBurger] = useState(false)

  const handleBurgerMenu = () => {
    if (!openBurger) setOpenBurger(true)
    else setOpenBurger(false)
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleNavClick = (item: NavItem) => {
    let sectionId = '';
    
    switch (item.title.ru) {
      case 'Главная':
        sectionId = 'main';
        break;
      case 'О проекте':
        sectionId = 'about';
        break;
      case 'Цены':
        sectionId = 'price';
        break;
      case 'Контакты':
        sectionId = 'contact';
        break;
      default:
        return;
    }
    scrollToSection(sectionId);
  };

  return (
    <header className={styles.wrapper}>

      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <h2>Toolrole</h2>
        </Link>

        {/* menu */}
        <div className={styles.menu}>
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <ul key={item.id}>
                <li>
                  <p 
                    onClick={() => handleNavClick(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.title.ru}
                  </p>
                </li>
              </ul>
            ))}
          </nav>

          {/* buttons */}
          <div className={styles.buttons}>
            <Link to="/auth">
              <Button variant="outline" size="md">
                Регистрация
              </Button>
            </Link>

            <Link to="/auth">
              <Button variant="primary" size="md">
                Начать бесплатно
              </Button>
            </Link>
          </div>

          {/* Burger menu */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 22 16"
            color="colorInherit"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.burger}
            onClick={handleBurgerMenu}
          >
            <path
              d="M2 2H20M2 8H20M2 14H20"
              stroke="black"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        {/* Mobile menu */}
        <LandingMobileMenu isOpen={openBurger} onClose={handleBurgerMenu} />
      </div>
    </header>
  );
};

export default LandingHeader;
