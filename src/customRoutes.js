import * as React from 'react';
import { Route } from 'react-router-dom';
import Home from './containers/Home';
import Player from './containers/Player';

export default [
    <Route exact path="/" component={Home} noLayout />,
    <Route exact path="/player" component={Player} noLayout />,
    <Route path="/player/:id" component={Player} noLayout />,
];
