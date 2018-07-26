import mockXhr from './src/xhr';
import mockFetch from './src/fetch';

const shouldChangeResponseFunction = function(url) {
  const random = Math.random();
  console.log(random);
  if (random <= 0.2) {
    console.log('true');
    return true;
  }
  return false;
}

const getResponseFunction = function(url) {
  return {
    responseText: '{}',
    status: 400,
    statusText: 'Bad Request',
  };
}

export default {
  mock: function(shouldChangeResponse, getResponse) {
    shouldChangeResponse = typeof shouldChangeResponse === 'function' ? shouldChangeResponse : shouldChangeResponseFunction;
    getResponse = typeof getResponse === 'function' ? getResponse : getResponseFunction;
    mockXhr(shouldChangeResponse, getResponse);
    mockFetch(window, shouldChangeResponse, getResponse);
  }
};
