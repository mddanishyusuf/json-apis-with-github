import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';

import Application from './components/Application';
import LandingPage from './components/LandingPage';
import RepositoryList from './components/RepositoryList';

import withAuthentication from './config/withAuthentication';

const router = (
    <Router>
        <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/editor/:owner/:repoName" component={withAuthentication(Application)} />
            <Route path="/database" component={withAuthentication(RepositoryList)} />
            {/* <Route render={() => <Redirect to="/" />} /> */}
        </Switch>
    </Router>
);

ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
