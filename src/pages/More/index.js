import React, { Component } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, TabBar } from 'app/components';

import styles from './style';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Badge,
  Left,
  Right,
  Body,
  Switch,
  Radio,
  Picker,
  Separator
} from 'native-base';
import { AuthController } from 'app/services';
import firebase from 'react-native-firebase';
//import console = require('console');

class MoreScreen extends Component {
  constructor(props) {
    super(props);
  }

  toggleUsers = () => {
    this.props.navigation.navigate('users');
  };

  toggleDonation = () => {
    this.props.navigation.navigate('donation');
  };

  togglePremium = () => {
    this.props.navigation.navigate('premium');
  };

  toggleParenting = () => {
    this.props.navigation.navigate('parenting');
  };

  toggleSignOut = async () => {
    try {
      await AuthController.logout();
      this.props.navigation.navigate('auth');
    } catch (error) {
      alert(error.message);
    }

    //this.props.navigation.navigate('loading')
  };

  render() {
    return (
      <Container>
        <Navbar title="More" />
        <Content>
          <Separator bordered noTopBorder />
          <ListItem icon onPress={this.toggleUsers}>
            <Left>
              <Button
                style={{ backgroundColor: '#007AFF' }}
                onPress={this.toggleUsers}
              >
                <Icon active type="FontAwesome" name="users" />
              </Button>
            </Left>
            <Body>
              <Button transparent onPress={this.toggleUsers}>
                <Text>Users</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && (
                <Icon
                  active
                  name="arrow-forward"
                  style={{ color: '#007AFF' }}
                />
              )}
            </Right>
          </ListItem>

          <ListItem icon onPress={this.toggleDonation}>
            <Left onPress={this.toggleDonation}>
              <Button
                style={{ backgroundColor: '#007AFF' }}
                onPress={this.toggleDonation}
              >
                <Icon active type="FontAwesome5" name="donate" />
              </Button>
            </Left>
            <Body>
              <Button transparent onPress={this.toggleDonation}>
                <Text>Donation</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && (
                <Icon
                  active
                  name="arrow-forward"
                  style={{ color: '#007AFF' }}
                />
              )}
            </Right>
          </ListItem>

          <ListItem icon onPress={this.togglePremium}>
            <Left>
              <Button
                style={{ backgroundColor: '#007AFF' }}
                onPress={this.togglePremium}
              >
                <Icon active type="FontAwesome5" name="arrow-alt-circle-up" />
              </Button>
            </Left>
            <Body>
              <Button transparent onPress={this.togglePremium}>
                <Text>Premium Plan</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && (
                <Icon
                  active
                  name="arrow-forward"
                  style={{ color: '#007AFF' }}
                />
              )}
            </Right>
          </ListItem>

          <ListItem icon onPress={this.toggleParenting}>
            <Left>
              <Button
                style={{ backgroundColor: '#007AFF' }}
                onPress={this.toggleParenting}
              >
                <Icon active type="FontAwesome5" name="newspaper" />
              </Button>
            </Left>
            <Body>
              <Button transparent onPress={this.toggleParenting}>
                <Text>Parenting Articles</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && (
                <Icon
                  active
                  name="arrow-forward"
                  style={{ color: '#007AFF' }}
                />
              )}
            </Right>
          </ListItem>

          <ListItem icon onPress={this.toggleSignOut}>
            <Left>
              <Button style={{ backgroundColor: '#007AFF' }}>
                <Icon active type="FontAwesome5" name="sign-out-alt" />
              </Button>
            </Left>
            <Body>
              <Button transparent onPress={this.toggleSignOut}>
                <Text>Sign Out</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && (
                <Icon
                  active
                  name="arrow-forward"
                  style={{ color: '#007AFF' }}
                />
              )}
            </Right>
          </ListItem>

          <Separator bordered />
        </Content>
        <TabBar tab5={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

MoreScreen.contextType = AppContext;

MoreScreen.propTypes = {
  navigation: PropTypes.object
};

export default MoreScreen;
