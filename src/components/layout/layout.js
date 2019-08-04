import React, { memo } from "react";
import PropTypes from "prop-types";

import styles from "./layout.module.css";

// Basic layout of the application.
function Layout(props) {
  return (
    <main>
      <header className={styles.header}>
        <div className={styles.container}>
          <img className={styles.logo} src="./yc.png" alt="logo" />
          <div className={styles.title}>Hacker News Reader</div>
        </div>
        <div className={styles.container}>
          <img
            className={styles.networkStateIcon}
            src={`./${!props.isOnline ? "no-" : ""}wifi.svg`}
            alt="wifi-icon"
          />
          <p className={styles.networkState}>
            {props.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </header>
      {props.children}
    </main>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  isOnline: PropTypes.bool.isRequired
};

export default memo(Layout);
