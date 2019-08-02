import React, { memo } from "react";
import PropTypes from "prop-types";

function Layout(props) {
  return (
    <main>
      <header className="app__header">
        <div className="app__header--left">
          <img className="app__header__logo" src="./yc.png" alt="logo" />
          <div className="app__header__title">Hacker News Reader</div>
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
  ]).isRequired
};

export default memo(Layout);
