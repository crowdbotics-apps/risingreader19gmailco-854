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


class LeaderBoardScreen extends Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    return (
      <Container>
        <Navbar title="Leader Board" />
        <Content />
        <TabBar tab4={true} navigation={this.props.navigation}/>
      </Container>
    );
  }
}

LeaderBoardScreen.contextType = AppContext;

LeaderBoardScreen.propTypes = {
  navigation: PropTypes.object
};

export default LeaderBoardScreen;
