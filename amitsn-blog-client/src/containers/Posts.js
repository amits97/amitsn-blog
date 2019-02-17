import React, { Component } from "react";
import { API } from "aws-amplify";
import Content from "./Content";

export default class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      activePost: {},
      isLoading: true
    };
  }

  async componentDidMount() {
    try {
      const posts = await this.posts();
      let post = {};

      if(this.props.match.params.id) {
        post = posts.filter(singlePost => singlePost.postId === this.props.match.params.id )[0];
      } else {
        post = posts[0];
        this.props.history.push(`/blog/${post.postId}`);
      }

      this.setState({
        posts: posts,
        activePost: post,
        isLoading: false
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidUpdate(prevProps) {
    let { posts } = this.state;

    if(this.props.match.params.id) {
      if(this.props.match.params.id !== prevProps.match.params.id) {
        let post = posts.filter(singlePost => singlePost.postId === this.props.match.params.id )[0];

        this.setState({
          activePost: post
        });
      }
    }
  }

  posts() {
    return API.get("posts", "/posts");
  }

  render() {
    let { posts, isLoading, activePost } = this.state;

    return (
      <Content posts={posts} isLoading={isLoading} activePost={activePost} />
    );
  }
}