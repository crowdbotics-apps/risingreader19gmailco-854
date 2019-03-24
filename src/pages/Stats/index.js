import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, TabBar } from 'app/components';

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


class StatsScreen extends Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    return (
      <Container>
        <Navbar title="Stats" />
        <Content />
        <TabBar tab3={true} navigation={this.props.navigation}/>
      </Container>
    );
  }
}

StatsScreen.contextType = AppContext;

StatsScreen.propTypes = {
  navigation: PropTypes.object
};

export default StatsScreen;
