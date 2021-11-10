import './reset.css';
import './index.less';

import { BridgeProvider } from '@react-better/bridge';
import React from 'react';
import ReactDom from 'react-dom';

import Router from '@/router';

function App() {
  return (
    <BridgeProvider>
      <Router />
    </BridgeProvider>
  );
}

function render() {
  ReactDom.render(<App />, document.getElementById('app'));
}

export default render;
