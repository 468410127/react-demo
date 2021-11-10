import React, { memo } from 'react';

import style from './index.less';

export default memo(() => {
  return (
    <div className={style.header}>
      <div className={style.left}>
        <i className={`${style.iconfont} iconfont expend`}>&#xe786;</i>
        <input placeholder="検索" />
      </div>
      <div className={style.right}>
        <i className={`${style.iconfont} iconfont ${style.bell}`}>&#xe629;</i>
        <i className={`${style.iconfont} iconfont`}>&#xe607;</i>
      </div>
    </div>
  );
});
