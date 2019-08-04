import React, { memo } from "react";
import PropTypes from "prop-types";

import styles from "./loader.module.css";

function Loader(props) {
  return (
    <div
      className={`${styles.loader} ${
        props.size === "large" ? styles.large : styles.small
      }`}
    />
  );
}

Loader.propTypes = {
  size: PropTypes.oneOf(["large", "small"]).isRequired
};

Loader.defaultProps = {
  size: "small"
};

export default memo(Loader);
