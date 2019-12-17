import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTimes } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import "./Sidebar.css";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileSidebarOpened: false
    };
  }

  UNSAFE_componentDidUpdate() {
    if(this.state.mobileSidebarOpened) {
      this.handleMobileSidebarClick();
    }
  }

  handleMobileSidebarClick = () => {
    this.setState({
      mobileSidebarOpened: !this.state.mobileSidebarOpened
    });
  }

  renderPostList = (posts) => {
    return [].concat(posts).slice(0, 6).map(
      (post, i) =>
        <LinkContainer exact to={`/blog/${post.postId}`} key={i}>
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
          <LinkContainer exact to="/blog/all">
            <a href="#/">All Posts ...</a>
          </LinkContainer>
        </nav>
      );
    } else {
      return (
        <nav>
          <h5><Skeleton /></h5>
          <br />
          <Skeleton count={10} />
        </nav>
      );
    }
  }

  render() {
    let { mobileSidebarOpened } = this.state;

    return (
      <div className="Sidebar">
        <div className={`sidebar bg-light border-left ${mobileSidebarOpened ? 'opened' : ''}`}>
          <div className="sidebar-content p-5">
            {this.renderSidebarList()}
          </div>
        </div>
        <div className="sidebar-button btn btn-primary" onClick={this.handleMobileSidebarClick}>
          <FontAwesomeIcon icon={mobileSidebarOpened ? faTimes : faEllipsisV} />
        </div>
      </div>
    );
  }
}