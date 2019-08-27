import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

import useNetworkStatus from './use-network-status';
import {
  InfiniteScroll,
  EmptyView,
  Layout,
  Loader,
  Story
} from './components/index';
import styles from './app.module.css';

const ITEMS_PER_PAGE = 10;
const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const ROW_HEIGHT = 58;
const HEADER_HEIGHT = 44;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [allStories, setAllStories] = useState([]);
  const [nextStory, setNextStory] = useState(0);
  const { isOnline } = useNetworkStatus();

  /**
   * Fetch the next story from the list of stories.
   */
  const handleLoadStory = useCallback(() => {
    console.log('handle load story');
    setNextStory(prev => prev + 1);
  }, []);

  /**
   * Fetch a batch of stories from the the Hacker News API.
   */
  const handleLoadNextBatch = () => {
    setNextStory(prev => {
      const nextBatchSize = prev + ITEMS_PER_PAGE;
      const limit =
        nextBatchSize > allStories.length ? allStories.length : nextBatchSize;

      return limit;
    });
  };

  const handleResize = useCallback(
    debounce(() => {
      const items = Math.ceil(
        (window.innerHeight - HEADER_HEIGHT) / ROW_HEIGHT
      );
      const diff = items - nextStory;

      if (diff > 0) {
        setNextStory(prev => prev + diff);
      }
    }, 300),
    [nextStory]
  );

  // Subscribe to resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Initial load for all the stories
  useEffect(() => {
    const loadAllStories = async () => {
      try {
        const resp = await axios.get(`${BASE_URL}/newstories.json`);
        const fillScreen = Math.ceil(
          (window.innerHeight - HEADER_HEIGHT) / ROW_HEIGHT
        );

        setIsLoading(false);
        setAllStories(resp.data || []);
        setNextStory(fillScreen);
      } catch (error) {
        setIsLoading(false);
        setAllStories([]);
        setHasError(true);

        console.log('Error while loading data from newstories', error);
      }
    };

    loadAllStories();
  }, []);

  return (
    <Layout isOnline={isOnline}>
      {isLoading ? (
        <section className={styles.container} data-testid="loading">
          <Loader size="large" />
        </section>
      ) : allStories.length === 0 && !hasError ? (
        <section className={styles.container} data-testid="empty">
          <EmptyView title="No stories to show at this moment." />
        </section>
      ) : !isLoading && hasError ? (
        <section className={styles.container} data-testid="error">
          <EmptyView
            title="An error occurred while loading your data."
            subtitle="Click here to refresh."
            url="/"
          />
        </section>
      ) : (
        <section data-testid="resolved">
          <InfiniteScroll
            onLoadNext={handleLoadNextBatch}
            hasMore={allStories.length > nextStory}
            isOnline={isOnline}
          >
            {allStories.slice(0, nextStory).map((id, index) => (
              <Story key={`story-${index}`} id={id} />
            ))}
          </InfiniteScroll>
        </section>
      )}
    </Layout>
  );
}

export default App;
