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

      if(this.props.match.params.id && !this.props.isPage) {
        post = posts.filter(singlePost => singlePost.postId === this.props.match.params.id )[0];
      } else {
        if(this.props.isPage) {
          try {
            const page = await this.page();
            post = page;
          } catch (e) {
            console.log(e);
          }

          if(this.props.match.params.id === "home") {
            this.props.history.push("/");
          }
        } else {
          post = posts[0];
          this.props.history.push(`/blog/${post.postId}`);
        }
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

  async componentDidUpdate(prevProps) {
    let { posts } = this.state;
    let post;

    if(this.props.match.params.id !== prevProps.match.params.id) {
      if(this.props.match.params.id) {
        post = posts.filter(singlePost => singlePost.postId === this.props.match.params.id )[0];
      } else if(this.props.isPage) {
        this.setState({
          isLoading: true,
          activePost: {}
        });
        post = await this.page();
      } else {
        post = posts[0];
        this.props.history.push(`/blog/${post.postId}`);
      }

      this.setState({
        isLoading: false,
        activePost: post
      });
    } else if(prevProps.isPage && !this.props.isPage) {
      console.log("hi");
      //User moving from a page to blog
      post = posts[0];
      this.props.history.push(`/blog/${post.postId}`);

      this.setState({
        activePost: post
      });
    }
  }

  posts() {
    return API.get("posts", "/posts");
  }

  page() {
    let pageId = this.props.match.params.id;

    if(pageId) {
      return API.get("posts", `/posts/${this.props.match.params.id}`);
    } else {
      //Load home page if no page ID present
      return API.get("posts", `/posts/home`);
    }
  }

  render() {
    let { posts, isLoading, activePost } = this.state;
    let { isPage } = this.props;

    return (
      <Content posts={posts} isLoading={isLoading} activePost={activePost} isPage={isPage} />
    );
  }
}