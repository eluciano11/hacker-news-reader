import React, { memo, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

import styles from './infinite-scroll.module.css';
import { Loader } from '../loader/index';

const THROTTLE_TIMER = 1000;
const FILL_PERCENT = 1.2;
const SCROLL_PERCENT = 0.75;

/**
 * This component will handle the infinite scroll functionality. It's also
 * responsible for fetching data from the API until the screen height is covered
 * with data. This component will try to fill the screen with data on the initial
 * render and on any window resize.
 */

function InfiniteScroll(props) {
  const {
    fillPercent,
    onLoadItem,
    isOnline,
    scrollTriggerDelay,
    scrollPercent,
    onLoadNext,
    hasMore,
    isLoading,
    children
  } = props;
  const node = useRef(null);
  const lastScroll = useRef(0);
  const handleFillScreen = useCallback(() => {
    const fillScreen = async () => {
      const scrollHeight = node.current.scrollHeight;
      const windowHeight = window.innerHeight;
      const filledPercent = scrollHeight / windowHeight;

      if (filledPercent >= fillPercent) {
        return;
      }

      await onLoadItem();
      fillScreen();
    };

    return fillScreen();
  }, [fillPercent, onLoadItem]);
  const handleScroll = useCallback(
    throttle(async () => {
      const scrollTop = node.current.scrollTop;
      const isScrollingDown = scrollTop > lastScroll.current;

      if (hasMore && isScrollingDown && !isLoading) {
        lastScroll.current = scrollTop;
        const clientHeight = node.current.getBoundingClientRect().height;
        const scrollHeight = node.current.scrollHeight;
        const percentTrigger = (scrollTop + clientHeight) / scrollHeight;

        if (percentTrigger > scrollPercent) {
          await onLoadNext();
        }
      }
    }, scrollTriggerDelay),
    [scrollTriggerDelay, isLoading, scrollPercent, onLoadNext, hasMore]
  );

  useEffect(() => {
    const handleResize = debounce(handleFillScreen, 500);

    window.addEventListener('resize', handleResize);
    handleFillScreen();

    return () => window.removeEventListener('resize', handleResize);
  }, [handleFillScreen]);

  useEffect(() => {
    lastScroll.current = 0;
  }, [isOnline]);

  return (
    <>
      <ul className={styles.infiniteScroll} ref={node} onScroll={handleScroll}>
        {children}
        {!hasMore && (
          <li className={styles.container}>No more stories to load</li>
        )}
        {!isOnline && (
          <li className={styles.container}>
            Looks like you lost your connection. Please check it and try again.
          </li>
        )}
      </ul>
      {isLoading && (
        <div className={styles.container}>
          <div className={styles.loader}>
            <Loader />
          </div>
        </div>
      )}
    </>
  );
}

InfiniteScroll.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  // Function to load a single item.
  onLoadItem: PropTypes.func.isRequired,
  // Function to load a batch of items.
  onLoadNext: PropTypes.func.isRequired,
  // Flag to know if we can fetch more data.
  hasMore: PropTypes.bool,
  // Percent of the screen that wants to be filled with data.
  fillPercent: PropTypes.number,
  // Scrolling percentage that will trigger a batch load.
  scrollPercent: PropTypes.number,
  // Delay that will be used on the scroll event.
  scrollTriggerDelay: PropTypes.number
};

InfiniteScroll.defaultProps = {
  fillPercent: FILL_PERCENT,
  scrollPercent: SCROLL_PERCENT,
  scrollTriggerDelay: THROTTLE_TIMER,
  hasMore: false
};

export default memo(InfiniteScroll);
