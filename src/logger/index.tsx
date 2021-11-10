// 调试信息
import kvlog from '@pkg/util/kv-log';

const date = new Date(process.env.Built);
const builtTime = [
  date.getFullYear(),
  '-',
  pad2(date.getMonth() + 1),
  '-',
  pad2(date.getDate()),
  ' ',
  pad2(date.getHours()),
  pad2(date.getMinutes()),
  pad2(date.getSeconds()),
].join('');

function pad2(value) {
  return String(value).padStart(2, '0');
}

kvlog('BUILT', `${process.env.NODE_ENV} ${builtTime}`);
