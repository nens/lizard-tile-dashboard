const baseUrl = (() => {
  let absoluteBase = 'http://demo.lizard.net/api/v3';

  if (typeof window !== 'undefined') {
    const protocol = window && window.location.protocol;

    const host = window && window.location.host;

    absoluteBase = `${protocol}//${host}/api/v3`;
  }
  return absoluteBase;
})();

export function combineUrlAndParams(url, params) {
  let query = Object.keys(params).map(
    k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  ).join('&');

  if (query) {
    if (url.indexOf('?') >= 0) {
      return url + '&' + query;
    } else {
      return url + '?' + query;
    }
  }
  return url;
}

export function endpoint(urlFragment, params = {}) {
  /* Construct URL for API endpoint; urlFragment is relative to the API's baseUrl and
     we add 'format=json' to the params. */
  let url = baseUrl + (urlFragment[0] === '/' ? '' : '/') + urlFragment;
  let totalParams = Object.assign({'format': 'json'}, params);

  return combineUrlAndParams(url, totalParams);
}

export function request(url) {
  return new Promise(function (resolve, reject) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status >= 200 && this.status < 300) {
        let json = null;

        try {
          json = JSON.parse(this.response);
        } catch (e) {
          console.error(
            'Lizard-api-client could not parse expected JSON result;',
            'request=', url, 'response=', this.response, 'error=', e);
        }

        resolve(json);
      } else {
        reject(`Status ${this.status}, '${this.statusText}' for URL ${url}.`);
      }
    };

    request.withCredentials = true; // Send cookie.
    request.open('GET', url);
    request.send();
  });
}

export function insertGetParam(url, key, value) {
  // Helper function that escapes key and value and adds it to the URL, works
  // if there are already params present and when not.
  // Does not yet check if key already exists, also not if '#' is
  // present, just adds to the end!
  let params = {};

  params[key] = value;
  return combineUrlAndParams(url, params);
}
