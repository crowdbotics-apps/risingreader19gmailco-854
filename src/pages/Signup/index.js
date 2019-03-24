import React from 'react';
import { View, Image, TextInput, Linking, ScrollView } from 'react-native';
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

import PropTypes from 'prop-types';
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { AppContext } from 'app/components';
import { AuthController } from 'app/services';
import { alert, success } from 'app/utils/Alert';

import styles from './style';
import LogoIcon from 'app/assets/images/logo.png';
import { ToS_URL } from '../../constant';

const emailRegEx =
  // eslint-disable-next-line max-len
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmpswd: '',
      agreeTerms: false,
      allowResendEmail: true,
      step: 1
    };
  }

  inputChanged = (type, value) => {
    this.setState({
      [type]: value
    });
  };

  agreeTerms = () => {
    this.setState({
      agreeTerms: !this.state.agreeTerms
    });
  };

  validate = () => {
    let { name, email, password, confirmpswd, agreeTerms } = this.state;
    if (!name) {
      alert("Name can't be empty!");
      return false;
    }
    if (!email) {
      alert("Email can't be empty!");
      return false;
    }
    if (!emailRegEx.test(email)) {
      alert('Email is not valid!');
      return false;
    }
    if (!password) {
      alert("Password can't be empty!");
      return false;
    }
    if (password !== confirmpswd) {
      alert("Password doesn't match!");
      return false;
    }
    if (password.length < 6) {
      alert('Password should be longer than 6 letters!');
      return false;
    }
    if (!agreeTerms) {
      alert('To register, you have to agree our Terms of Conditions.');
      return false;
    }
    return true;
  };

  signup = async () => {
    // fields validation
    if (!this.validate()) {
      return;
    }
    let { name, email, password } = this.state;
    try {
      this.context.showLoading();
      let user = await AuthController.signup({
        name,
        email,
        password
      });
      this.context.hideLoading();
      await this.setState({
        step: 2,
        allowResendEmail: false
      });
      setTimeout(() => {
        this.setState({ allowResendEmail: true });
      }, 60000);
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  goToLogin = () => {
    this.props.navigation.goBack();
  };

  resendVerification = async () => {
    try {
      this.context.showLoading();
      await AuthController.sendEmailVerification();
      success(`Verification email was resent to ${this.state.email}`);
      this.context.hideLoading();
      await this.setState({ allowResendEmail: false });
      setTimeout(() => {
        this.setState({ allowResendEmail: true });
      }, 60000);
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  termsPressed = () => {
    Linking.canOpenURL(ToS_URL)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + ToS_URL);
        } else {
          return Linking.openURL(ToS_URL);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  renderSignup = () => {
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
                placeholder="Name *"
                value={this.state.name}
                autoCapitalize="none"
                onChangeText={(value) => this.inputChanged('name', value)}
              />
            </Item>

            <Item rounded style={styles.input}>
              <Icon type="FontAwesome5" name="envelope" />
              <Input
                placeholder="Email *"
                value={this.state.email}
                autoCapitalize="none"
                onChangeText={(value) => this.inputChanged('email', value)}
              />
            </Item>
            <Item rounded style={styles.input}>
              <Icon type="FontAwesome" name="lock" />
              <Input
                placeholder="Password *"
                value={this.state.password}
                autoCapitalize="none"
                onChangeText={(value) => this.inputChanged('password', value)}
                secureTextEntry={true}
              />
            </Item>
            <Item rounded style={styles.input}>
              <Icon type="FontAwesome" name="lock" />
              <Input
                placeholder="Confirm Password *"
                value={this.state.confirmpswd}
                autoCapitalize="none"
                onChangeText={(value) =>
                  this.inputChanged('confirmpswd', value)
                }
                secureTextEntry={true}
              />
            </Item>
            <Grid>
              <Row>
              <CheckBox
                checked={this.state.agreeTerms}
                onPress={this.agreeTerms}
                
              />
              <Button
                transparent
                onPress={this.termsPressed}
                style={{marginTop: 5, marginLeft: -25}}
              >
                <Text style={{textAlign: 'left', padding: 0}}>Agree to Terms and Conditions</Text>
              </Button>
              </Row>
            </Grid>
              
            <Button rounded primary style={styles.button} onPress={this.signup}>
              <Text style={styles.buttonText}>Register Me</Text>
            </Button>

            <Button
              transparent
              dark
              onPress={this.goToLogin}
              style={{ alignSelf: 'center', marginBottom: 40 }}
            >
              <Text>Already have an account? Log In</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  };

  renderVerifcation = () => {
    return (
      <Container>
        <Content
          padder
          contentContainerStyle={{ alignItems: 'center', width: '100%' }}
        >
          <Image source={LogoIcon} style={styles.logo} resizeMode="contain" />

          <Form style={{ width: '90%', alignItems: 'center' }}>
            <Label>We sent verification email.</Label>
            <Button
              rounded
              primary
              style={{marginVertical: 30}}
              onPress={this.resendVerification}
              disabled={!this.state.allowResendEmail}
            >
              <Text style={styles.buttonText}>Resend verification email</Text>
            </Button>

            <Button
              rounded
              primary
              style={styles.button}
              onPress={this.goToLogin}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  };

  render() {
    if (this.state.step === 1) {
      return this.renderSignup();
    } else {
      return this.renderVerifcation();
    }
  }
}

SignupScreen.contextType = AppContext;

SignupScreen.propTypes = {
  navigation: PropTypes.object
};

export default SignupScreen;
