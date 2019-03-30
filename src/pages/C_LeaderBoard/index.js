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


class C_LeaderBoardScreen extends Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    return (
      <Container>
        <Navbar title="Leader Board" />
        <Content />
        <C_TabBar tab1={true} navigation={this.props.navigation}/>
      </Container>
    );
  }
}

C_LeaderBoardScreen.contextType = AppContext;

C_LeaderBoardScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_LeaderBoardScreen;
