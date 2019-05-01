import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Alert } from 'react-native';
import PropTypes from 'prop-types';

let dm = Dimensions.get('screen');
import { alert, success } from 'app/utils/Alert';
import { AppContext, Navbar, TabBar } from 'app/components';

import styles from './style';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Right,
  Body,
  Grid,
  Row,
  Col
} from 'native-base';
import { TouchableHighlight } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { AuthController } from '../../services';

class UsersScreen extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase
      .firestore()
      .collection('users')
      .where('masterId', '==', firebase.auth().currentUser.uid)
      .where('status', '==', 1);
    this.unsubscribe = null;

    this.currentUserRef = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid);

    this.state = {
      users: []
    };
  }

  onCollectionUpdate = async (querySnapshot) => {
    try {
      this.context.showLoading();
      const boards = [];
      let users = [];
      querySnapshot.forEach((doc) => {
        const { name, child, masterId } = doc.data();

        users.push({
          key: doc.id,
          doc, // DocumentSnapshot
          name,
          child,
          masterId
        });
      });

      const currentUserDoc = await this.currentUserRef.get();
      const currentUserData = currentUserDoc.data();

      const currentUser = {
        key: currentUserData.id,
        doc: '',
        name: currentUserData.name,
        child: currentUserData.child,
        masterId: currentUserData.masterId
      };

      const list = [currentUser, ...users];

      this.setState({
        users: list
      });
      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  leftHandler = () => {
    this.props.navigation.navigate('more');
  };

  rightHandler = () => {
    this.props.navigation.navigate('profile');
  };

  editHandler = (id, masterId) => {
    this.props.navigation.navigate('profile', { userId: id, masterId });
  };

  deleteHandler = (id) => {
    Alert.alert(
      'Delete User',
      'Are you sure to delete this user?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'Yes', onPress: () => AuthController.deleteUser(id) }
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <Container>
        <Navbar
          left="arrow-back"
          leftHandler={this.leftHandler}
          title="Users"
          right="user-plus"
          rightHandler={this.rightHandler}
        />
        <Content>
          <List>
            {this.state.users.map((data, i) => {
              return (
                <ListItem avatar key={data.key}>
                  <Left>
                    <Thumbnail
                      square
                      style={{ marginBottom: 10 }}
                      source={require('../../assets/images/006-user.png')}
                    />
                  </Left>
                  <Body style={{ paddingBottom: 25 }}>
                    <TouchableOpacity
                      onPress={this.editHandler.bind(
                        this,
                        data.key,
                        data.masterId
                      )}
                    >
                      <View>
                        <Text style={{ paddingBottom: 10 }}>{data.name}</Text>
                        <Text numberOfLines={1} note>
                          {data.child == 1 ? 'Child' : 'Parent'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Body>
                  <Right>
                    <Grid style={{ width: 60 }}>
                      <Row>
                        {/* <Col>
                          {!data.masterId && (
                            <Icon active type="FontAwesome" name="check" />
                          )}
                        </Col> */}
                        <Col>
                          {data.masterId ? (
                            <TouchableOpacity
                              onPress={this.deleteHandler.bind(this, data.key)}
                            >
                              <Icon
                                active
                                type="FontAwesome"
                                name="trash"
                                style={{ color: 'red' }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <Icon
                              active
                              type="FontAwesome"
                              name="check"
                              style={{ color: 'green' }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Grid>
                  </Right>
                </ListItem>
              );
            })}
          </List>
        </Content>
        {/* <TabBar tab1={true} navigation={this.props.navigation}/> */}
      </Container>
    );
  }
}

UsersScreen.contextType = AppContext;

UsersScreen.propTypes = {
  navigation: PropTypes.object
};

export default UsersScreen;
