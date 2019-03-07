import React, { Component } from "react";
import { API } from "aws-amplify";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import Content from "./Content";

export default class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      activePost: {},
      isLoading: true,
      redirect: false,
      redirectUrl: ""
    };
  }

  async componentDidMount() {
    try {
      const posts = await this.posts();
      let post = {};

      if(this.props.match.params.id && !this.props.isPage) {
        post = posts.filter(singlePost => singlePost.postId === this.props.match.params.id )[0];
      } else {
        if(this.props.isPage) {
          try {
            const page = await this.page();
            post = page;
          } catch (e) {
            console.log(e);
          }

          if(this.props.match.params.id === "home") {
            this.props.history.push("/");
            this.setState({
              redirect: true,
              redirectUrl: "/"
            });
          }
        } else if(this.props.allPosts !== true) {
          post = posts[0];
          this.props.history.push(`/blog/${post.postId}`);
          this.setState({
            redirect: true,
            redirectUrl: `/blog/${post.postId}`
          });
        }
      }

      this.setState({
        posts: posts,
        activePost: post,
        isLoading: false
      });
    } catch (e) {
      console.log(e);
    }

    ReactGA.initialize("UA-34900138-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  async componentDidUpdate(prevProps) {
    let { posts } = this.state;
    let { allPosts } = this.props;
    let post;

    if((this.props.match.params.id !== prevProps.match.params.id)
        || (prevProps.allPosts && this.props.isPage)) {
      if(this.props.match.params.id) {
        post = posts.filter(singlePost => singlePost.postId === this.props.match.params.id )[0];
      } else if(this.props.isPage) {
        this.setState({
          isLoading: true,
          activePost: {}
        });
        post = await this.page();
      } else if(this.props.allPosts !== true) {
        post = posts[0];
        this.props.history.push(`/blog/${post.postId}`);
      }

      this.setState({
        isLoading: false,
        activePost: post
      });

      ReactGA.pageview(window.location.pathname + window.location.search);
    } else if(prevProps.isPage && !this.props.isPage) {
      if(!this.props.allPosts) {
        //User moving from a page to blog
        post = posts[0];
        this.props.history.push(`/blog/${post.postId}`);

        this.setState({
          activePost: post
        });
      }

      ReactGA.pageview(window.location.pathname + window.location.search);
    } else if(prevProps.allPosts && !allPosts && this.props.isPage !== true) {
      //User moving from all posts to blog
      post = posts[0];
      this.props.history.push(`/blog/${post.postId}`);

      this.setState({
        activePost: post
      });

      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  posts() {
    return API.get("posts", "/posts");
  }

  page() {
    let pageId = this.props.match.params.id;

    if(pageId) {
      return API.get("posts", `/posts/${this.props.match.params.id}`);
    } else {
      //Load home page if no page ID present
      return API.get("posts", `/posts/home`);
    }
  }

  renderRedirect() {
    if(this.state.redirect) {
      return(
        <Helmet>
          <meta name="prerender-status-code" content="301" />
          <meta name="prerender-header" content={`Location: https://www.amitsn.com${this.state.redirectUrl}`} />
        </Helmet>        
      );
    }
  }

  render() {
    let { posts, isLoading, activePost } = this.state;
    let { isPage, allPosts } = this.props;

    return (
      <div>
        { this.renderRedirect() }
        <Content posts={posts} isLoading={isLoading} activePost={activePost} isPage={isPage} allPosts={allPosts} />
      </div>
    );
  }
}