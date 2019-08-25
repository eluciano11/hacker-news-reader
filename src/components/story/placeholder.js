import React, { memo } from 'react';
import random from 'lodash.random';

import storiesStyles from './story.module.css';
import styles from './placeholder.module.css';

function Placeholder() {
  return (
    <li className={`${storiesStyles.story} app__text--ellipsis`}>
      <div
        className={styles.title}
        style={{ width: random(350, 600, false) }}
      ></div>
      <div className={styles.authorContainer}>
        <div
          className={styles.author}
          style={{ width: random(60, 120, false) }}
        ></div>
        <div className={styles.separator}>|</div>
        <div className={styles.date}></div>
      </div>
    </li>
  );
}

export default memo(Placeholder);
