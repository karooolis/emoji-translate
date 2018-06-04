import React, { Component } from 'react';
import axios from 'axios';
import debounce from './utils/debounce';
import './App.css';

class App extends Component {
  state = {
    value: '',
    translated: '',
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
    this.translate(e.target.value);
  };

  translate = debounce(message => {
    axios.post('/api/translate', {  message })
    .then(res => {
      this.setState({ translated: res.data.message });
    })
    .catch(err => {
      console.log(err);
    });
  }, 1000);

  render() {
    return (
      <div className="App">
        <textarea value={this.state.value} onChange={this.handleChange} />
        <p dangerouslySetInnerHTML={{__html:this.state.translated}} />
      </div>
    );
  }
}

export default App;
