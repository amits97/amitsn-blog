import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import Skeleton from "react-loading-skeleton";
import { Helmet } from "react-helmet-async";
import Disqus from "disqus-react";
import CodeBlock from "../renderers/code-renderer";
import { LinkContainer } from "react-router-bootstrap";
import Sidebar from "./Sidebar";
import RemoveMarkdown from "remove-markdown";
import "./Content.css";

export default class Content extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activePost && this.props.activePost) {
      if (prevProps.activePost.postId !== this.props.activePost.postId) {
        window.scrollTo(0, 0);
      }
      if (this.props.allPosts && prevProps.allPosts !== true) {
        window.scrollTo(0, 0);
      }
    }
  }

  formatDate(date) {
    return <Moment format="MMMM D, YYYY">{date}</Moment>;
  }

  postMeta(activePost = {}) {
    if (activePost.postId === "home") {
      return (
        <div className="welcome">
          <h1>{activePost.title ? "Hi 👋" : <Skeleton />}</h1>
        </div>
      );
    } else if (this.props.isPage) {
      return (
        <div>
          <h1>{activePost.title || <Skeleton />}</h1>
          <hr />
        </div>
      );
    }

    return (
      <div>
        <h1>{activePost.title || <Skeleton />}</h1>
        <span>
          {activePost.createdAt ? (
            this.formatDate(activePost.createdAt)
          ) : (
            <Skeleton />
          )}
        </span>
        <br />
        <hr />
      </div>
    );
  }

  renderPost() {
    let { posts, isLoading, activePost = {} } = this.props;

    if (!isLoading) {
      if (posts.length === 0) {
        return (
          <div>
            <Helmet>
              <meta name="prerender-status-code" content="501" />
            </Helmet>
            <h3>No posts!</h3>
          </div>
        );
      }

      if (!activePost.postId) {
        return (
          <div>
            <Helmet>
              <meta name="prerender-status-code" content="501" />
            </Helmet>
            <h3>Page not found!</h3>
          </div>
        );
      }
    }

    //Disqus comments
    let disqusShortname = "amitsn";
    let disqusConfig = {
      url: `https://www.amitsn.com/blog/${activePost.postId}`,
      identifier: activePost.postId,
      title: activePost.title,
    };

    return (
      <div className="post-content">
        {this.postMeta(activePost)}
        {activePost.content ? (
          <ReactMarkdown components={{ code: CodeBlock }}>
            {activePost.content}
          </ReactMarkdown>
        ) : (
          <Skeleton count={15} />
        )}
        {this.props.isPage ? null : (
          <div>
            <hr />
            <Disqus.DiscussionEmbed
              shortname={disqusShortname}
              config={disqusConfig}
            />
          </div>
        )}
      </div>
    );
  }

  renderSEOTags() {
    let { activePost = {} } = this.props;

    if (activePost.postId) {
      if (activePost.title !== "Home") {
        let description = activePost.content.substring(0, 157).trim();
        description =
          description.substr(
            0,
            Math.min(description.length, description.lastIndexOf(" "))
          ) + "..";

        let imageURL = activePost.content.match(/!\[.*?\]\((.*?)\)/);
        imageURL = imageURL
          ? imageURL[1]
          : `${window.location.origin.toString()}/android-chrome-256x256.png`;

        return (
          <Helmet>
            <title>{activePost.title} | Amit S Namboothiry</title>
            <meta name="description" content={RemoveMarkdown(description)} />
            <meta name="twitter:card" content="summary" />
            <meta property="og:title" content={activePost.title} />
            <meta
              property="og:description"
              content={RemoveMarkdown(description)}
            />
            <meta property="og:image" content={imageURL} />
          </Helmet>
        );
      }
    }
  }

  renderAllPosts() {
    let { isLoading, posts } = this.props;

    if (isLoading) {
      return (
        <div>
          <h1>
            <Skeleton />
          </h1>
          <hr />
          <Skeleton count={10} />
        </div>
      );
    } else {
      return (
        <div>
          <h1>All Posts</h1>
          <hr />
          <Row>
            {[].concat(posts).map((post, i) => (
              <Col sm={4} key={i}>
                <div className="postCard">
                  <h5>
                    <LinkContainer exact to={`/blog/${post.postId}`} key={i}>
                      <a href="#/">{post.title}</a>
                    </LinkContainer>
                  </h5>
                  {this.formatDate(post.createdAt)}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      );
    }
  }

  render() {
    if (this.props.allPosts) {
      return <div className="Content">{this.renderAllPosts()}</div>;
    } else {
      return (
        <div className="Content">
          {this.renderSEOTags()}

          <Row>
            <Col sm={8}>{this.renderPost()}</Col>
            <Col sm={4}>
              <Sidebar posts={this.props.posts} />
            </Col>
          </Row>
        </div>
      );
    }
  }
}
