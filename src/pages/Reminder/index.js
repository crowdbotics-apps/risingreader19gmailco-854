import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';

import { AppContext, Navbar } from 'app/components';
import { AuthController } from 'app/services';
import { alert, success } from 'app/utils/Alert';

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
  Text,
  Form,
  Item,
  Label,
  Input,
  Switch,
  Grid,
  Row,
  Col
} from 'native-base';

import styles from './style';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      displayName: '',
      email: '',
      password: '',
      confirmpswd: '',
      age: '',
      child: false,
      masterId: ''
    };

    this.props.navigation.addListener('didFocus', this.onFocus);
  }

  onFocus = async (payload) => {
    const userId = this.props.navigation.getParam('userId', 'NEW');

    

    if (userId == 'NEW') {
    } else {
      const user = await AuthController.getUser(userId);

      this.setState({
        uid: user.id,
        displayName: user.name,
        email: user.email,
        password: user.password,
        confirmpswd: user.password,
        age: user.age,
        child: user.child,
        masterId: user.masterId,
      });

    }
  };

  leftHandler = () => {
    this.props.navigation.goBack();
  };

  saveHandler = async () => {
    if (!this.validate()) {
      return;
    }
    try {
      this.context.showLoading();

      const userId = this.props.navigation.getParam('userId', 'NEW');

      const masterId = this.props.navigation.getParam('masterId', '');

      if (userId == 'NEW') {
        await AuthController.createUser({
          name: this.state.displayName,
          password: this.state.password,
          email: this.state.email,
          age: this.state.age,
          child: this.state.child,
          masterId: firebase.auth().currentUser.uid
        });
      } else {
        
        await AuthController.updateUser({
          uid: this.state.uid,
          displayName: this.state.displayName,
          password: this.state.password,
          email: this.state.email,
          age: this.state.age,
          child: this.state.child,
          masterId: this.state.masterId,
        });
      }

      this.context.hideLoading();
      if (firebase.auth().currentUser.uid === userId){
        success('Please log in again.')
        this.props.navigation.navigate('auth');
      }
      else
        this.props.navigation.goBack();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  switchHandler = () => {};

  validate = () => {
    let { displayName, password, confirmpswd } = this.state;
    if (!displayName) {
      alert("Name can't be empty!");
      return false;
    }
    if ((!password && confirmpswd) || (password && !confirmpswd)) {
      alert("Password can't be empty!");
      return false;
    }
    if (password !== confirmpswd) {
      alert("Password doesn't match!");
      return false;
    }
    if (password && password.length < 6 && password.length > 0) {
      alert('Password should be longer than 6 letters!');
      return false;
    }
    return true;
  };

  inputChanged = (key) => (text) => {
    this.setState({ [key]: text });
  };

  childToggle = (value) => {
    this.setState({ child: value });
  };

  render() {
    const userId = this.props.navigation.getParam('userId', 'NEW');

    return (
      <Container>
        <Navbar left="arrow-back" leftHandler={this.leftHandler} title="User" />

        <Content padder>
          <Form>
            <Item rounded style={styles.input}>
              <Input
                placeholder="Name"
                autoFocus={true}
                autoCapitalize="none"
                value={this.state.displayName}
                onChangeText={this.inputChanged('displayName')}
              />
            </Item>
            <Item
              rounded
              style={
                userId != 'NEW' ? [styles.input, styles.disabled] : styles.input
              }
            >
              <Input
                placeholder="Email"
                autoCapitalize="none"
                editable={userId == 'NEW'}
                value={this.state.email}
                onChangeText={this.inputChanged('email')}
              />
            </Item>
            <Item rounded style={styles.input}>
              <Input
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={this.inputChanged('password')}
              />
            </Item>
            <Item rounded style={styles.input}>
              <Input
                placeholder="Confirm Password"
                autoCapitalize="none"
                secureTextEntry={true}
                value={this.state.confirmpswd}
                onChangeText={this.inputChanged('confirmpswd')}
              />
            </Item>
            <Grid>
              <Row>
                <Col>
                  <Item rounded style={styles.input}>
                    <Input
                      placeholder="Age"
                      autoCapitalize="none"
                      value={this.state.age}
                      keyboardType="numeric"
                      onChangeText={this.inputChanged('age')}
                    />
                  </Item>
                </Col>
                <Col>
                  <Row style={styles.switchWrapper}>
                    <Label>Is Child?</Label>
                    <Switch
                      style={styles.switch}
                      value={this.state.child}
                      trackColor="#50B948"
                      onValueChange={this.childToggle}
                    />
                  </Row>
                </Col>
              </Row>
            </Grid>

            <Button
              rounded
              primary
              style={styles.button}
              onPress={this.saveHandler}
            >
              <Text style={styles.save}>Save</Text>
            </Button>
            <Button
              rounded
              light
              style={styles.button}
              onPress={this.switchHandler}
            >
              <Text>Switch to this user</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

ProfileScreen.contextType = AppContext;

ProfileScreen.propTypes = {
  navigation: PropTypes.object
};

export default ProfileScreen;
