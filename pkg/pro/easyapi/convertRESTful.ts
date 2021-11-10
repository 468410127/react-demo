import { compile } from 'path-to-regexp';
import RequestContext from './RequestContext';

function convertRESTful<CustomConfig>(context: RequestContext<CustomConfig>) {
  const { sendData, config } = context;
  const { params, url } = config;

  const RESTFulParams = { ...params, ...sendData };

  const urlSplits = url.split('?');
  let baseUrl = urlSplits.shift();
  const queryString = urlSplits.join('?');

  // /api/${id}
  if (/\{\w+\}/.test(baseUrl)) {
    baseUrl = baseUrl.replace(/\{(\w+)\}/g, (match, key) => {
      if (key in RESTFulParams) {
        return RESTFulParams[key];
      }
      return match;
    });
  }

  // /api/:id
  if (/:\w+/.test(baseUrl)) {
    baseUrl = compile(baseUrl, { encode: encodeURIComponent })(RESTFulParams);
  }

  config.url = baseUrl + (queryString ? `?${queryString}` : '');
}

export default convertRESTful;
