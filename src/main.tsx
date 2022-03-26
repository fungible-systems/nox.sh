import * as React from 'react';
import App from './components/global-app/app';
import * as ReactDOM from 'react-dom/client';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
} else {
  throw 'Root element not found. Unable to render the App.';
}
