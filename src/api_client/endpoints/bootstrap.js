import { request } from '../http';
import { processSingleResultResponse } from '../tools';

export function getBootstrap(clientSlug = 'lizard') {
  let url = `/bootstrap/${clientSlug}/`;

  return request(url).then(function (result) {
    // This endpoint's JSON is quite nested, but the nesting isn't very relevant
    // to what we want from it. So we just flatten the structure and create exactly
    // the fields we want for our valueobject. If you need more information from the bootstrap
    // that isn't here yet, just add it (also add it to the valueobject).
    const r = {
      username: result.user.username,
      first_name: result.user.first_name,
      authenticated: result.user.authenticated,
      login: result.sso.login,
      logout: result.sso.logout,
      state: result.state,
      configuration: result.configuration
    };

    return processSingleResultResponse('Bootstrap', r, url);
  });
}
