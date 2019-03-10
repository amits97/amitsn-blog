import React, { Component } from "react";
import { API } from "aws-amplify";
import { Button, ListGroup, Tab, Row, Col, Nav, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import LoaderButton from "../components/LoaderButton";
import "./Admin.css";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      pages: [],
      isLoading: true,
      activeTab: "posts",
      postsToBeDeleted: []
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    try {
      const posts = await this.posts();
      const pages = await this.pages();

      this.setState({
        posts: posts,
        pages: pages,
        isLoading: false
      });
    } catch (e) {
      console.log(e);
    }
  }

  posts() {
    return API.get("posts", "/posts");
  }

  pages() {
    return API.get("posts", "/posts?postType=PAGE");
  }

  addPostToDelete = (event, postId) => {
    let postsToBeDeleted = this.state.postsToBeDeleted;

    if(event.target.checked) {
      postsToBeDeleted.push(postId);
    } else {
      postsToBeDeleted = postsToBeDeleted.filter(function(post){
        return post !== postId;
      });
    }

    this.setState({
      postsToBeDeleted: postsToBeDeleted
    });
  }

  handleNewPostClick = () => {
    this.props.history.push("/admin/new-post");
  }

  validateDeletes() {
    return this.state.postsToBeDeleted.length > 0;
  }

  clearCheckboxes = () => {
    this.setState({
      postsToBeDeleted: []
    });
  }

  toggleCheckboxes = () => {
    if(this.validateDeletes()) {
      this.clearCheckboxes();
    } else {
      let posts = this.state[this.state.activeTab];
      let postsToBeDeleted = [];
      for(var i = 0; i < posts.length; i++) {
        postsToBeDeleted.push(posts[i].postId);
      }
      this.setState({
        postsToBeDeleted: postsToBeDeleted
      });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let { postsToBeDeleted } = this.state;

    if(window.confirm(`Are you sure you want to delete ${postsToBeDeleted.length} posts?`)) {
      this.setState({
        isLoading: true
      });
  
      try {
        for(var i = 0; i < postsToBeDeleted.length; i++) {
          await this.deletePost(postsToBeDeleted[i]);
        }
  
        this.setState({
          postsToBeDeleted: []
        });
  
        this.componentDidMount();
      } catch (e) {
        this.setState({
          isLoading: false
        });
  
        console.log(e);
      }
    }
  }

  deletePost(postId) {
    return API.del("posts", `/posts/${postId}`);
  }

  setActiveTab = (tab) => {
    this.setState({
      activeTab: tab
    });
  }

  renderPosts(posts) {
    let { isLoading } = this.state;

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
                  <Form.Check type="checkbox" className="checkbox" onChange={(event) => this.addPostToDelete(event, post.postId)} checked={this.state.postsToBeDeleted.indexOf(post.postId) !== -1} />
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
    let { posts, pages } = this.state;

    return (
      <div className="Admin">
        <div className="header border-bottom">
          <h1 className="float-left">Admin</h1>
          <LinkContainer exact to="/admin/new-post">
            <Button variant="primary" className="float-right"><span><FontAwesomeIcon icon={ faPlus } /></span>New Post</Button>
          </LinkContainer>
        </div>

        <Tab.Container defaultActiveKey="posts">
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="posts" onClick={() => { this.clearCheckboxes(); this.setActiveTab("posts"); }}>Posts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="pages" onClick={() => { this.clearCheckboxes(); this.setActiveTab("pages"); }}>Pages</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Form onSubmit={this.handleSubmit}>
                <div className={`delete-container border-bottom`}>
                  <Form.Check type="checkbox" className="checkbox pt-2 pl-4 form-check" onChange={this.toggleCheckboxes} checked={this.validateDeletes()} />
                  <LoaderButton
                    variant="danger"
                    className="mt-1"
                    size="sm"
                    disabled={!this.validateDeletes()}
                    type="submit"
                    isLoading={this.validateDeletes() && this.state.isLoading}
                    text="Delete"
                    loadingText="Deleting..."
                  />
                </div>
                <Tab.Content>
                  <Tab.Pane eventKey="posts">
                    { this.renderPosts(posts) }
                  </Tab.Pane>
                  <Tab.Pane eventKey="pages">
                  { this.renderPosts(pages) }
                  </Tab.Pane>
                </Tab.Content>
              </Form>
            </Col>
          </Row>
        </Tab.Container>

        <div className="new-post-button btn btn-primary" onClick={this.handleNewPostClick}>
          <FontAwesomeIcon icon={ faPlus } />
        </div>
      </div>
    );
  }
}