import React, { Component } from "react";
import axios from "axios";

import { formatDate, convertUnixTimestamp } from "./utils";
import withNetworkStatus from "./with-network-status";
import InfiniteScroll from "./infinite-scroll";
import EmptyView from "./empty-view";
import Layout from "./layout";
import Loader from "./loader";
import Story from "./story";
import "./App.css";

const ITEMS_PER_PAGE = 10;
const BASE_URL = "https://hacker-news.firebaseio.com/v0";

class App extends Component {
  state = {
    isLoading: true,
    hasError: false,
    stories: [],
    allStories: []
  };

  nextStory = 0;

  async componentDidMount() {
    try {
      const resp = await axios.get(`${BASE_URL}/newstories.json`);

      this.setState({ isLoading: false, allStories: resp.data });
    } catch (error) {
      this.setState({ isLoading: false, allStories: [], hasError: true });

      console.log("Error while loading data from newstories", error);
    }
  }

  /**
   * Fetch the data for the provided id, verify that the item received is a story and
   * update the list of stories.
   *
   * @param {number} id - Identity of the story to be loaded.
   */
  handleLoadStoryById = async id => {
    this.nextStory = this.nextStory + 1;

    try {
      const story = await axios.get(`${BASE_URL}/item/${id}.json`);
      const stories =
        story.data.type === "story"
          ? [...this.state.stories, story.data]
          : this.state.stories;

      this.setState({
        stories
      });
    } catch (error) {
      console.log(`Error while loading individual story ${id}`, error);
    }
  };

  /**
   * Fetch the next story from the list of stories.
   */
  handleLoadStory = async () => {
    const { allStories } = this.state;

    await this.handleLoadStoryById(allStories[this.nextStory]);
  };

  /**
   * Fetch a batch of stories from the the Hacker News API.
   */
  handleLoadNextBatch = async () => {
    const { allStories } = this.state;
    const nextBatchSize = this.nextStory + ITEMS_PER_PAGE;
    const limit =
      nextBatchSize > allStories.length ? allStories.length : nextBatchSize;

    for (let index = this.nextStory; index < limit; index++) {
      await this.handleLoadStoryById(allStories[index]);
    }
  };

  render() {
    const { isLoading, stories, allStories, hasError } = this.state;
    const { isOnline } = this.props;

    return (
      <Layout isOnline={isOnline}>
        {isLoading ? (
          <div className="app__stories__container">
            <Loader size="large" />
          </div>
        ) : !isLoading && allStories.length === 0 && !hasError ? (
          <div className="app__stories__container">
            <EmptyView title="No stories to show at this moment." />
          </div>
        ) : !isLoading && hasError ? (
          <div className="app__stories__container">
            <EmptyView
              title="An error occurred while loading your data."
              subtitle="Click here to refresh."
              url="/"
            />
          </div>
        ) : (
          <InfiniteScroll
            onLoadItem={this.handleLoadStory}
            onLoadNext={this.handleLoadNextBatch}
            hasMore={allStories.length !== stories.length}
          >
            {stories.map(story => (
              <Story
                key={story.id}
                title={story.title}
                author={story.by}
                date={formatDate(new Date(convertUnixTimestamp(story.time)))}
                url={story.url}
              />
            ))}
          </InfiniteScroll>
        )}
      </Layout>
    );
  }
}

export default withNetworkStatus(App);
