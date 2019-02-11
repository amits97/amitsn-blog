import React, { Component } from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import english from "javascript-time-ago/locale/en"
import { API } from "aws-amplify";
import Sidebar from "./Sidebar";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo('en-US');

    this.state = {
      isLoading: true,
      posts: []
    };
  }

  async componentDidMount() {
    try {
      const posts = await this.posts();
      this.setState({ posts });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }

  posts() {
    return API.get("posts", "/posts");
  }

  renderPostsList(posts) {
    return [].concat(posts).map(
      (post, i) =>
        <div key={post.postId}>
          <h1>{post.title}</h1>
          <small className="text-muted">
            {this.timeAgo.format(new Date(post.createdAt), english.long)}
          </small>
          <br />
          <hr />
          <p>
            {post.content}
          </p>
        </div>
    );
  }

  renderPosts() {
    return (
      <div className="posts mr-4">
        {!this.state.isLoading && this.renderPostsList(this.state.posts[0])}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <Row>
          <Col sm={8}>
            { this.renderPosts() }
          </Col>
          <Col sm={4}>
            <Sidebar posts={this.state.posts} />
          </Col>
        </Row>
      </div>
    );
  }
}