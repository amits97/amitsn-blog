import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import english from "javascript-time-ago/locale/en"
import { API } from "aws-amplify";
import Sidebar from "./Sidebar";
import "./Posts.css";

export default class Posts extends Component {
  constructor(props) {
    super(props);

    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo('en-US');

    this.state = {
      posts: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    try {
      const posts = await this.posts();
      this.setState({
        posts: posts,
        isLoading: false
      });
    } catch (e) {
      alert(e);
    }
  }

  posts() {
    return API.get("posts", "/posts");
  }

  renderPost() {
    let { posts } = this.state;

    if(!this.state.isLoading) {
      if(posts.length === 0) {
        return(
          <h3>No posts!</h3>
        )        
      }

      let post;

      if(this.props.match.params.id) {
        post = posts.filter(singlePost => singlePost.postId === this.props.match.params.id )[0];
      } else {
        post = posts[0];
        this.props.history.push(`/posts/${post.postId}`);
      }

      if(post) {
        return(
          <div>
            <h1>{post.title}</h1>
            <small className="text-muted">
              Posted {this.timeAgo.format(new Date(post.createdAt), english.long)}
            </small>
            <br />
            <hr />
            <ReactMarkdown source={post.content} />
          </div>
        );
      } else {
        return(
          <h3>Post not found!</h3>
        )
      }
    }
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="Posts">
        <Row>
          <Col sm={8}>
            { this.renderPost() }
          </Col>
          <Col sm={4}>
            <Sidebar posts={this.state.posts} />
          </Col>
        </Row>
      </div>
    );
  }
}