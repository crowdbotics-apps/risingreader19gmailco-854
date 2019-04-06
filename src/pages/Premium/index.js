import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import firebase from 'react-native-firebase';
import { PricingCard } from 'react-native-elements';
import moment from 'moment';
import { AppContext, Navbar } from 'app/components';
import { AuthController } from 'app/services';
import { alert, success } from 'app/utils/Alert';

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
  DatePicker
} from 'native-base';

import styles from './style';

import stripe from 'tipsi-stripe';
import CardFormScreen from './CardForm';

stripe.setOptions({
  publishableKey: 'pk_test_P1UBQEaw3sE3nPXyl2zDC8pD',
  merchantId: '', // Optional
  androidPayMode: 'test' // Android only
});

class PremiumScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  leftHandler = () => {
    this.props.navigation.navigate('more');
  };

  render() {
    return (
      <Container>
        <Navbar
          left="arrow-back"
          leftHandler={this.leftHandler}
          title="Premium Plan"
        />

        <Content padder>
          <H3>
            Subcribe a Premium plan to have unlimited goals, stats, reminders,
            book tracking. It is also for charity
          </H3>
          <View style={{ flexDirection: 'row' }}>
            <PricingCard
              color="#4f9deb"
              title="Monthly"
              titleStyle={styles.title}
              price="$5"
              pricingStyle={styles.price}
              //info={['1 User', 'Basic Support', 'All Core Features']}
              button={{ title: 'GET' }}
              containerStyle={styles.container}
            />
            <PricingCard
              color="#4f9deb"
              title="Yearly"
              titleStyle={styles.title}
              price="$1.99"
              pricingStyle={styles.price}
              //info={['1 User', 'Basic Support', 'All Core Features']}
              button={{ title: 'GET' }}
              containerStyle={styles.container}
            />
            <PricingCard
              color="#4f9deb"
              title="Lifetime"
              titleStyle={styles.title}
              price="$150"
              pricingStyle={styles.price}
              //info={['1 User', 'Basic Support', 'All Core Features']}
              button={{ title: 'GET' }}
              containerStyle={styles.container}
            />
          </View>
          <CardFormScreen />
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
