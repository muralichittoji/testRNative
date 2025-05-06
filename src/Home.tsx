import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Profiles from './Profiles';
import Calenders from './Calenders';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator();
const NOTIF_KEY = 'CALENDAR_SEEN';

export default function Home() {
  const [calendarSeen, setCalendarSeen] = useState(true);

  // Load badge status on app startup
  useEffect(() => {
    const checkSeen = async () => {
      const seen = await AsyncStorage.getItem(NOTIF_KEY);
      setCalendarSeen(seen === 'true');
    };
    checkSeen();
  }, []);

  // Mark calendar tab as seen when it is focused
  const handleCalendarFocus = async () => {
    setCalendarSeen(true); // Remove red dot
    await AsyncStorage.setItem(NOTIF_KEY, 'true'); // Mark calendar as seen
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Tab.Navigator>
        <Tab.Screen
          name="User"
          component={Profiles}
          options={{
            tabBarIcon: ({color, size}) => (
              <Text style={{fontSize: size, color}}>{'👤'}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={(props: any) => (
            <Calenders {...props} onFocus={handleCalendarFocus} />
          )}
          options={{
            tabBarIcon: ({color, size}) => (
              <Text style={{fontSize: size, color}}>{'🗓️'}</Text>
            ),
            tabBarBadge: calendarSeen ? undefined : '•',
            tabBarBadgeStyle: {backgroundColor: 'red', fontSize: 20},
          }}
          listeners={{
            tabPress: handleCalendarFocus,
          }}
        />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}
