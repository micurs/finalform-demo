import * as React from 'react';
import './App.css';

import { MyForm, FormData } from './components/myform';
import { MyForm2, FormData2 } from './components/myform2';

const logo = require('./logo.svg');

function handleSubmit( d: FormData | FormData2 ) {
  alert(JSON.stringify(d, null, '  '));
  return false;
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React using Final Form</h2>
        </div>
        <MyForm onSubmit={handleSubmit} />
        <MyForm2 onSubmit={handleSubmit} />
      </div>
    );
  }
}

export default App;
