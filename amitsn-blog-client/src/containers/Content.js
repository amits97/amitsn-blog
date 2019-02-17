import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import english from "javascript-time-ago/locale/en"
import Skeleton from "react-loading-skeleton";
import { Helmet } from "react-helmet";
import Sidebar from "./Sidebar";
import "./Content.css";

export default class Content extends Component {
  constructor(props) {
    super(props);

    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo('en-US');

    this.removeMd = require("remove-markdown");
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.activePost && this.props.activePost) {
      if(prevProps.activePost.postId !== this.props.activePost.postId) {
        window.scrollTo(0, 0);
      }
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

  renderSEOTags() {
    let { activePost = {} } = this.props;

    if(activePost.postId) {
      if(activePost.title !== "Home") {
        let description = activePost.content.substring(0, 157).trim();
        description = description.substr(0, Math.min(description.length, description.lastIndexOf(" "))) + "..";

        let imageURL = activePost.content.match(/!\[.*?\]\((.*?)\)/);
        imageURL = imageURL ? imageURL[1] : `${window.location.origin.toString()}/android-chrome-256x256.png`;

        return(
          <Helmet>
            <title>Amit S Namboothiry | {activePost.title}</title>
            <meta name="description" content={this.removeMd(description)} />
            <meta property="og:description" content={this.removeMd(description)} />
            <meta property="og:image" content={imageURL} />
          </Helmet>
        );
      }
    }
  }

  render() {
    return (
      <div className="Content">
        { this.renderSEOTags() }

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