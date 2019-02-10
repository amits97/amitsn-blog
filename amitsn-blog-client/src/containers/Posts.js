import React, { Component } from "react";
import { Card } from "react-bootstrap";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import english from "javascript-time-ago/locale/en"
import { API } from "aws-amplify";
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
    if(this.state.post) {
      return(
        <Card>
          <Card.Body>
            <Card.Title>
              <h3>{this.state.post.title}</h3>
            </Card.Title>
            <Card.Text>
              {this.state.post.content}
            </Card.Text>
            <small className="text-muted">
              {this.timeAgo.format(new Date(this.state.post.createdAt), english.long)}
            </small>
          </Card.Body>
        </Card>
      );
    }
  }

  render() {
    return (
      <div className="Posts">
        { this.renderPost() }
      </div>
    );
  }
}