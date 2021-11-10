import RequestContext from './RequestContext';

function cacheResult<CustomConfig>(context: RequestContext<CustomConfig>) {
  return context.waitForCacheResult();
}

export default cacheResult;
