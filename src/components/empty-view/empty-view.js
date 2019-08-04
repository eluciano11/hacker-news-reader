import React from "react";
import PropTypes from "prop-types";

import styles from "./empty-view.module.css";

function EmptyView(props) {
  return (
    <div className="app__text--center">
      <span className={styles.emoji} role="img" aria-label="emoji">
        {props.emoji}
      </span>
      <h3 className={`${styles.title} app__text--center`}>{props.title}</h3>
      {props.subtitle && props.url && (
        <a className="app__link" href={props.url}>
          {props.subtitle}
        </a>
      )}
    </div>
  );
}

EmptyView.propTypes = {
  emoji: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  url: PropTypes.string
};

EmptyView.defaultProps = {
  emoji: "😔"
};

export default EmptyView;
