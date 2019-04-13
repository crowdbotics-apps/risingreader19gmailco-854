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
import { API } from 'app/services';
import stripe from 'tipsi-stripe';

const auth = firebase.auth();
const store = firebase.firestore();

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

    this.state = {
      amount: ''
    };
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

  inputChanged = (key) => (text) => {
    this.setState({ [key]: text });
  };

  donateHandler = async (amount) => {
    try {
      //this.setState({ loading: true, token: null })
      this.context.showLoading();
      const token = await stripe.paymentRequestWithCardForm();

      if (token) {
        const res = ''; //await API.charge(token.tokenId, amount, 'USD');
        success('Charged. ' + res);
      } else throw 'Token is empty. Could not connect to Stripe.';

      // //TODO: update transaction
      // let ref = store.collection('users').doc(auth.currentUser.uid);
      // await ref.update({
      //   plan: plan
      // });

      this.setState({ token, amount: '' });

      this.context.hideLoading();
    } catch (error) {
      alert(error);
      this.context.hideLoading();
    }
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
          <H2 style={{ textAlign: 'center', marginVertical: 30 }}>
            Give us a hand to get the life better
          </H2>

          <Form>
            <Item rounded style={styles.input}>
              <Input
                placeholder="Any dollars will help"
                autoFocus={true}
                //autoCapitalize="none"
                value={this.state.amount}
                onChangeText={this.inputChanged('amount')}
                textAlign={'center'}
              />
            </Item>

            <Button
              rounded
              primary
              style={styles.button}
              onPress={this.donateHandler.bind(this, this.state.amount)}
            >
              <Text style={styles.buttonText}>Donate</Text>
            </Button>
            {/* <H2>Or</H2>
            <Button
              primary
              onPress={this.gotoURL}
              style={{ marginTop: 30, alignSelf: 'center' }}
            >
              <Text>Sign Up On First Book</Text>
            </Button> */}
          </Form>

          <Text style={{ marginTop: 50 }}>Supporting Charity List:</Text>
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
