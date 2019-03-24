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

class TabBar extends Component {
  toggleTab1 = () => {
    this.props.navigation.navigate('books');
  };

  toggleTab2 = () => {
    this.props.navigation.navigate('goal');
  };

  toggleTab3 = () => {
    this.props.navigation.navigate('stats');
  };

  toggleTab4 = () => {
    this.props.navigation.navigate('leaderBoard');
  };

  toggleTab5 = () => {
    this.props.navigation.navigate('more');
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
          <Button vertical active={tab3} onPress={this.toggleTab3}>
            <Icon active name="md-stats" />
          </Button>
          <Button vertical active={tab4} onPress={this.toggleTab4}>
            <Icon name="md-trophy" />
          </Button>
          <Button vertical active={tab5} onPress={this.toggleTab5}>
            <Icon name="ios-more" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

let styles = StyleSheet.create({});

TabBar.propTypes = {
  tab1: PropTypes.bool,
  tab2: PropTypes.bool,
  tab3: PropTypes.bool,
  tab4: PropTypes.bool,
  tab5: PropTypes.bool
};

export default TabBar;
