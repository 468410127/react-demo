function queryStringify(query) {
  const typeofQuery = typeof query;

  if (typeofQuery === 'string') {
    return query;
  }

  if (!query || typeofQuery !== 'object') {
    return '';
  }

  return Object.keys(query)
    .map((key) => {
      const value = query[key];
      return `${key}=${value}`;
    })
    .join('&');
}

function queryToSearch(query) {
  if (query.$data !== undefined) {
    query.$data = encodeURIComponent(JSON.stringify(query.$data));
  }
  return `?${queryStringify(query)}`;
}

export { queryStringify, queryToSearch };
