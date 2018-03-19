import mockXhr from './xhr';
import mockFetch from './fetch';

(function(window, undefined) {
  let options = {
    probability: 0.1,
    defaultResponse: {
      responseText: '{}',
      status: 400,
      statusText: 'Bad Request',
    },
    urls: {},
  }

  const shouldChangeResponse = function(url) {
    if (options.probability > 0 && Math.random() <= options.probability) {
      return true;
    }

    var validUrls = Object.keys(options.urls).filter(function(u) {
      return url.startsWith(u);
    });

    return validUrls.length > 0;
  }

  const getResponse = function(url) {
    var validUrl = Object.keys(options.urls).find(function(u) {
      return url.startsWith(u);
    });

    if (validUrl !== undefined) {
      return options.urls[validUrl];
    }

    return options.defaultResponse;
  }

  window.chaos = function(settings) {
    options = Object.assign({}, options, settings);

    mockXhr(shouldChangeResponse, getResponse);
    mockFetch(window, shouldChangeResponse, getResponse);
  };
})(window);
