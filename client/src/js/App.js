import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';

class App extends Component {

  componentDidMount() {
    fetch('/users');
  }

  render() {
    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
