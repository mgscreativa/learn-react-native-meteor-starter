import React from 'react';
import Meteor from 'react-native-meteor';
import config from './config/config';
import { AlertProvider } from './components/Alert';
import { Tabs } from './config/routes';

Meteor.connect(
  process.env.NODE_ENV !== 'development'
    ? config.prodServerUrl
    : config.devServerUrl,
);

const App = () => {
  return (
    <AlertProvider>
      <Tabs />
    </AlertProvider>
  );
};

export default App;
