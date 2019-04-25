//import React, { Component } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
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

class C_TabBar extends Component {
  toggleTab1 = () => {
    this.props.navigation.navigate('c_books');
  };

  toggleTab2 = () => {
    this.props.navigation.navigate('c_goal');
  };

  toggleTab3 = () => {
    this.props.navigation.navigate('c_leaderBoard');
  };

  toggleTab4 = () => {
    this.props.navigation.navigate('c_achievement');
  };

  toggleTab5 = () => {
    this.props.navigation.navigate('c_user');
  };

  render() {
    let { tab1, tab2, tab3, tab4, tab5 } = this.props;

    return (
      <Footer>
        <FooterTab>
          <Button vertical active={tab1} onPress={this.toggleTab1}>
            <Icon name="book" />
          </Button>
          <Button vertical active={tab2} onPress={this.toggleTab2}>
            <Icon type="FontAwesome" name="bullseye" />
          </Button>
          {/* <Button vertical active={tab3} onPress={this.toggleTab3}>
            <Icon active name="md-trophy" />
          </Button> */}
          <Button vertical active={tab4} onPress={this.toggleTab4}>
            <Icon type="FontAwesome5" name="award" />
          </Button>
          <Button vertical active={tab5} onPress={this.toggleTab5}>
            <Icon type="FontAwesome" name="user" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

let styles = StyleSheet.create({});

C_TabBar.propTypes = {
  tab1: PropTypes.bool,
  tab2: PropTypes.bool,
  tab3: PropTypes.bool,
  tab4: PropTypes.bool,
  tab5: PropTypes.bool
};

export default C_TabBar;
