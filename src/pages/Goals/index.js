import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Alert } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { alert, success } from 'app/utils/Alert';
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

class GoalsScreen extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase
      .firestore()
      .collection('goals')
      .where('uid', '==', firebase.auth().currentUser.uid)
      .where('status', '==', 2);
    this.unsubscribe = null;

    this.state = {
      goals: []
    };
  }

  onCollectionUpdate = async (querySnapshot) => {
    try {
      this.context.showLoading();

      let goals = [];
      querySnapshot.forEach((doc) => {
        const {
          id,
          number,
          segGoal,
          segTime,
          start,
          end,
          uid,
          status,
          value
        } = doc.data();

        goals.push({
          id: id,
          doc, // DocumentSnapshot
          number,
          segGoal,
          segTime,
          start,
          end,
          uid,
          status,
          value
        });
      });

      this.setState({
        goals: goals
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

  leftHandler = () => {
    this.props.navigation.goBack();
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
          title="Goals"
        />
        <Content>
          <List>
            {this.state.goals.map((data, i) => {
              return (
                <ListItem avatar key={data.id}>
                  <Left>
                    <Icon
                      active
                      type="FontAwesome"
                      name="trophy"
                      style={{ color: '#007AFF' }}
                    />
                  </Left>
                  <Body>
                    <TouchableOpacity
                      onPress={this.editHandler.bind(
                        this,
                        data.key,
                        data.masterId
                      )}
                    >
                      <View>
                        <Text style={{ paddingBottom: 10 }}>
                          GOAL SUCCEEDED
                        </Text>
                        <Text numberOfLines={1} note>
                          Read {data.number}{' '}
                          {data.segGoal == 1 ? 'hours' : 'pages'}
                        </Text>
                        <Text numberOfLines={1} note>
                          Completed on {moment(data.end).format('LL')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Body>
                  <Right><Text> </Text></Right>
                </ListItem>
              );
            })}
          </List>
        </Content>
      </Container>
    );
  }
}

GoalsScreen.contextType = AppContext;

GoalsScreen.propTypes = {
  navigation: PropTypes.object
};

export default GoalsScreen;
