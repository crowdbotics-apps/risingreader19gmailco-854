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

class MoreScreen extends Component {
  constructor(props) {
    super(props);
  }

  toggleUsers = () => {
      this.props.navigation.navigate('users')
  }

  toggleSignOut = async () => {
    await AuthController.logout()
    this.props.navigation.navigate('loading')
}

  render() {
    return (
      <Container>
        <Navbar title="More" />
        <Content>
          <Separator bordered noTopBorder />
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: '#007AFF' }} onPress={this.toggleUsers}>
                <Icon active type="FontAwesome" name="users" />
              </Button>
            </Left>
            <Body>
              <Button transparent onPress={this.toggleUsers}>
                <Text>Users</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && <Icon active name="arrow-forward" style={{ color: '#007AFF' }}/>}
            </Right>
          </ListItem>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: '#007AFF' }}>
                <Icon active type="FontAwesome5" name="donate" />
              </Button>
            </Left>
            <Body>
              <Button transparent>
                <Text>Donation</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && <Icon active name="arrow-forward" style={{ color: '#007AFF' }}/>}
            </Right>
          </ListItem>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: '#007AFF' }}>
                <Icon active type="FontAwesome5" name="arrow-alt-circle-up" />
              </Button>
            </Left>
            <Body>
              <Button transparent>
                <Text>Premium Plan</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && <Icon active name="arrow-forward" style={{ color: '#007AFF' }}/>}
            </Right>
          </ListItem>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: '#007AFF' }}>
                <Icon active type="FontAwesome5" name="newspaper" />
              </Button>
            </Left>
            <Body>
              <Button transparent>
                <Text>Parenting Articles</Text>
              </Button>
            </Body>
            <Right>
              {Platform.OS === 'ios' && <Icon active name="arrow-forward" style={{ color: '#007AFF' }}/>}
            </Right>
          </ListItem>

          <ListItem icon>
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
              {Platform.OS === 'ios' && <Icon active name="arrow-forward" style={{ color: '#007AFF' }}/>}
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
