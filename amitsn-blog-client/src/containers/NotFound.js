import React, {Component} from "react";
import "./NotFound.css";

export default class NotFound extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return(
      <div className="NotFound">
        <h3>Sorry, page not found!</h3>
      </div>
    );
  }
}