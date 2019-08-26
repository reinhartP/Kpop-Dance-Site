import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './containers/Home';
import Player from './containers/Player';
import AdminPage from './containers/Admin';
class Routes extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/admin" component={AdminPage} />
                    <Route exact path="/player" component={Player} />
                    <Route path="/player/:id" component={Player} />
                </Switch>
            </div>
        );
    }
}

export default Routes;
