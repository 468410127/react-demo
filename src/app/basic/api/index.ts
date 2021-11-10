import mockJSON from '@pkg/util/mock-json';

import { IConfigs } from '@/api/index.types';

const configs: IConfigs = {
  namespace: 'basic',

  mock: {
    tableData: {
      label: '模拟表格数据',
      url: 'mock/tableData',
      logger: true,
      mock({ sendData }) {
        return {
          code: 0,
          data: mockJSON(
            `
              @page page
              @pageSize pageSize
              @total 8888
              @list(pageSize)[
                  @id 1000++
                  @name #name
                  @age #integer(1, 99)
                  @sex ['男', '女', '保密']??
                  @profession ['教师','司机']??
              ]
              `,
            sendData
          ),
        };
      },
      delay: 1000,
    },
  },
};

export default configs;
