import React, {Component} from "react";
import { Helmet } from "react-helmet";
import "./NotFound.css";

export default class NotFound extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return(
      <div className="NotFound">
        <Helmet>
          <meta name="prerender-status-code" content="404" />
        </Helmet>
        <h3>Sorry, page not found!</h3>
      </div>
    );
  }
}