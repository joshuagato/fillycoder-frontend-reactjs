import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Posts from './components/Posts/Posts';

class App extends Component {

  render() {
    return (
      <div className="app-loader">
        <Switch>
          <Route path='/' component={Posts} />
        </Switch>
      </div>
    );
  }
}

export default App;