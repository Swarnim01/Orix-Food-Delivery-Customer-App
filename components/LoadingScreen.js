import React from 'react';
import {
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { COLORS} from '../constants';
const LoadingScreen = () => {
  return (
    <ActivityIndicator size='large' color={COLORS.primary} style={styles.container}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    top:0,
    justifyContent: "center",
    alignItems:'center',
    backgroundColor:COLORS.white,
    opacity:0.6
  },
});
export default LoadingScreen;
