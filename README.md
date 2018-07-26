# Chaos Request

[![License](https://img.shields.io/badge/License-MIT-blue.svg?maxAge=2592000)](https://github.com/juffalow/chaos-request/blob/master/LICENSE)

Chaos Request will change the *XHR* & *Fetch* response from time to time, so your application
cannot rely on getting only successful response from the server. It makes you
think what is going to happen if API is not working or something goes wrong.

Also it can mock your missing API calls, so you can work without waiting for backend to be implemented.

This project was inspired by [Chaos Monkey](https://github.com/Netflix/chaosmonkey)

## Installation

```shell
npm install [--save-dev] chaos-request

# or

yarn add [--dev] chaos-request
```

## How it works

```javascript
import ChaosRequest from 'chaos-request';

ChaosRequest.mock();
```

## React example

In the root component ( let's say `App` ), import `ChaosRequest` and in `componentDidMount` method, call `mock`.

```javascript
import React, { Component } from 'react';
import ChaosRequest from './chaos-request';

class App extends Component {
  componentDidMount() {
    ChaosRequest.mock();
  }

  render() {
    return (<div></div>);
  }
}
```

This will create a default mock - probability is 20% and default response is empty object `{}` with status `400`.

## Options

The `mock` function takes two parameters:

```javascript
mock: function(shouldChangeResponse, getResponse) {

}
```

#### shouldChangeResponse

The `shouldChangeResponse` is called before network call. If it returns true, the response is changed. If it returns false, everything continues without any change.

```javascript
const shouldChangeResponseFunction = function(url) {
  return Math.random() <= 0.2;
}
```

But if you need to get more probability for some specific URL, you can easily modify it:

```javascript
const shouldChangeResponseFunction = function(url) {
  if (url === 'some specific URL') {
    return true;
  }

  return Math.random() <= 0.2;
}
```

#### getResponse

The `getResponse` is used for either default response or url specific response.

```javascript
const getResponseFunction = function(url) {
  return {
    responseText: '{}',
    status: 400,
    statusText: 'Bad Request',
  };
}
```

If you need to return different responses for different URLs:

```javascript
const getResponseFunction = function(url) {
  switch(url) {
    case 'url1':
      return {
        responseText: '{value:"Response for url1"}',
        status: 200,
        statusText: 'OK',
      };
    case 'url2':
      return {
        responseText: '{value:"Response for url2"}',
        status: 200,
        statusText: 'OK',
      };
  }
  return {
    responseText: '{}',
    status: 400,
    statusText: 'Bad Request',
  };
}
```

## License

[MIT license](./LICENSE)
