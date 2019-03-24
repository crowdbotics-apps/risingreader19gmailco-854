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


class GoalScreen extends Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    return (
      <Container>
        <Navbar title="Goals" />
        <Content />
        <TabBar tab2={true} navigation={this.props.navigation}/>
      </Container>
    );
  }
}

GoalScreen.contextType = AppContext;

GoalScreen.propTypes = {
  navigation: PropTypes.object
};

export default GoalScreen;
