import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewPost from "./containers/NewPost";
import Posts from "./containers/Posts";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/posts/new" exact component={NewPost} props={childProps} />
    <AppliedRoute path="/posts/:id" exact component={Posts} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;