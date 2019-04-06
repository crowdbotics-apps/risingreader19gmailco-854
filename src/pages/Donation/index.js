import React, { Component } from 'react';
import { View, TextInput, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import moment from 'moment';
import { AppContext, Navbar } from 'app/components';
import { AuthController } from 'app/services';
import { alert, success } from 'app/utils/Alert';
import { FirstBook_URL } from '../../constant';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text,
  Form,
  Item,
  Label,
  Input,
  Switch,
  Grid,
  Row,
  Col,
  DatePicker,
  H2,
  H3
} from 'native-base';

import styles from './style';

class DonationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  gotoURL = () => {
    Linking.canOpenURL(FirstBook_URL)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + FirstBook_URL);
        } else {
          return Linking.openURL(FirstBook_URL);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  leftHandler = () => {
    this.props.navigation.navigate('more');
  };

  render() {
    return (
      <Container>
        <Navbar
          left="arrow-back"
          leftHandler={this.leftHandler}
          title="Donation"
        />

        <Content padder>
          <H2>Give us a hand to get the life better</H2>
          <H3>By signing up First Book via link below</H3>
          <Button
            transparent
            onPress={this.gotoURL}
            //style={{ marginTop: 5, marginLeft: -25 }}
          >
            <H3>First Book</H3>
          </Button>
          <H3>Charity List:</H3>
          <Text>1. Pajama Program</Text>
          <Text>2. First Book</Text>
          <Text>3. Kids Need to Read</Text>
          <Text>4. Reach Out and Read</Text>
        </Content>
      </Container>
    );
  }
}

DonationScreen.contextType = AppContext;

DonationScreen.propTypes = {
  navigation: PropTypes.object
};

export default DonationScreen;
