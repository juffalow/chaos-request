export default function(shouldChangeResponse, getResponse) {
  const openPrototype = XMLHttpRequest.prototype.open;

  const overrideResponse = function() {
     XMLHttpRequest.prototype.open = function() {
        this.addEventListener('readystatechange', function(event) {
           if (this.readyState === 4 && shouldChangeResponse(this.responseURL)) {
              var response = getResponse(this.responseURL);
              Object.defineProperty(this, 'status',     {writable: true});
              Object.defineProperty(this, 'statusText',     {writable: true});
              Object.defineProperty(this, 'response',     {writable: true});
              Object.defineProperty(this, 'responseText', {writable: true});
              console.log('response', response);
              this.status = response.status;
              this.statusText = response.statusText;
              this.response = this.responseText = response.responseText;
              return this;
           }
        });
        return openPrototype.apply(this, arguments);
     };
  };

  overrideResponse();
}
