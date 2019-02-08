import React, { Component } from "react";
import { Container, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import english from "javascript-time-ago/locale/en"
import { API } from "aws-amplify";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo('en-US');

    this.state = {
      isLoading: true,
      posts: []
    };
  }

  async componentDidMount() {
    try {
      const posts = await this.posts();
      this.setState({ posts });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }

  posts() {
    return API.get("posts", "/posts");
  }

  renderPostsList(posts) {
    return [].concat(posts).map(
      (post, i) =>
        <Container key={post.postId}>
          <Card>
            <Card.Body>
              <Card.Title>
                <LinkContainer
                  to={`/posts/${post.postId}`}
                >
                  <a href="#"><b>{"Post " + (i+1)}</b></a>
                </LinkContainer>
              </Card.Title>
              <Card.Text>
                {post.content}
              </Card.Text>
              <small className="text-muted">
                {this.timeAgo.format(new Date(post.createdAt), english.long)}
              </small>
            </Card.Body>
          </Card>
          <br />
        </Container>
    );
  }

  renderPosts() {
    return (
      <div className="posts">
        {!this.state.isLoading && this.renderPostsList(this.state.posts)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>AmitSN</h1>
          <p>Random console logs</p>
        </div>
        { this.renderPosts() }
      </div>
    );
  }
}