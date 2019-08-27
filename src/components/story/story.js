import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import styles from './story.module.css';
import Placeholder from './placeholder';
import { formatDate, convertToMilliseconds } from '../../utils';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

function Story({ id, addStory }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const loadStoryById = async id => {
      try {
        const story = await axios.get(`${BASE_URL}/item/${id}.json`);

        setData(story.data);
        setIsLoading(false);
      } catch (error) {
        console.log(`Error while loading individual story ${id}`, error);
      }
    };

    loadStoryById(id);
  }, [addStory, id]);

  if (!isLoading) {
    const { title, by, time, url } = data;
    const formattedDate = formatDate(new Date(convertToMilliseconds(time)));

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
          {by} | <time className={styles.author}>{formattedDate}</time>
        </p>
      </li>
    );
  }

  return <Placeholder />;
}

Story.propTypes = {
  title: PropTypes.string,
  author: PropTypes.string,
  url: PropTypes.string,
  date: PropTypes.string
};

Story.defaultProps = {
  title: '',
  author: '',
  url: '/',
  date: ''
};

export default memo(Story);
