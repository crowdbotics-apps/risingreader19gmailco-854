import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import firebase from 'react-native-firebase';
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

class ParentingScreen extends Component {
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
          title="Parenting Articles"
        />

        <Content padder />
      </Container>
    );
  }
}

ParentingScreen.contextType = AppContext;

ParentingScreen.propTypes = {
  navigation: PropTypes.object
};

export default ParentingScreen;
