import { Link } from '@pkg/react-better/router'
import React, { memo, useEffect, useState } from 'react'

import { goods } from '@/api'
import Loading from '@/router/Loading'

import style from './index.less'
const SOLD = 'SOLD'

export default memo(() => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    goods
      .items()
      .then((data) => {
        setItems(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className={style.first}>
      <Loading spinning={loading}>
        <div className={style.list}>
          {items.map(({ id, name, image, is_sold_out, price, like_count }) => {
            return (
              <div className={style.list_item} key={id}>
                <Link  to={`/goods/detail/${id}`} key={id}>
                  {is_sold_out ? (
                    <div className={style.out}>
                      <div className={style.angle}></div>
                      <div className={style.statue}>{SOLD}</div>
                    </div>
                  ) : null}

                  <div className={style.img_wrapper}>
                    <img src={image} width="100%" height="100%" alt={name} />
                  </div>
                  <div className={style.describe}>
                    <div className={style.desc}>{name}</div>
                    <div className={style.like}>
                      <div className={style.price}>¥ {price.toLocaleString()}</div>
                        <div className={style.num}>
                          <i className="iconfont">&#xeca1;</i>
                          <span>{like_count}</span>
                        </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </Loading>
    </div>
  )
})
