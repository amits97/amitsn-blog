import React, { Component } from "react";
import { API } from "aws-amplify";
import { Button, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Skeleton from "react-loading-skeleton";
import "./Admin.css";

export default class Admin extends Component {
  constructor(props) {
    super(props);

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
      console.log(e);
    }
  }
  posts() {
    return API.get("posts", "/posts");
  }

  renderPosts() {
    let { isLoading, posts } = this.state;

    if(isLoading) {
      return (
        <Skeleton count={10}></Skeleton>
      );
    }

    if(posts.length > 0) {
      return (
        <ListGroup variant="flush">
          {
            posts.map((post, i) => {
              return <ListGroup.Item variant={`${i%2 == 0 ? "" : "light"}`}>{ post.title }</ListGroup.Item>
            })
          }
        </ListGroup>
      );
    } else {
      return (
        <p>No posts</p>
      );
    }
  }

  render() {
    return (
      <div className="Admin">
        <div className="header">
          <h3 className="float-left">Admin dashboard</h3>
          <LinkContainer exact to="/admin/new-post">
            <Button variant="primary" className="float-right">New Post</Button>
          </LinkContainer>
        </div>
        <hr />
        { this.renderPosts() }
      </div>
    );
  }
}