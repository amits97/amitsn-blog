import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
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
    this.props.history.push("/");
  }

  authenticatedOptions = () => {
    if(this.state.isAuthenticated) {
      return(
        <React.Fragment>
          <LinkContainer exact to="/posts/new">
            <a href="#/" className="nav-link">New Post</a>
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
        <Navbar bg="dark" variant="dark" expand="lg">
          <div className="container">
            <Navbar.Brand>
              <Link to="/">AmitSN</Link>
              <small>Random console logs</small>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <LinkContainer exact to="/">
                  <a href="#/" className="nav-link">Home</a>
                </LinkContainer>
                <LinkContainer exact to="/about">
                  <a href="#/" className="nav-link">About</a>
                </LinkContainer>
                { this.authenticatedOptions() }
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
        <div className="container">
          <Routes childProps={childProps} />
        </div>
      </div>
    );
  }
}

export default withRouter(App);