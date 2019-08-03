import React, { Component } from "react";
import axios from "axios";

import InfiniteScroll from "./infinite-scroll";
import Layout from "./layout";
import Loader from "./loader";
import withNetworkStatus from "./with-network-status";
import { formatDate } from "./utils";
import Story from "./story";
import "./App.css";

const ITEMS_PER_PAGE = 10;
const BASE_URL = "https://hacker-news.firebaseio.com/v0";

class App extends Component {
  state = {
    isLoading: true,
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
      console.log(error);
    }
  };

  async componentDidMount() {
    try {
      const resp = await axios.get(`${BASE_URL}/newstories.json`);

      this.setState({ isLoading: false, allStories: resp.data });
    } catch (error) {
      console.log("error", error);
    }
  }

  handleLoadStory = async () => {
    try {
      const { allStories, nextStory } = this.state;

      await this.handleLoadStoryById(allStories[nextStory]);
    } catch (error) {
      console.log("Error", error);
    }
  };

  handleLoadNextBatch = async () => {
    try {
      const { nextStory, allStories } = this.state;
      const nextBatch = nextStory + ITEMS_PER_PAGE;
      const limit =
        nextBatch > allStories.length ? allStories.length : nextBatch;

      for (let index = nextStory; index < limit; index++) {
        await this.handleLoadStoryById(allStories[index]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  render() {
    const { isLoading, stories, allStories } = this.state;
    const { isOnline } = this.props;

    return (
      <Layout isOnline={isOnline}>
        {isLoading ? (
          <div className="app__stories__container__loader">
            <Loader size="large" />
          </div>
        ) : (
          <section className="app__stories__container">
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
          </section>
        )}
      </Layout>
    );
  }
}

export default withNetworkStatus(App);
