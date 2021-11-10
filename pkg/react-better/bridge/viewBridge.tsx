import { useEffect, useMemo, useState } from 'react';
import Bridge from './Bridge';
import useLoading from './helper/useLoading';

const BOCaches = {};
const DefaultName = Symbol('DefaultName');

function createBridge<
  State,
  Api = { [key: string]: any },
  IBO = Bridge<State> & Api
>(
  initialState?: State | (() => State),
  name: string | symbol = DefaultName
): IBO {
  const [, dispatchUpdate] = useState({});

  const BO = useMemo(() => {
    const BO = useLoading(
      new Bridge<State>(initialState || {}, {
        dispatchUpdate: (v) => !BO.___isDestory__ && dispatchUpdate(v),
      })
    );

    if (name) {
      // if (BOCaches[name]) {
      //   console.warn(`存在同名BO：${String(name)}`);
      // }
      BOCaches[name] = BO;
    }

    return BO;
  }, []);

  useEffect(() => {
    if (name) {
      BOCaches[name] = BO;
      return () => {
        delete BOCaches[name];
        BO.__isDestory__ = true;
      };
    }
  }, []);

  return BO;
}

function useBridge(name: string | symbol = DefaultName): Bridge<any> {
  return BOCaches[name];
}

export { createBridge, useBridge };
