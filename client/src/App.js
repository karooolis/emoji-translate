import React, { Component } from 'react';
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';
import debounce from './utils/debounce';
import './App.css';

class App extends Component {
  state = {
    value: 'O ne!!! Mano namas dega, o katė tuoj suvalgys visas spurgas.',
    translated: 'O 👎!!! 😊👈 🏘 🔥, o 😺 ▶️ 🍽visas 🍩.',
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
    this.translate(e.target.value);
  };

  translate = debounce(message => {
    axios
      .post('/api/translate', { message })
      .then(res => {
        this.setState({ translated: res.data.message });
      })
      .catch(err => {
        console.log(err);
      });
  }, 1000);

  copy = () => {
    this.setState({ copied: true });

    setTimeout(() => {
      this.setState({ copied: false });
    }, 1500);
  };

  render() {
    return (
      <div className="App container">
        <h1>Versk iš 🇱🇹</h1>
        <p className="note">(įrašyk ką nors!)</p>
        <textarea value={this.state.value} onChange={this.handleChange} />

        <h1>
          Į ✨emociukų kalbą✨{' '}
          <CopyToClipboard text={this.state.translated} onCopy={this.copy}>
            <button id="copyButton">{this.state.copied ? 'Nukopijuota' : 'Kopijuoti'}</button>
          </CopyToClipboard>
        </h1>
        <div id="output" dangerouslySetInnerHTML={{ __html: this.state.translated }} />
        <div id="footer">
          <p>
            pagaminta su <span className="red">🌮</span> 🤷‍♂️ <a href="https://twitter.com/superkarolis">karolis</a>. peržiūrėk kodą{' '}
            <a href="https://github.com/superkarolis/emoji-translate">github</a>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
