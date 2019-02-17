import React, { Component } from "react";
import { API } from "aws-amplify";
import Content from "./Content";

export default class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      page: {},
      isLoading: true
    };
  }

  async componentDidMount() {
    try {
      const page = await this.page();
      this.setState({
        page: page
      });
    } catch (e) {
      console.log(e);
      this.loadPosts();
    }

    this.loadPosts();
  }

  async loadPosts() {
    try {
      const posts = await this.posts();
      this.setState({
        posts: posts,
        isLoading: false
      });
    } catch (e) {
      console.log(e);

      this.setState({
        isLoading: false
      });     
    }
  }

  page() {
    if(this.props.id) {
      return API.get("posts", `/posts/home`);
    } else {
      return API.get("posts", `/posts/${this.props.match.params.id}`);
    }
  }

  posts() {
    return API.get("posts", "/posts");
  }

  render() {
    let { posts, isLoading, page } = this.state;
    let { isHomePage } = this.props;

    return (
      <Content posts={posts} isLoading={isLoading} activePost={page} isHomePage={isHomePage} />
    );
  }
}