import { useMemo, useState } from 'react';
import useLoading from './helper/useLoading';

const runtime = {
  dispatchUpdate: null,
};

function createAppBridge<State, BO>(
  BridgeClass: new (initialState, dispatchUpdate) => BO,
  initialState: State
): BO {
  return useLoading(new BridgeClass(initialState, runtime));
}

function BridgeProvider({ children }) {
  const [, update] = useState({});

  useMemo(() => {
    runtime.dispatchUpdate = () => update({});
  }, []);

  return children;
}

export { BridgeProvider, createAppBridge };
