import React from 'react';

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'

import {Restaurant, OrderDelivery,loginsignup , Profile } from './screens';
import Tabs from './navigation/tab';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer for a long period of time']);
const Stack = createStackNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName='loginsignup'
        >
          <Stack.Screen name='loginsignup' component={loginsignup} />
          <Stack.Screen name='Home' component={Tabs} />
          <Stack.Screen name='Restaurant' component={Restaurant} />
          <Stack.Screen name='OrderDelivery' component={OrderDelivery} />
          <Stack.Screen name='myprofile' component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;