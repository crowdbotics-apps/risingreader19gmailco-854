//import React, { Component } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
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
  Text
} from 'native-base';

class Navbar extends Component {
  render() {
    let { icon, left, right, leftHandler, rightHandler, title, hasTabs } = this.props;

    return (
      <Header hasTabs={hasTabs}>
        {left ? (
          <Left>
            <Button transparent onPress={leftHandler}>
              <Icon name={left} />
            </Button>
          </Left>
        ) : (
          <Left />
        )}

        <Body>
          <Title>{title}</Title>
        </Body>
        {right ? (
          <Right>
            <Button transparent onPress={rightHandler}>
              <Icon name={right} type="FontAwesome5"/>
            </Button>
          </Right>
        ) : (
          <Right />
        )}
      </Header>
    );
  }
}

let styles = StyleSheet.create({});

Navbar.propTypes = {
  left: PropTypes.string,
  right: PropTypes.string,
  title: PropTypes.string,
  leftHandler: PropTypes.func,
  rightHandler: PropTypes.func
};

export default Navbar;
