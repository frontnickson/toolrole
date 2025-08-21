import React from "react";
import { Link } from "react-router-dom";

import { navItems } from "../../../../constants/navigation";
import type { NavItem } from "../../../../types/navigation";
import Button from "../../../../components/ui/Button/Button";

import styles from "./LandingMobileMenu.module.scss";

interface LandingMobileMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

const LandingMobileMenu: React.FC<LandingMobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Закрываем мобильное меню после клика
    if (onClose) {
      onClose();
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
    <div className={styles.container}>

      {/* Navigation */}
      <div className={styles.navigation}>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <ul key={item.id}>
              <li>
                <h3 
                  onClick={() => handleNavClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.title.ru}
                </h3>
              </li>
            </ul>
          ))}
        </nav>

        {/* buttons */}
        <div className={styles.buttons}>
          <Link to="/auth" onClick={onClose}>
            <Button variant="secondary" size="md">
              Регистрация
            </Button>
          </Link>

          <Link to="/auth" onClick={onClose}>
            <Button variant="primary" size="md">
              Начать бесплатно
            </Button>
          </Link>
        </div>

        {/* Close svg */}
        <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.close} onClick={onClose}>
          <path d="M6.99999 7.70799L1.75399 12.954C1.66065 13.0473 1.54599 13.0973 1.40999 13.104C1.27399 13.1107 1.15265 13.0607 1.04599 12.954C0.93932 12.8473 0.885986 12.7293 0.885986 12.6C0.885986 12.4707 0.93932 12.3527 1.04599 12.246L6.29199 6.99999L1.04599 1.75399C0.952653 1.66065 0.902653 1.54599 0.895986 1.40999C0.889319 1.27399 0.93932 1.15265 1.04599 1.04599C1.15265 0.93932 1.27065 0.885986 1.39999 0.885986C1.52932 0.885986 1.64732 0.93932 1.75399 1.04599L6.99999 6.29199L12.246 1.04599C12.3393 0.952653 12.4543 0.902653 12.591 0.895986C12.7263 0.889319 12.8473 0.93932 12.954 1.04599C13.0607 1.15265 13.114 1.27065 13.114 1.39999C13.114 1.52932 13.0607 1.64732 12.954 1.75399L7.70799 6.99999L12.954 12.246C13.0473 12.3393 13.0973 12.4543 13.104 12.591C13.1107 12.7263 13.0607 12.8473 12.954 12.954C12.8473 13.0607 12.7293 13.114 12.6 13.114C12.4707 13.114 12.3527 13.0607 12.246 12.954L6.99999 7.70799Z" fill="black" />
        </svg>
      </div>

    </div>
  );
};

export default LandingMobileMenu;
