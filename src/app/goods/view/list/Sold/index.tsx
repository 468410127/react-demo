import React, { memo } from 'react'

import style from './index.less'
const SELL = '出品'

export default memo(() => {
  return (
    <div className={style.footer}>
      <div className={style.circle}>
        <div className={style.name}>{SELL}</div>
        <i className={`${style.photo} iconfont`}>&#xe609;</i>
      </div>
    </div>
  )
})
