import React from 'react';

const AppContext = React.createContext({
  loading: false,
  activeChild: {}
});

export default AppContext;
