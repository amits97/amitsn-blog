import React, { Component } from "react";
import { Card, Row, Col } from "react-bootstrap";
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
      post: null,
      content: ""
    };
  }

  async componentDidMount() {
    try {
      const post = await this.getPost();
      const { content } = post;

      this.setState({
        post,
        content
      });
    } catch (e) {
      alert(e);
    }
  }

  getPost() {
    return API.get("posts", `/posts/${this.props.match.params.id}`);
  }

  renderPost() {
    let {post} = this.state;
    if(post) {
      return(
        <div>
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
  }

  render() {
    return (
      <div className="Posts">
        <Row>
          <Col sm={8}>
            { this.renderPost() }
          </Col>
          <Col sm={4}>
            <Sidebar posts={this.state.post == null ? [] : this.state.post} />
          </Col>
        </Row>
      </div>
    );
  }
}