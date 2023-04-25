// Import necessary modules
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Friends from './Friends';

// Create a Stack Navigator for Friends page
const FriendsStack = createStackNavigator();

const FriendsNavigator = () => {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen
        name="Friends"
        component={Friends}
        options={{
          title: 'Friends',
          headerShown: false, // Hide header if needed
        }}
      />
      {/* Add more screens for the Friends page if needed */}
    </FriendsStack.Navigator>
  );
};

// Account component
const Account = () => {
  return (
    // Render Account component UI
    // Include FriendsNavigator component as a sub-screen
    <Tab.Screen
      name="Account"
      component={Account}
      options={{
        tabBarLabel: 'Account',
        tabBarIcon: ({ theme, size, focused }) => (
          <MaterialCommunityIcons
            name={focused ? 'account-circle' : 'account-circle-outline'}
            color="#e57507"
            size={size}
          />
        ),
      }}
      initialParams={{
        handleLogout: handleLogout,
        uid: uid,
        email: email,
      }}
    >
      {() => <FriendsNavigator />} {/* Render FriendsNavigator as a sub-screen */}
    </Tab.Screen>
  );
};

// Render the Tab Navigator with Account component including FriendsNavigator as a sub-screen
<Tab.Navigator activeTintColor="red">
  {/* ... Other Tab.Screen components ... */}
  <Tab.Screen name="Account" component={Account} />
</Tab.Navigator>
