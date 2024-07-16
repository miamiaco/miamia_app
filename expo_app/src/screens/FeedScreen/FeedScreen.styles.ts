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
    marginRight: 4,
    marginBottom: 15,
    marginLeft: 4,
  },
  image: {
    borderRadius: 15,
  },
  caption: {
    paddingTop: 5,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'left',
    fontFamily: fonts.semiBold,
    color: colors.semiBlue,
  },
  username: {
    textAlign: 'left',
    fontFamily: fonts.medium,
    color: colors.semiBlue,
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
  },
});

export default styles;
