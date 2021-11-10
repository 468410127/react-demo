import Easyapi from './Easyapi';
import { EasyapiOption } from './typings';

function easyapi<CustomConfig>(option: EasyapiOption<CustomConfig>) {
  return new Easyapi<CustomConfig>(option).apis;
}

export default easyapi;
export { Easyapi };
