import React, { Component } from "react";
import API from "aws-amplify";

export default class Posts extends Component {
  constructor(props) {
    super(props);

    this.file = null;

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

  render() {
    return <div className="Posts"></div>;
  }
}