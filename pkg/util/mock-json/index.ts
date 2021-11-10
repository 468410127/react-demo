import DataX from '@pro/datax';

function mockJSON(datax, params?) {
  return DataX.parse(datax, params);
}

export default mockJSON;
