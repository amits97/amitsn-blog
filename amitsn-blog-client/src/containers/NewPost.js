import React, { Component } from "react";
import { Form, Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import "./NewPost.css";

export default class NewPost extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      title: "",
      content: ""
    };
  }

  validateForm() {
    return this.state.title.length > 0
          && this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await this.createPost({
        title: this.state.title,
        content: this.state.content
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  createPost(post) {
    return API.post("posts", "/posts", {
      body: post
    });
  }

  render() {
    return (
      <div className="NewPost">
        <h3>New Post</h3>
        <hr />
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="title">
                <Form.Control type="text" placeholder="Post title" onChange={this.handleChange} value={this.state.title} />
              </Form.Group>

              <Form.Group controlId="content">
                <Form.Control as="textarea" placeholder="Post content" onChange={this.handleChange} value={this.state.content} />
              </Form.Group>
              <LoaderButton
                variant="primary"
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Create"
                loadingText="Creating…"
              />
            </Form>        
          </Col>
          <Col>
            <div className="preview-pane">
              <h3>{this.state.title}</h3>
              <ReactMarkdown source={this.state.content} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}