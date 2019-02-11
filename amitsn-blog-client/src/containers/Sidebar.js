import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileSidebarOpened: false
    };
  }

  componentWillUpdate() {
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
    let { mobileSidebarOpened } = this.state;

    return (
      <div className="Sidebar">
        <div className={`sidebar bg-light ${mobileSidebarOpened ? 'opened' : ''}`}>
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