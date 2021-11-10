import './logger';
import main from './main';

main();

if (module.hot) {
  module.hot.accept('./main', () => {
    try {
      main();
    } catch (e) {
      console.error(e);
    }
  });
}
