import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firebase from 'firebase/app';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={notification => notification.notificationId}
          renderItem={({ item }) => (
            <View style={styles.notification}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.body}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noNotifications}>No notifications yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  notification: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
  },
  noNotifications: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export { Notifications };
