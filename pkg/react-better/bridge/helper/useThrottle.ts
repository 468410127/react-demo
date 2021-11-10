// 节流阀
export default function useThrottle(
  interval = 16,
  envOverwrite = { interval: undefined }
) {
  return (instance, methodName, methodDesc) => {
    const method = methodDesc.value;
    const env = { lastTime: 0, before: false, timer: null };

    methodDesc.value = function (...args) {
      const now = Date.now();

      const { lastTime = 0, before = false } = env;
      const myInterval = envOverwrite.interval || interval;

      // 第一次或者时间满足间隔了，直接触发
      if (before && (!lastTime || now - lastTime > myInterval)) {
        env.lastTime = now;
        method.apply(this, args);
        return;
      }

      // 还不能满足触发条件的，放入监听
      clearTimeout(env.timer);
      env.timer = setTimeout(() => {
        env.lastTime = Date.now();
        try {
          // 当组件被释放了，处理异常
          method.apply(this, args);
        } catch (err) {
          throw Error(err);
          //   console.info({ err });
        }
      }, Math.max(0, myInterval - (now - lastTime)));
    };
  };
}
