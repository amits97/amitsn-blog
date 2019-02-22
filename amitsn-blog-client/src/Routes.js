import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Login from "./containers/Login";
import NewPost from "./containers/NewPost";
import NewPage from "./containers/NewPage";
import Posts from "./containers/Posts";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Posts} props={{isPage: true, ...childProps}} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/new-post" exact component={NewPost} props={childProps} />
    <AuthenticatedRoute path="/new-page" exact component={NewPage} props={childProps} />
    <AppliedRoute path="/blog" exact component={Posts} props={childProps} />
    <AppliedRoute path="/blog/:id" exact component={Posts} props={childProps} />
    <AppliedRoute path="/:id" exact component={Posts} props={{isPage: true, ...childProps}} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;