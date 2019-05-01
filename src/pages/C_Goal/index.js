import React, { Component } from 'react';
import { View, Dimensions, AsyncStorage } from 'react-native';
import moment, { lang } from 'moment';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import { alert, success, timeConvert } from 'app/utils/Alert';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, C_TabBar } from 'app/components';
import { Database } from 'app/services';

import styles from './style';

import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Title,
  Left,
  Right,
  Body,
  Segment,
  Label,
  H1,
  H3,
  Input,
  DatePicker,
  Item,
  Grid,
  Col,
  Row,
  List,
  ListItem
} from 'native-base';
import { Slider, Overlay, Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

class C_GoalScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      segGoal: '',
      childId: ''
    };

    this.ref = firebase
      .firestore()
      .collection('plans')
      .where('uid', '==', firebase.auth().currentUser.uid)
      //.where('goalId', '==', firebase.auth().currentUser.uid)
      .where('status', '==', 1);

    this.unsubscribe = null;
  }

  onUpdate = async (querySnapshot) => {
    try {
      this.context.showLoading();

      let plans = [];
      querySnapshot.forEach((doc) => {
        const { id, segGoal, uid, status, tasks } = doc.data();

        plans.push({
          id,
          segGoal,
          uid,
          status,
          tasks
        });
      });

      const plan = plans.length > 0 ? plans[0] : null;

      if (!plan) {
        this.context.hideLoading();
        return;
      }

      this.setState({
        tasks: this.sortTasks([...plan.tasks]),
        segGoal: plan.segGoal
      });

      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  sortTasks = (tasks) => {
    for (i = 0; i < tasks.length; i++) {
      for (j = i + 1; j < tasks.length; j++)
        if (tasks[i].id > tasks[j].id) {
          const temp = tasks[j];
          tasks[j] = tasks[i];
          tasks[i] = temp;
        }
    }
    return tasks;
  };

  async componentDidMount() {
    const childId = await AsyncStorage.getItem('childId');

    this.setState({
      childId: childId
    });

    this.unsubscribe = this.ref.onSnapshot(this.onUpdate);
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    return (
      <Container style={{ width: '100%' }}>
        <Navbar title="Reading Plan" />
        <Content>
          <List>
            {this.state.tasks.map((data, i) => {
              const { task, end, start, number } = data;

              let value = 0;

              if (this.state.segGoal === 1)
                value = data[this.state.childId]
                  ? timeConvert(data[this.state.childId])
                  : 0;
              else
                value = data[this.state.childId] ? data[this.state.childId] : 0;

              {
                /* if (progress) {
                const p = progress.filter((v, i) => {
                  return v.uid === this.state.childId;
                });

                value = p != null ? parseInt(p[0].value) : 0;
                //console.error(p, value)
              } */
              }

              return (
                <ListItem avatar key={i}>
                  <Left>
                    <Avatar
                      size="large"
                      rounded
                      title={data.id.toString()}
                      //onPress={() => console.log("Works!")}
                      activeOpacity={0.7}
                    />
                  </Left>
                  <Body>
                    <View>
                      <Text>Started On {moment(start).format('LL')}</Text>
                      <Text>Ends On {moment(end).format('LL')}</Text>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'stretch',
                          justifyContent: 'center'
                        }}
                      >
                        <Slider
                          value={value}
                          minimumValue={0}
                          maximumValue={number}
                          step={1}
                          thumbTintColor={'#007AFF'}
                          style={{ marginTop: 10 }} //width: dm.width * 0.95,
                          disabled
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center'
                          }}
                        >
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: '#007AFF',
                              fontWeight: 'bold'
                            }}
                          >
                            {value}/{number}{' '}
                          </Text>
                          <Text note>
                            {this.state.segGoal === 1 ? 'hours' : 'pages'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Body>
                  <Right>
                    <React.Fragment />
                  </Right>
                </ListItem>
              );
            })}
          </List>
        </Content>

        <C_TabBar tab2={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

C_GoalScreen.contextType = AppContext;

C_GoalScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_GoalScreen;
