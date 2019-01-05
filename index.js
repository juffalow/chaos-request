export default class ChaosRequest {
  constructor(shouldChangeResponse, getResponse) {

    this.shouldChangeResponse = typeof shouldChangeResponse === 'function' ? shouldChangeResponse : function() {
      return true;
    };

    this.getResponse = typeof getResponse === 'function' ? getResponse : function() {
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
  }

  mock() {
    this.fetch = window.fetch;
    window.fetch = (...args) => {
      if (this.shouldChangeResponse(args)) {
        return new Promise((resolve) => {
          const response = this.getResponse(args);

          resolve(new Response(response.body, response.init));
        });
      }
      return this.fetch.apply(null, args);
    }
  }

  restore() {
    window.fetch = this.fetch;
  }
};