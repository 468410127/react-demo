const whitelist =
  /^(state|connect|postMessage|onMessage|allMessages|dispatchUpdate|update|applyUpdate|useState|__isDestory__)$/;

export default function useLoading(BO) {
  return new Proxy(BO, {
    get(BO, key: string, an) {
      if (whitelist.test(key) || typeof BO[key] !== 'function') {
        return BO[key];
      }

      return (...args) => {
        BO.update((state) => {
          state.loading[key] = true;
        });

        const result = BO[key](...args);

        if (result instanceof Promise) {
          return result.finally(() => {
            BO.update((state) => {
              BO.state.loading[key] = false;
            });
          });
        }

        BO.update((state) => {
          state.loading[key] = false;
        });

        return result;
      };
    },
  });
}
