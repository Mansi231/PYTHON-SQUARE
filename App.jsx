import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native'
import React from 'react'
import MainStackNavigator from './src/navigation/navigation'
import Context from './src/context/Context';

const App = () => {
  return (
    <Context>
      <MainStackNavigator />
    </Context>
  )
}

export default App