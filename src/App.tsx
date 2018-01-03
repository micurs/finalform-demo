import * as React from 'react';
import './App.css';

import { MyForm0, FormData0 } from './components/myform0';

import { MyForm1, FormData1 } from './components/myform1';
import { MyForm2, FormData2 } from './components/myform2';

const logo = require('./logo.svg');

function handleSubmit( d: FormData0 | FormData1 | FormData2 ) {
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
        <MyForm0 onSubmit={handleSubmit} />
        <MyForm1 onSubmit={handleSubmit} />
        <MyForm2 onSubmit={handleSubmit} />
      </div>
    );
  }
}

export default App;
