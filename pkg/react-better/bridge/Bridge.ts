import { useEffect, useMemo, useState } from 'react';
import useThrottle from './helper/useThrottle';

interface Message {
  cmd: string;
  ready?: (payload) => void;
  done?: (results: Array<any>) => void;
  delay: number;
  pending: boolean;
  payloads: Array<any>;
}

type StateLoading = { loading: Record<string, boolean> };

const updateSymbol = '___system.update___';

class Bridge<
  State,
  StateValue = {
    [Key in keyof State]?: State[Key];
  }
> {
  state: State & StateLoading;

  private allMessages: Record<string, Array<Message>>;

  private dispatchUpdate: () => void;

  constructor(initialState, runtime) {
    if (typeof initialState === 'function') {
      this.state = initialState();
    } else {
      this.state = initialState;
    }

    this.state.loading = new Proxy(
      {},
      {
        get(loading, key) {
          return loading[key] || false;
        },
      }
    );

    this.dispatchUpdate = () => runtime.dispatchUpdate({});
    this.allMessages = {};
  }

  update(state?: StateValue);

  update(state: (prevState: StateValue) => StateValue | void);

  // 更新状态
  update(state?) {
    const prevState = this.state;

    // 函数返回新状态或者内部直接修复状态
    if (typeof state === 'function') {
      const nextState = state(prevState);
      // 覆盖state
      if (nextState) {
        for (const key in prevState) {
          delete prevState[key];
        }
        Object.assign(prevState, nextState);
      }
    }
    // 对象模式，进行合并
    else if (typeof state !== 'undefined') {
      Object.assign(prevState, state);
    }
    this.applyUpdate();
  }

  // 发起更新，使用节流
  @useThrottle(16)
  private applyUpdate() {
    this.dispatchUpdate();
    this.postMessage(updateSymbol);
  }

  // 设置变量监听
  connect(connectFactory: (state: State & StateLoading) => Array<any>) {
    const [effects, effectsSet] = useState(connectFactory(this.state));
    this.onMessage(updateSymbol, () => {
      const nextEffects = connectFactory(this.state);

      // 监听的变量发送变化，则触发渲染
      if (nextEffects.some((nextEffect, i) => nextEffect !== effects[i])) {
        effectsSet(nextEffects);
      }
    });
    return effects;
  }

  // 监听消息
  onMessage(
    cmd: string,
    ready: (payload?) =>
      | void
      | any
      | Promise<any>
      | null
      | {
          ready?: (payload?) => void | any | Promise<any>;
          done?: (results?: Array<any>) => void;
          delay?: number;
        },
    done?: (results?: Array<any>) => void,
    delay?: number
  ) {
    // ready参数为option
    if (ready && typeof ready === 'object') {
      ({ ready, done, delay } = ready);
    }

    const { allMessages } = this;

    const message = useMemo(() => {
      const message: Message = {
        cmd,
        ready,
        done,
        delay,
        pending: false,
        payloads: null,
      };

      if (!allMessages[cmd]) {
        allMessages[cmd] = [];
      }

      allMessages[cmd].push(message);

      return message;
    }, []);

    message.ready = ready;
    message.done = done;

    useEffect(() => {
      return () => {
        const messages = allMessages[cmd];
        messages.splice(
          messages.findIndex((item) => item === message),
          1
        );
      };
    }, []);
  }

  // 发送消息
  postMessage(cmd: string, payload?) {
    const messages = this.allMessages[cmd];
    if (!messages) {
      return;
    }

    messages.forEach((message) => {
      const { ready, done, delay } = message;

      // 非异步合并任务执行
      if (!done) {
        return ready(payload);
      }

      // 异步合并消息
      if (!message.pending) {
        // 开始接收信息
        message.pending = true;
        message.payloads = [];

        const callDone = () => {
          // 完成任务后关闭状态
          message.pending = false;

          // 批量执行任务
          done(
            message.payloads.map((payload) =>
              ready ? ready(payload) : payload
            )
          );
        };

        if (delay) {
          setTimeout(() => callDone(), delay);
        } else {
          Promise.resolve().then(() => callDone());
        }
      }

      message.payloads.push(payload);
    });
  }
}

export default Bridge;
