import React from 'react';
import { View, Image, TextInput, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
  Col,
  Thumbnail
} from 'native-base';
import { AppContext } from 'app/components';
import { AuthController } from 'app/services';
import { alert, success } from 'app/utils/Alert';

import styles from './style';
import LogoIcon from 'app/assets/images/logo.png';

const emailRegEx =
  // eslint-disable-next-line max-len
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class PasswordResetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  inputChanged = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  reset = async () => {
    if (!emailRegEx.test(this.state.email)) {
      alert('Email is not valid!');
      return;
    }
    try {
      this.context.showLoading();
      await AuthController.forgotPassword(this.state.email);
      this.context.hideLoading();
      success('Password Reset email is sent!');
      this.props.navigation.goBack();
    } catch (error) {
      alert(error.message);
      this.context.hideLoading();
    }
  };

  goToLogin = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container>
        <Content
          padder
          contentContainerStyle={{ alignItems: 'center', width: '100%' }}
        >
          <Image source={LogoIcon} style={styles.logo} resizeMode="contain" />
          <Form style={{ width: '90%' }}>
            <Item rounded style={styles.input}>
              <Icon type="FontAwesome" name="user" />
              <Input
                placeholder="Email"
                value={this.state.email}
                autoCapitalize="none"
                onChangeText={(value) => this.inputChanged('email', value)}
              />
            </Item>
            <Button rounded primary style={styles.button} onPress={this.reset}>
              <Text style={styles.buttonText}>Reset password</Text>
            </Button>

            <Button
              transparent
              dark
              onPress={this.goToLogin}
              style={{ alignSelf: 'center', marginBottom: 40 }}
            >
              <Text>Back to Log In</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

PasswordResetScreen.contextType = AppContext;

PasswordResetScreen.propTypes = {
  navigation: PropTypes.object
};

export default PasswordResetScreen;
