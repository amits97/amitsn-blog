import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import "./Sidebar.css";

export default class Sidebar extends Component {
  renderPostList = (posts) => {
    return [].concat(posts).map(
      (post, i) =>
        <LinkContainer exact to={`/posts/${post.postId}`} key={i}>
          <a href="#/">
            { post.title }
          </a>
        </LinkContainer>
    );
  }

  renderSidebarList = () => {
    if(this.props.posts.length > 0) {
      return (
        <nav>
          <h5>LATEST POSTS</h5>
          {this.renderPostList(this.props.posts)}
        </nav>
      );
    }
  }

  render() {
    return (
      <div className="Sidebar bg-light">
          <div className="sidebar-content p-5">
            {this.renderSidebarList()}
          </div>
      </div>
    );
  }
}