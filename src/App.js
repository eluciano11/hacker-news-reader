import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

import { formatDate, convertToMilliseconds } from './utils/index';
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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [stories, setStories] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const { isOnline } = useNetworkStatus();
  const nextStory = useRef(0);

  /**
   * Fetch the data for the provided id, verify that the item received is a story and
   * update the list of stories.
   *
   * @param {number} id - Identity of the story to be loaded.
   */
  const handleLoadStoryById = useCallback(id => {
    const loadStoryById = async id => {
      nextStory.current = nextStory.current + 1;

      try {
        const story = await axios.get(`${BASE_URL}/item/${id}.json`);

        setStories(prevStories => {
          return story.data.type === 'story'
            ? [...prevStories, story.data]
            : prevStories;
        });
      } catch (error) {
        console.log(`Error while loading individual story ${id}`, error);
      }
    };

    return loadStoryById(id);
  }, []);
  /**
   * Fetch the next story from the list of stories.
   */
  const handleLoadStory = useCallback(async () => {
    await handleLoadStoryById(allStories[nextStory.current]);
  }, [allStories, handleLoadStoryById]);

  /**
   * Fetch a batch of stories from the the Hacker News API.
   */
  const handleLoadNextBatch = () => {
    setLoadMore(true);
  };

  // Initial load for all the stories
  useEffect(() => {
    const loadAllStories = async () => {
      try {
        const resp = await axios.get(`${BASE_URL}/newstories.json`);

        setIsLoading(false);
        setAllStories(resp.data || []);
      } catch (error) {
        setIsLoading(false);
        setAllStories([]);
        setHasError(true);

        console.log('Error while loading data from newstories', error);
      }
    };

    loadAllStories();
  }, []);

  // Load a new subset of the stories.
  useEffect(() => {
    if (loadMore) {
      const nextBatchSize = nextStory.current + ITEMS_PER_PAGE;
      const limit =
        nextBatchSize > allStories.length ? allStories.length : nextBatchSize;
      const handleLoadMore = async () => {
        for (let index = nextStory.current; index < limit; index++) {
          await handleLoadStoryById(allStories[index]);
        }

        setLoadMore(false);
      };

      handleLoadMore();
    }
  }, [allStories, handleLoadStoryById, loadMore]);

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
            onLoadItem={handleLoadStory}
            onLoadNext={handleLoadNextBatch}
            hasMore={allStories.length !== stories.length}
            isOnline={isOnline}
            isLoading={loadMore}
          >
            {stories.map((story, index) => (
              <Story
                key={`story-${index}`}
                title={story.title}
                author={story.by}
                date={formatDate(new Date(convertToMilliseconds(story.time)))}
                url={story.url}
              />
            ))}
          </InfiniteScroll>
        </section>
      )}
    </Layout>
  );
}

export default App;
