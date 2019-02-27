import React, { Component } from "react";
import { Form, Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import htmlParser from "react-markdown/plugins/html-parser";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import TextareaAutosize from "react-autosize-textarea";
import CodeBlock from "../renderers/code-renderer";
import "./NewPost.css";

export default class NewPost extends Component {
  constructor(props) {
    super(props);

    this.parseHtml = htmlParser();

    this.state = {
      isLoading: null,
      title: "",
      content: "",
      type: "POST"
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
        content: this.state.content,
        type: this.state.type
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

  componentDidMount() {
    window.scrollTo(0, 0);
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

              <TextareaAutosize placeholder="Post content" onChange={this.handleChange} value={this.state.content} id="content" className="form-control" style={{ minHeight: 250 }} />
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
              <ReactMarkdown source={this.state.content} renderers={{ code: CodeBlock }} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}