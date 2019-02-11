import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Login from "./containers/Login";
import NewPost from "./containers/NewPost";
import Posts from "./containers/Posts";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Posts} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/new-post" exact component={NewPost} props={childProps} />
    <AppliedRoute path="/posts" exact component={Posts} props={childProps} />
    <AppliedRoute path="/posts/:id" exact component={Posts} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;