import React, { memo } from "react";
import PropTypes from "prop-types";

function Story({ title, author, date, url }) {
  return (
    <li className="app__stories__story text--ellipsis">
      <a
        className="app__stories__story__link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
      <p className="app__stories__story__author">
        {author} | <time className="app__stories__story__author">{date}</time>
      </p>
    </li>
  );
}

Story.propTypes = {
  title: PropTypes.string,
  author: PropTypes.string,
  url: PropTypes.string,
  date: PropTypes.string
};

Story.defaultProps = {
  title: "",
  author: "",
  url: "",
  date: ""
};

export default memo(Story);
