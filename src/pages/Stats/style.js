import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../theme/Colors';

const dm = Dimensions.get('screen');
export default StyleSheet.create({
  body: {
    height: 70,
    justifyContent: 'center'
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100
  },
  value: {
    color: '#007AFF'
  }
});
