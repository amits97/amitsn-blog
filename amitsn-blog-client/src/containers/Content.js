import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import english from "javascript-time-ago/locale/en"
import Skeleton from "react-loading-skeleton";
import Sidebar from "./Sidebar";
import "./Content.css";

export default class Content extends Component {
  constructor(props) {
    super(props);

    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo('en-US');
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.activePost.postId !== this.props.activePost.postId) {
      window.scrollTo(0, 0);
    }
  }

  postMeta(activePost = {}) {
    if(this.props.isHomePage) {
      return(
        <div className="welcome">
          <h2>
            { activePost.content ? "Random console logs" : <Skeleton /> }
          </h2>
          <hr />
        </div>
      );
    }

    return(
      <div>
        <h1>{activePost.title || <Skeleton />}</h1>
        <small className="text-muted">
          { activePost.createdAt ? `Posted ${this.timeAgo.format(new Date(activePost.createdAt), english.long)}` : <Skeleton /> }
        </small>
        <br />
        <hr />
      </div>
    );
  }

  renderPost() {
    let { posts, isLoading, activePost = {} } = this.props;

    if(!isLoading) {
      if(posts.length === 0) {
        return(
          <h3>No posts!</h3>
        );
      }

      if(!activePost.postId) {
        return(
          <h3>Page not found!</h3>
        );       
      }
    }

    return(
      <div>
        { this.postMeta(activePost) }
        { activePost.content ? <ReactMarkdown source={activePost.content} /> : <Skeleton count={15} /> }
      </div>
    );
  }

  render() {
    return (
      <div className="Content">
        <Row>
          <Col sm={8}>
            { this.renderPost() }
          </Col>
          <Col sm={4}>
            <Sidebar posts={this.props.posts} />
          </Col>
        </Row>
      </div>
    );
  }
}