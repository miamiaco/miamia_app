import { StyleSheet } from 'react-native';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: colors.nude
  },
  itemContainer: {
    marginTop: 0,
    marginRight: 3,
    marginBottom: 10,
    marginLeft: 3,
  },
  caption: {
    paddingTop: 5,
    paddingLeft: 3,
    textAlign: 'left',
    fontFamily: fonts.semiBold,
    color: colors.semiBlue,
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
  },
});

export default styles;
