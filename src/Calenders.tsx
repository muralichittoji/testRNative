import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Calenders = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calenders Screen</Text>
    </View>
  );
};

export default Calenders;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 20},
});
