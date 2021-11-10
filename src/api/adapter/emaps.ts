// 通用映射

import adapter from '@pro/adapter';

const emaps: any = {
  provider: { aliyun: '阿里云', tencent: '腾讯云' },
};

emaps.province = {
  zj: '浙江省',
  bj: '北京市',
  hlj: '黑龙江',
};

adapter.addEmap(emaps);
