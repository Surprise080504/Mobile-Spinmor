import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import AppTheme from './AppTheme';
import AppRouter from './Router/AppRouter';
import store from '../store';

const AppProvider = () => {
  return (
    <Provider store={store}>
      <AppTheme>
        <Router>
          <AppRouter />
        </Router>
      </AppTheme>
    </Provider>
  );
};

export default AppProvider;
