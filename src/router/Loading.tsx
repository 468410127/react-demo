import React from 'react';

import style from './Loading.less';

/** @description 加载等待组件 */
export default function Loading({ children, spinning = true }) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          display: spinning ? 'block' : 'none',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={style.container} style={{ transform: 'scale(1)' }}>
          <div className={[style.loader, style.three].join(' ')}></div>
        </div>
      </div>
      <div style={{ visibility: spinning ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </div>
  );
}
