import React from 'react'

import style from './index.less'

export default function LayoutIndex({ layout, content }) {
  if (Object.keys(layout).length === 0) {
    return content
  }

  const contextHeight = `calc(100vh - ${layout.header ? 60 : 0}px)`
  return (
    <div className={style.layout}>
      <div className={style.content} style={{ height: contextHeight }}>
        {content}
      </div>
    </div>
  )
}
