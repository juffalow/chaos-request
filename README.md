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

### Change every response

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

### Change response based on URL

Most probably, you will need to change just some specific request(s). In the next example,
only three requests are overriden and everything else would work without any modification.
Request for `https://swapi.co/api/people/1/` returns hard coded object. Request for
`https://swapi.co/api/people/2/` will fetch the data from API and change the name field.
The last request for `https://swapi.co/api/people/3/` will fail.

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ChaosRequest from './ChaosRequest';

const shouldChangeResponse = (args) => {
  const url = args[0];
  switch(url) {
    case 'https://swapi.co/api/people/1/':
    case 'https://swapi.co/api/people/2/':
    case 'https://swapi.co/api/people/3/':
      return true;
  }
  return false;
};

const getResponse = (args, fetch) => {
  const url = args[0];

  switch(url) {
    case 'https://swapi.co/api/people/1/':
      return {
        body: JSON.stringify({
          name:"Luke Skywalker",
          height:"172",
          mass:"77",
          hair_color:"blond",
          skin_color:"fair",
          eye_color:"blue",
          birth_year:"19BBY",
          gender:"male"
        }),
        init: {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-type': 'application/json',
          },
        },
      };
    case 'https://swapi.co/api/people/2/':
      return fetch('https://swapi.co/api/people/1/')
        .then(response => response.json())
        .then((data) => {
          return {
            body: JSON.stringify(Object.assign({}, data, {name: 'Spock'})),
            init: {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-type': 'application/json',
              },
            },
          };
        });
    case 'https://swapi.co/api/people/3/':
      throw new Error('Timeout');
  }
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
    fetch('https://swapi.co/api/people/1/')
      .then(response => response.json())
      .then((data) => {
        // {name: "Luke Skywalker", height: "172", mass: "77", hair_color: "blond", skin_color: "fair", …}
        console.log(data);
      });

    fetch('https://swapi.co/api/people/2/')
      .then(response => response.json())
      .then((data) => {
        // {name: "Spock", height: "172", mass: "77", hair_color: "blond", skin_color: "fair", …}
        console.log(data);
      });

    fetch('https://swapi.co/api/people/3/')
      .then(response => response.json())
      .then((data) => {
        console.log(data);
      }).catch(error => console.log(error.message)); // Timeout
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
