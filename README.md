# Chaos Request

[![License](https://img.shields.io/badge/License-MIT-blue.svg?maxAge=2592000)](https://github.com/juffalow/chaos-request/blob/master/LICENSE)

Chaos Request changes the behavior of `fetch`. You can change body of the response,
status code or throw exception.

This project was inspired by [Chaos Monkey](https://github.com/Netflix/chaosmonkey)

## Installation

```shell
npm install [--save-dev] chaos-request

# or

yarn add [--dev] chaos-request
```

## Usage

```javascript
import ChaosRequest from 'chaos-request';

const shouldChangeResponse = () => {
  return true;
};

const getResponse = () => {
  return {
    body: JSON.stringify({}),
    init: {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-type': 'application/json',
      },
    },
  };
};

const chaosRequest = new ChaosRequest(shouldChangeResponse, getResponse);
chaosRequest.mock();
```

## React example

Open `index.js` file and import `ChaosRequest` module. It takes two parameters, both are functions.
The first function decides if the request should be changed or not. If not, default fetch API will be used. The second function returns an object with two fields: `body` and `init`. Here you can define what should the fetch return.

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ChaosRequest from 'chaos-request';

const shouldChangeResponse = () => {
  return true;
};

const getResponse = () => {
  return {
    body: JSON.stringify({test: 'just test!'}),
    init: {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-type': 'application/json',
      },
    },
  };
};

const chaosRequest = new ChaosRequest(shouldChangeResponse, getResponse);
chaosRequest.mock();

ReactDOM.render(<App />, document.getElementById('root'));
```

```javascript
// App.js
import React, { Component } from 'react';

class App extends Component {

  componentDidMount() {
    fetch('https://<your-api-url>/')
      .then(response => response.json())
      .then((object) => {
        console.log(object); // {test: "just test!"}
      });
  }

  render() {
    return (
      <div></div>
    )
  }
}
```

## License

[MIT license](./LICENSE)
