import React, { Component } from "react";
import axios from "axios";

import InfiniteScroll from "./infinite-scroll";
import Layout from "./layout";
import Loader from "./loader";
import withNetworkStatus from "./with-network-status";
import EmptyView from "./empty-view";
import { formatDate } from "./utils";
import Story from "./story";
import "./App.css";

const ITEMS_PER_PAGE = 10;
const BASE_URL = "https://hacker-news.firebaseio.com/v0";

class App extends Component {
  state = {
    isLoading: true,
    hasError: false,
    nextStory: 0,
    stories: [],
    allStories: []
  };

  handleLoadStoryById = async id => {
    try {
      const story = await axios.get(`${BASE_URL}/item/${id}.json`);

      this.setState({
        nextStory: this.state.nextStory + 1,
        stories: [...this.state.stories, story.data]
      });
    } catch (error) {
      // When an error ocurrs on an indiviual request we must move to the next story.
      this.setState({
        nextStory: this.state.nextStory + 1
      });

      console.log(`Error while loading individual story ${id}`, error);
    }
  };

  async componentDidMount() {
    try {
      const resp = await axios.get(`${BASE_URL}/newstories.json`);

      this.setState({ isLoading: false, allStories: resp.data });
    } catch (error) {
      this.setState({ isLoading: false, allStories: [], hasError: true });

      console.log("Error while loading data from newstories", error);
    }
  }

  handleLoadStory = async () => {
    const { allStories, nextStory } = this.state;

    await this.handleLoadStoryById(allStories[nextStory]);
  };

  handleLoadNextBatch = async () => {
    const { nextStory, allStories } = this.state;
    const nextBatch = nextStory + ITEMS_PER_PAGE;
    const limit = nextBatch > allStories.length ? allStories.length : nextBatch;

    for (let index = nextStory; index < limit; index++) {
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
                date={formatDate(new Date(story.time * 1000))}
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
