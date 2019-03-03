import React, { Component } from "react";
import { API } from "aws-amplify";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
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

  render() {
    let { posts } = this.state;

    return (
      <div className="Admin">
        <div className="header">
          <h3 className="float-left">Admin dashboard</h3>
          <LinkContainer exact to="/admin/new-post">
            <Button variant="primary" className="float-right">New Post</Button>
          </LinkContainer>
        </div>
        <hr />
      </div>
    );
  }
}