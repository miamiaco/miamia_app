// Header.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', 
    zIndex: 1000, 
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end', 
    paddingBottom: 10, 
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
});

export default styles;
