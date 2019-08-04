import React, { memo } from "react";
import PropTypes from "prop-types";

import styles from "./story.module.css";

function Story({ title, author, date, url }) {
  return (
    <li className={`${styles.story} app__text--ellipsis`}>
      <a
        className="app__link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
      <p className={styles.author}>
        {author} | <time className={styles.author}>{date}</time>
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
  url: "/",
  date: ""
};

export default memo(Story);
