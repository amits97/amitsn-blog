import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { API } from "aws-amplify";
import Skeleton from "react-loading-skeleton";
import Sidebar from "./Sidebar";
import "./Page.css";

export default class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      page: {},
      isLoading: true
    };
  }

  async componentDidMount() {
    try {
      const page = await this.page();
      this.setState({
        page: page
      });
    } catch (e) {
      console.log(e);
    }

    try {
      const posts = await this.posts();
      this.setState({
        posts: posts,
        isLoading: false
      });
    } catch (e) {
      console.log(e);

      this.setState({
        isLoading: false
      });     
    }
  }

  page() {
    return API.get("posts", `/posts/${this.props.match.params.id}`);
  }

  posts() {
    return API.get("posts", "/posts");
  }

  renderPage() {
    let { page } = this.state;

    if(!this.state.isLoading) {
      if(!page.hasOwnProperty("postId")) {
        return(
          <h3>Page not found!</h3>
        )        
      }
    }

    return(
      <div>
        <h1>{page.title || <Skeleton />}</h1>
        <hr />
        { page.content ? <ReactMarkdown source={page.content} /> : <Skeleton count={15} /> }
      </div>
    );
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="Page">
        <Row>
          <Col sm={8}>
            { this.renderPage() }
          </Col>
          <Col sm={4}>
            <Sidebar posts={this.state.posts} />
          </Col>
        </Row>
      </div>
    );
  }
}