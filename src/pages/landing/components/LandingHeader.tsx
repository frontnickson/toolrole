import React, { useState } from "react";
import Button from "../../../components/ui/Button/Button";
import { navItems } from "../../../constants/navigation";
import LandingMobileMenu from "./LandingMobileMenu";



import styles from "./LandingHeader.module.scss";

const LandingHeader: React.FC = () => {

  const [openBurger, setOpenBurger] = useState(false)

  const handleBurgerMenu = () => {
    if (!openBurger) setOpenBurger(true)
    else setOpenBurger(false)
  };

  return (
    <header className={styles.wrapper}>

      <div className={styles.container}>
        {/* Logo */}
        <h2>Toolrole</h2>

        {/* menu */}
        <div className={styles.menu}>
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <ul key={item.id}>
                <li>
                  <p>{item.title.ru}</p>
                </li>
              </ul>
            ))}
          </nav>

          {/* buttons */}
          <div className={styles.buttons}>
            <Button variant="secondary" size="md">
              Регистрация
            </Button>

            <Button variant="primary" size="md">
              Начать бесплатно
            </Button>
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
