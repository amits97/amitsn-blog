import React, { Component } from "react";
import { API } from "aws-amplify";
import { Button, ListGroup, Tabs, Tab, Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
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
    window.scrollTo(0, 0);

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
              return (
                <ListGroup.Item key={i}>
                  <LinkContainer exact to={`/admin/edit-post/${post.postId}`}>
                    <a href="#/" className="text-primary">{ post.title }</a>
                  </LinkContainer>
                </ListGroup.Item>
              );
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
        <div className="header border-bottom">
          <h3 className="float-left">Admin dashboard</h3>
          <LinkContainer exact to="/admin/new-post">
            <Button variant="primary" className="float-right"><span><FontAwesomeIcon icon={ faPlus } /></span>New Post</Button>
          </LinkContainer>
        </div>

        <Tab.Container defaultActiveKey="posts">
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="posts">Posts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="pages">Pages</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="posts">
                  { this.renderPosts() }
                </Tab.Pane>
                <Tab.Pane eventKey="pages">
                  <p>Nothing here now!</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}