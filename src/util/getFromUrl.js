export default function getFromUrl (url) {
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