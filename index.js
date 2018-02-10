(function(window, undefined) {
  var options = {
    probability: 0.1,
    defaultResponse: {
      responseText: '{}',
      status: 400,
      statusText: 'Bad Request',
    },
    urls: {},
  };

  var openPrototype = XMLHttpRequest.prototype.open;

  var overrideResponse = function() {
     XMLHttpRequest.prototype.open = function() {
        this.addEventListener('readystatechange', function(event) {
           if (this.readyState === 4 && shouldChangeResponse(this.responseURL)) {
              var response = getResponse(this.responseURL);
              Object.defineProperty(this, 'response',     {writable: true});
              Object.defineProperty(this, 'responseText', {writable: true});
              this.status = response.status;
              this.statusTexxt =response.statusText;
              this.response = this.responseText = response.responseText;
           }
        });
        return openPrototype.apply(this, arguments);
     };
  };

  var shouldChangeResponse = function(url) {
    if (options.probability > 0 && Math.random() <= options.probability) {
      return true;
    }

    var validUrls = Object.keys(options.urls).filter(function(u) {
      return url.startsWith(u);
    });

    return validUrls.length > 0;
  }

  var getResponse = function(url) {
    var validUrl = Object.keys(options.urls).find(function(u) {
      return url.startsWith(u);
    });

    if (validUrl !== undefined) {
      return options.urls[validUrl];
    }

    return options.defaultResponse;
  }

  var begin = function(o) {
    if (o !== undefined) {
      Object.assign(options, o);
      if (Object.keys(options.urls).length > 0) {
        Object.keys(options.urls).forEach(function(url) {
          options.urls[url] = Object.assign(options.defaultResponse, options.urls[url]);
        });
      }
    }
    console.log(options);
    overrideResponse();
  }

  this.chaosAjax = begin;
})(this);
