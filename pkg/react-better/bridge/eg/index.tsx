import React, { memo } from 'react';
import { Button } from 'antd';
import { Bridge, createAppBridge, createBridge, useBridge } from '../index';

type IBO = Bridge<BOState> & BOApi;

interface BOState {
  a: number;
  list: Array<{ id: number }>;
}

interface BOApi {
  getName?(): any;
}

class ClassUserBO extends Bridge<{ name: string }> {
  async fetchName(payload: { name: string }) {
    this.update({ name: `yyy${Math.random()}:${payload.name}` });
  }
}

const UserBO = createAppBridge(ClassUserBO, {
  name: 'aaa',
});

const MemoComp1 = memo(Comp1);
const MemoComp2 = memo(Comp2);

function View() {
  const BO = createBridge<BOState, BOApi>({
    a: 33,
    list: [],
  });

  return (
    <div>
      View
      <MemoComp1 BO={BO} />
    </div>
  );
}

function Comp1({ BO }: { BO: IBO }) {
  BO.connect((state) => [state.a]);

  BO.getName = () => '===== Comp1 ======';

  return (
    <div>
      Comp1:{BO.state.a}
      <div>##:{UserBO.state.name}</div>
      <MemoComp2 />
    </div>
  );
}

function Comp2() {
  const BO: IBO = useBridge();

  return (
    <div>
      Comp2
      <Button
        onClick={() => {
          BO.update({
            a: Math.random(),
          });

          UserBO.fetchName({ name: '@@@' }).then(() => {
            // ..
          });
        }}
        loading={UserBO.state.loading.fetchName}
      >
        改变状态
      </Button>
    </div>
  );
}

export default View;
