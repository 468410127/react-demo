// 通用转化
import adapter from '@pro/adapter';

const formats: any = {
  // ..
};

// 时间转化
formats.time = (value) => {
  const date = new Date(value);
  return [
    date.getFullYear(),
    '-',
    pad2(date.getMonth() + 1),
    '-',
    pad2(date.getDate()),
    ' ',
    pad2(date.getHours()),
    ':',
    pad2(date.getMinutes()),
    ':',
    pad2(date.getSeconds()),
  ].join('');
};

function pad2(num) {
  return String(num).padStart(2, '0');
}

adapter.addFormat(formats);
