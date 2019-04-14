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

class C_AchievementScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Navbar title="Achievement" />
        <Content />
        <C_TabBar tab1={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

C_AchievementScreen.contextType = AppContext;

C_AchievementScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_AchievementScreen;
