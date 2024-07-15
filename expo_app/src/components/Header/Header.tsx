import React from 'react';
import { View, Image } from 'react-native';
import styles from './Header.styles';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../assets/images/miamia_vertical_logo.png')} />
      </View>
    </View>
  );
};

export default Header;
