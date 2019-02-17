import React, { Component } from "react";
import Page from "./Page";

export default class Home extends Component {
  render() {
    return (
      <div>
        <Page id="home" isHomePage={true} />
      </div>
    );
  }
}