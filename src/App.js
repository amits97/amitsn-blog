import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import { Helmet } from "react-helmet";
import Routes from "./Routes";
import "highlight.js/styles/xcode.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      navExpanded: false,
      isAuthenticated: false,
      isAuthenticating: true
    };

    this.packageDetails = require('../package.json')
  }

  setNavExpanded = (expanded) => {
    this.setState({
      navExpanded: expanded
    });
  }

  closeNav = () => {
    this.setState({
      navExpanded: false
    });
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }
  
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    event.preventDefault();
    await Auth.signOut();
  
    this.userHasAuthenticated(false);
    this.closeNav();
    this.props.history.push("/");
  }

  authenticatedOptions = () => {
    if(this.state.isAuthenticated) {
      return(
        <React.Fragment>
          <LinkContainer to="/admin">
            <a href="#/" className="nav-link" onClick={this.closeNav}>Admin</a>
          </LinkContainer>
          <a href="#/" className="nav-link" onClick={this.handleLogout}>Logout</a>
        </React.Fragment>
      );
    }
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Amit S Namboothiry | Web Development Engineer</title>
          <meta name="description" content="Personal website and blog of Amit S Namboothiry,  a Web Development Engineer with good experience and passion for making clean and elegant websites." />
          <meta property="og:description" content="Personal website and blog of Amit S Namboothiry,  a Web Development Engineer with good experience and passion for making clean and elegant websites." />
          <meta property="og:image" content={`${window.location.origin.toString()}/android-chrome-256x256.png`} />
        </Helmet>

        <Navbar bg="white" expand="lg" sticky="top" onToggle={this.setNavExpanded} expanded={this.state.navExpanded} className="border-bottom">
          <div className="container">
            <Navbar.Brand>
              <Link to="/">AMITSN</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <LinkContainer exact to="/">
                  <a href="#/" className="nav-link" onClick={this.closeNav}>Home</a>
                </LinkContainer>
                <LinkContainer to="/blog">
                  <a href="#/" className="nav-link" onClick={this.closeNav}>Blog</a>
                </LinkContainer>
                { this.authenticatedOptions() }
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
        <div className="container contents">
          <Routes childProps={childProps} />
        </div>
        <footer className="bg-dark">
          <Container>
            <Row>
              <Col sm={8}>
                <Row>
                  <Col>
                    <h1><Link to="/">a.</Link></h1>
                    <small>Random console logs</small><br />
                    <small><a href="/sitemap.xml">sitemap</a> | rev {this.packageDetails.version}</small>
                  </Col>
                  <Col>
                    <h6>FIND ME ON</h6>
                    <ul className="list-unstyled">
                      <li><a href="https://github.com/amits97">Github</a></li>
                      <li><a href="https://twitter.com/amits97">Twitter</a></li>
                      <li><a href="https://www.linkedin.com/in/amitsn/">LinkedIn</a></li>
                      <li><a href="https://facebook.com/amits97">Facebook</a></li>
                    </ul>
                  </Col>
                  <Col>
                    <h6>EXPLORE</h6>
                    <ul className="list-unstyled">
                      <li><a href="https://www.naadanchords.com">Naadan Chords</a></li>
                    </ul>
                    <h6>MUSIC</h6>
                    <ul className="list-unstyled">
                      <li><a href="https://www.soundcloud.com/asn">SoundCloud</a></li>
                    </ul>
                    <h6>WRITING</h6>
                    <ul className="list-unstyled">
                      <li><a href="https://tutsplus.com/authors/amit-s-namboothiry">Envato Tuts+</a></li>
                      <li><a href="https://medium.com/@amits97">Medium</a></li>
                    </ul>
                  </Col>
                </Row>
              </Col>
              <Col sm={4}></Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
  }
}

export default withRouter(App);