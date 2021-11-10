import { useRoute } from '@pkg/react-better/router'
import React, { useEffect, useState } from 'react'

import api from '@/api'


export default function View() {
  const route = useRoute()
  const { id } = route.params

  const [detail, setDetail] = useState({})

  useEffect(() => {
    api.goods.item({ id }).then((data) => {
      setDetail(data)
    })
  }, [id])

  return (
    <div>
     detail:key
    </div>
  )
}

