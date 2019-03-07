import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Login from "./containers/Login";
import NewPost from "./containers/NewPost";
import Posts from "./containers/Posts";
import Admin from "./containers/Admin";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Posts} props={{isPage: true, ...childProps}} />
    <AuthenticatedRoute path="/admin" exact component={Admin} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/admin/new-post" exact component={NewPost} props={childProps} />
    <AuthenticatedRoute path="/admin/edit-post/:id" exact component={NewPost} props={{isEditMode: true, ...childProps}} />
    <AppliedRoute path="/blog" exact component={Posts} props={childProps} />
    <AppliedRoute path="/blog/all" exact component={Posts} props={{allPosts: true, ...childProps}} />
    <AppliedRoute path="/blog/:id" exact component={Posts} props={childProps} />
    <AppliedRoute path="/:id" exact component={Posts} props={{isPage: true, ...childProps}} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;