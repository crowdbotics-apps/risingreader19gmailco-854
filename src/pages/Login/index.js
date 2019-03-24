import React from 'react';
import { View, Image, TextInput, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { AuthController } from 'app/services';
import { AppContext } from 'app/components';
import { alert } from 'app/utils/Alert';
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
import styles from './style';
import LogoIcon from 'app/assets/images/logo.png';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
const store = firebase.firestore();

const emailRegEx =
  // eslint-disable-next-line max-len
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  inputChanged = (type, value) => {
    this.setState({
      [type]: value
    });
  };

  goToSignUp = () => {
    this.props.navigation.navigate('signup');
  };

  goToForgotpswd = () => {
    this.props.navigation.navigate('forgotpassword');
  };

  login = async () => {
    let { email, password } = this.state;

    if (!emailRegEx.test(email)) {
      alert('Email is not valid!');
      return;
    }

    if (password.length < 6) {
      alert('Password should be longer than 6 letters!');
      return;
    }

    try {
      this.context.showLoading();
      let user = await AuthController.login({
        email,
        password
      });
      if (!user.user.emailVerified) {
        await AuthController.sendEmailVerification();
        alert('Verification email is sent. Please verify email first.');
      } else {
        this.props.navigation.navigate('main');
      }
      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  // Calling the following function will open the FB login dialogue:
  facebookLogin = async () => {
    try {
      this.context.showLoading();

      const result = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email'
      ]);

      if (result.isCancelled) {
        // handle this however suites the flow of your app
        //throw new Error('User cancelled request');
        return;
      }

      //console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // handle this however suites the flow of your app
        throw new Error(
          'Something went wrong obtaining the users access token'
        );
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken
      );

      // login with credential
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      let user = firebaseUserCredential.user;

      let ref = store.collection('users').doc(user.uid);
      const doc = await ref.get();
      if (!doc.exists) {
        //do

        doc.set({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          age: '',
          child: false,
          masterId: '',
          status: 1
        });
      }

      if (!user.email != null) {
        this.props.navigation.navigate('main');
      }

      this.context.hideLoading();

      //console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()))
    } catch (e) {
      this.context.hideLoading();
      alert(e.message);
    }
  };

  render() {
    return (
      <Container>
        <Content
          padder
          contentContainerStyle={{ alignItems: 'center', width: '100%' }}
        >
          <Image source={LogoIcon} style={styles.logo} resizeMode="contain" />
          {/* <Thumbnail large source={LogoIcon} /> */}
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
            <Item rounded style={styles.input}>
              <Icon type="FontAwesome" name="lock" />
              <Input
                placeholder="Password"
                value={this.state.password}
                autoCapitalize="none"
                secureTextEntry={true}
                onChangeText={(value) => this.inputChanged('password', value)}
              />
            </Item>
            <Grid>
              <Row>
                <Col>
                  <Button
                    rounded
                    primary
                    style={styles.button}
                    onPress={this.login}
                  >
                    <Text style={styles.buttonText}>Log In</Text>
                  </Button>
                </Col>
                <Col>
                  <Button
                    rounded
                    success
                    style={styles.button}
                    onPress={this.goToSignUp}
                  >
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>

            <Button
              transparent
              dark
              onPress={this.goToForgotpswd}
              style={{alignSelf:'center', marginBottom: 40}}
            >
              <Text>Forgot password?</Text>
            </Button>

            <Button
              rounded
              primary
              style={{alignSelf:'center', width: '100%'}}
              onPress={this.facebookLogin}
            >
              <Text style={styles.buttonText}>Login with Facebook</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
LoginScreen.contextType = AppContext;

LoginScreen.propTypes = {
  navigation: PropTypes.object
};

export default LoginScreen;
