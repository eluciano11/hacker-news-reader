import React, { memo } from "react";
import PropTypes from "prop-types";

function Loader(props) {
  return (
    <div
      className={`app__loader app__loader--${
        props.size === "large" ? "large" : "small"
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
