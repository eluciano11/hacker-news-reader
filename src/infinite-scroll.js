import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";

import Loader from "./loader";

const THROTTLE_TIMER = 1000;
const FILL_PERCENT = 1.2;
const SCROLL_PERCENT = 0.7;

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

  handleResize = debounce(this.fillScreen, 500);

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
          className="app__infinite-scroll"
          ref={this.setRef}
          onScroll={this.throttleScroll}
        >
          {children}
        </ul>
        {isLoading && (
          <div className="app__infinite-scroll__footer__container">
            <div className="app__infinite-scroll__footer__container__loader">
              <Loader />
            </div>
          </div>
        )}
        {!hasMore && (
          <div className="app__infinite-scroll__footer__container">
            No more stories to load
          </div>
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
  onLoadItem: PropTypes.func.isRequired,
  onLoadNext: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  fillPercent: PropTypes.number,
  scrollPercent: PropTypes.number,
  throttleTimer: PropTypes.number
};

InfiniteScroll.defaultProps = {
  fillPercent: FILL_PERCENT,
  scrollPercent: SCROLL_PERCENT,
  throttleTimer: THROTTLE_TIMER,
  hasMore: false
};

export default InfiniteScroll;
