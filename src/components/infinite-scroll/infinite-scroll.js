import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";

import styles from "./infinite-scroll.module.css";
import { Loader } from "../loader/index";

const THROTTLE_TIMER = 1000;
const FILL_PERCENT = 1.2;
const SCROLL_PERCENT = 0.7;

/**
 * This component will handle the infinite scroll functionality. It's also
 * responsible for fetching data from the API until the screen height is covered
 * with data. This component will try to fill the screen with data on the initial
 * render and on any window resize.
 */

class InfiniteScroll extends PureComponent {
  constructor(props) {
    super(props);

    window.addEventListener("resize", this.handleResize);
    this.throttleScroll = throttle(this.handleScroll, this.props.throttleTimer);
  }

  state = {
    isLoading: false
  };
  node = null;
  lastScroll = 0;

  componentDidMount() {
    this.fillScreen(this.node);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  setRef = node => {
    if (node) {
      this.node = node;
    }
  };

  /**
   * Recursive function that will load a single story until the screen is filled
   * with data. The fill percent can be edited by changing the prop that's sent
   * to the component.
   */
  fillScreen = async () => {
    const container = this.node;
    const { fillPercent } = this.props;
    const scrollHeight = container.scrollHeight;
    const windowHeight = window.innerHeight;
    const filledPercent = scrollHeight / windowHeight;

    if (filledPercent >= fillPercent) {
      return;
    }

    const { onLoadItem } = this.props;

    await onLoadItem();
    this.fillScreen();
  };

  /**
   * Debounced callback to verify if the screen needs more data after a resize.
   * The debounce will make sure that the resize function is call 500ms after
   * the user has resized the window.
   */
  handleResize = debounce(this.fillScreen, 500);

  /**
   * Callback to verify if we need to load a batch of stories from the API.
   * We will load more data when:
   * 1. The user is scrolling down.
   * 2. While there's more data to load.
   * 3. While we are not loading data.
   * 4. The user has passed the percentage trigger. The percentage trigger can be edited via props.
   */
  handleScroll = async () => {
    const { isLoading } = this.state;
    const { onLoadNext, hasMore } = this.props;
    const scrollTop = this.node.scrollTop;
    const isScrollingDown = scrollTop > this.lastScroll;

    if (hasMore && isScrollingDown) {
      this.lastScroll = scrollTop;
      const clientHeight = this.node.getBoundingClientRect().height;
      const scrollHeight = this.node.scrollHeight;
      const percentTrigger = (scrollTop + clientHeight) / scrollHeight;
      const { scrollPercent } = this.props;

      if (percentTrigger > scrollPercent && !isLoading) {
        this.setState({ isLoading: true }, async () => {
          await onLoadNext();
          this.setState({ isLoading: false });
        });
      }
    }
  };

  render() {
    const { isLoading } = this.state;
    const { children, hasMore } = this.props;

    return (
      <>
        <ul
          className={styles.infiniteScroll}
          ref={this.setRef}
          onScroll={this.throttleScroll}
        >
          {children}
        </ul>
        {isLoading && (
          <div className={styles.container}>
            <div className={styles.loader}>
              <Loader />
            </div>
          </div>
        )}
        {!hasMore && (
          <div className={styles.container}>No more stories to load</div>
        )}
      </>
    );
  }
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
  throttleTimer: PropTypes.number
};

InfiniteScroll.defaultProps = {
  fillPercent: FILL_PERCENT,
  scrollPercent: SCROLL_PERCENT,
  throttleTimer: THROTTLE_TIMER,
  hasMore: false
};

export default InfiniteScroll;
