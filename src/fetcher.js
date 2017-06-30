import 'isomorphic-fetch';
import RedirectException from 'found/lib/RedirectException';

// TODO: Update this when someone releases a real, production-quality solution
// for handling universal rendering with Relay Modern. For now, this is just
// enough to get things working.

class FetcherBase {
  constructor(url) {
    this.url = url;
  }

  async fetch(operation, variables) {
    console.log('fetching...');
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: operation.text, variables }),
    });

    if (response.status === 401) {
      console.log('unauthorized. going to login page');
      //throw new RedirectException('http://bing.com/');
      //throw new Error('Err-11111: authentication failed');
    }

    //response.json().then((data)=>{console.log('response json:', data); return data;}).catch(error=>console.log('error is ', error));
    //
    return response.json();

  }
}

export class ServerFetcher extends FetcherBase {
  constructor(url) {
    super(url);

    this.payloads = [];
  }

  async fetch(...args) {
    const i = this.payloads.length;
    this.payloads.push(null);
    const payload = await super.fetch(...args);
    this.payloads[i] = payload;
    return payload;
  }

  toJSON() {
    return this.payloads;
  }
}

export class ClientFetcher extends FetcherBase {
  constructor(url, payloads) {
    super(url);

    this.payloads = payloads;
  }

  async fetch(...args) {
    if (this.payloads.length) {
      return this.payloads.shift();
    }

    return super.fetch(...args);
  }
}
