import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import firebase from 'react-native-firebase';
import { PricingCard } from 'react-native-elements';
import moment, { isMoment } from 'moment';
import { AppContext, Navbar } from 'app/components';
import { AuthController } from 'app/services';
import { alert, success } from 'app/utils/Alert';

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
  H3
} from 'native-base';

import styles from './style';

import stripe from 'tipsi-stripe';

const FIREBASE_FUNCTION =
  'https://us-central1-rising-readers.cloudfunctions.net/charge';

class PremiumScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null
    };
  }
  leftHandler = () => {
    this.props.navigation.navigate('more');
  };

  handleCardPayPress = async (plan, amount) => {
    try {
      //this.setState({ loading: true, token: null })
      this.context.showLoading();
      const token = await stripe.paymentRequestWithCardForm();

      if (token) {
        const res = ''; //await this.charge(token.tokenId, amount, 'USD');
        success('Charged. ' + res);
      } else throw 'Token is empty. Could not connect to Stripe.';

      //TODO: update user
      let ref = store.collection('users').doc(auth.currentUser.uid);
      await ref.update({
        plan: plan
      });

      this.setState({ token });

      this.context.hideLoading();
    } catch (error) {
      alert(error);
      this.context.hideLoading();
    }
  };

  test = () => {
    return;
  };

  // Function used by all three methods to send the charge data to your Firebase function
  charge = async (token, amount, currency) => {
    try {
      const res = await axios(FIREBASE_FUNCTION, {
        method: 'POST',
        body: JSON.stringify({
          token,
          charge: {
            amount,
            currency
          }
        })
      });

      const data = await res.json();
      data.body = JSON.parse(data.body);
      return data;
    } catch (error) {
      throw error;
    }

    // return '';
  };

  render() {
    const { token } = this.state;
    return (
      <Container>
        <Navbar
          left="arrow-back"
          leftHandler={this.leftHandler}
          title="Premium Plan"
        />

        <Content padder>
          <H3 style={{ textAlign: 'center', marginTop: 30 }}>
            Subcribe a Premium plan to have unlimited goals, stats, reminders,
            book tracking. It is also for charity
          </H3>
          <View style={{ flexDirection: 'row', marginTop: 50 }}>
            <PricingCard
              color="#4f9deb"
              title="Monthly"
              titleStyle={styles.title}
              price="$5"
              pricingStyle={styles.price}
              //info={['                   ']}
              button={{ title: 'GET' }}
              containerStyle={styles.container}
              onButtonPress={this.handleCardPayPress.bind(this, 5)}
            />
            <PricingCard
              color="#4f9deb"
              title="Yearly"
              titleStyle={styles.title}
              price="$23.9"
              pricingStyle={styles.price}
              //info={[' ']}
              button={{ title: 'GET' }}
              containerStyle={styles.container}
              onButtonPress={this.handleCardPayPress.bind(this, 23.9)}
            />
            <PricingCard
              color="#4f9deb"
              title="Lifetime"
              titleStyle={styles.title}
              price="$150"
              pricingStyle={styles.price}
              //info={['                 ']}
              button={{ title: 'GET' }}
              containerStyle={styles.container}
              onButtonPress={this.handleCardPayPress.bind(this, 150)}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

PremiumScreen.contextType = AppContext;

PremiumScreen.propTypes = {
  navigation: PropTypes.object
};

export default PremiumScreen;
