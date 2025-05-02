/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profiles from './Profiles';
import Calenders from './Calenders';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Profiles"
        screenOptions={() => ({
          headerShown: false,
          tabBarIcon: ({color, size}) => {
            // let iconName;

            // if (route.name === 'Profiles') {
            //   iconName = focused ? 'person' : 'person-outline';
            // }
            // if (route.name === 'Calenders') {
            //   iconName = focused ? 'calendar-days' : 'calendar-outline';
            // }

            return <Icon name={'user'} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066cc',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Profiles" component={Profiles} />
        <Tab.Screen name="Calenders" component={Calenders} />
      </Tab.Navigator>
    </View>
  );
};

export default Home;
