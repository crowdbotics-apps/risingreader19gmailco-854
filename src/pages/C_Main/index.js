import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, C_TabBar } from 'app/components';

import styles from './style';

import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text
} from 'native-base';


class C_MainScreen extends Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    return (
      <Container>
        <Navbar title="Books" />
        <Content />
        <C_TabBar tab1={true} navigation={this.props.navigation}/>
      </Container>
    );
  }
}

C_MainScreen.contextType = AppContext;

C_MainScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_MainScreen;
