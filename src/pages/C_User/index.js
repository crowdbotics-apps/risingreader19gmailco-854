import React, { Component } from 'react';
import { View, Dimensions, Platform, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, C_TabBar } from 'app/components';

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

class C_UserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };
  }

  async componentDidMount() {
    const uid = await AsyncStorage.getItem('childId');

    this.ref = firebase
      .firestore()
      .collection('users')
      .doc(uid);

    const doc = await this.ref.get();
    const user = doc.data();

    this.setState({
      name: user.name
    });

    //alert(user.name)
  }

  toggleUsers = () => {
    this.props.navigation.navigate('users');
  };

  toggleSignOut = async () => {
    try {
      await AuthController.logout();
      await AsyncStorage.clear();
      this.props.navigation.navigate('auth');
    } catch (error) {
      alert(error.message);
    }

    //this.props.navigation.navigate('loading')
  };

  render() {
    return (
      <Container>
        <Navbar title="User" />
        <Content>
          <Separator bordered noTopBorder />
          <ListItem avatar>
            <Left>
              <Icon
                active
                type="FontAwesome"
                name="user"
                style={{ color: '#007AFF' }}
              />
            </Left>
            <Body>
              <View>
                <Text style={{ paddingBottom: 10 }}>{this.state.name}</Text>
                <Text numberOfLines={1} note>
                  Child
                </Text>
              </View>
            </Body>
            <Right>
              <Icon
                active
                type="FontAwesome"
                name="check"
                style={{ color: 'green' }}
              />
            </Right>
          </ListItem>

          <Separator bordered />
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
        <C_TabBar tab5={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

C_UserScreen.contextType = AppContext;

C_UserScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_UserScreen;
