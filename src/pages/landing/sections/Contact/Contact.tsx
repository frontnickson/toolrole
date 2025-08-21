import React from "react";
import styles from "./Contact.module.scss";

const Contact: React.FC = () => {
  return (
    <section className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2>Свяжитесь с нами</h2>
          <p>Готовы начать? Свяжитесь с нашей командой для получения дополнительной информации.</p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <h3>Email</h3>
              <p>info@toolrole.com</p>
            </div>
            <div className={styles.contactItem}>
              <h3>Телефон</h3>
              <p>+7 (999) 123-45-67</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
