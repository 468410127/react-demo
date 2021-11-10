import onResponse from './onResponse';
import RequestContext from './RequestContext';

// axios发起http请求
function httpResult<CustomConfig>(context: RequestContext<CustomConfig>) {
  return onResponse(context.runtime.axiosInstance(context.axios()), context);
}

export default httpResult;
