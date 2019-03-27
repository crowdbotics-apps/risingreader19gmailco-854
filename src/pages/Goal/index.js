import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import { alert, success } from 'app/utils/Alert';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, TabBar } from 'app/components';
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
  Row
} from 'native-base';
import { Slider, Overlay } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

class GoalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seg: 1,
      value: 0,
      hasGoal: false,
      visible: false,
      start: new Date(),
      end: new Date(),
      segGoal: 1,
      number: '',
      goal: null,

      //seg_Y: 1,
      value_Y: 0,
      hasGoal_Y: false,
      start_Y: new Date(),
      end_Y: new Date(),
      segGoal_Y: 1,
      number_Y: '',
      goal_Y: null,
      visible_Y: false
    };

    this.goalRef = firebase
      .firestore()
      .collection('goals')
      .where('uid', '==', firebase.auth().currentUser.uid)
      .where('segTime', '==', 1)
      .where('status', '==', 1);

    this.goalRef_Y = firebase
      .firestore()
      .collection('goals')
      .where('uid', '==', firebase.auth().currentUser.uid)
      .where('segTime', '==', 2)
      .where('status', '==', 1);

    this.unsubscribe = null;
    this.unsubscribe_Y = null;
  }

  onGoalUpdate = async (querySnapshot) => {
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

      const goal = goals.length > 0 ? goals[0] : null;

      if (!goal) {
        this.context.hideLoading();
        return;
      }
      if (goal != null && goal.segTime == 1) {
        this.setState({
          goal: goal,
          seg: goal.segTime,
          value: goal.value,
          hasGoal: goal != null,
          start: goal.start,
          end: goal.end,
          segGoal: goal.segGoal,
          number: goal.number,
          goal: goal
        });
      } else {
        this.setState({
          goal_Y: goal,
          seg: goal.segTime,
          value_Y: goal.value,
          hasGoal_Y: goal != null,
          start_Y: goal.start,
          end_Y: goal.end,
          segGoal_Y: goal.segGoal,
          number_Y: goal.number,
          goal_Y: goal
        });
      }
      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  componentDidMount() {
    
    this.unsubscribe = this.goalRef.onSnapshot(this.onGoalUpdate);
    this.unsubscribe_Y = this.goalRef_Y.onSnapshot(this.onGoalUpdate);
  }

  componentWillMount() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.unsubscribe_Y) this.unsubscribe_Y();
  }

  setStartDate = (newDate) => {
    this.setState({ start: newDate });
  };

  setEndDate = (newDate) => {
    this.setState({ end: newDate });
  };

  setStartDate_Y = (newDate) => {
    this.setState({ start_Y: newDate });
  };

  setEndDate_Y = (newDate) => {
    this.setState({ end_Y: newDate });
  };

  inputChanged = (key) => (text) => {
    this.setState({ [key]: text });
  };

  validate = () => {
    let { start, end, number } = this.state;
    if (!start) {
      alert("start date can't be empty!");
      return false;
    }

    if (!end) {
      alert("end date can't be empty!");
      return false;
    }

    if (!number) {
      alert("number date can't be empty!");
      return false;
    }

    if (parseInt(number) <= 0) {
      alert('number should be larger than 0');
      return false;
    }

    if (end <= start) {
      alert('end date should be later than start date!');
      return false;
    }
    return true;
  };

  validate_Y = () => {
    let { start_Y, end_Y, number_Y } = this.state;
    if (!start_Y) {
      alert("start date can't be empty!");
      return false;
    }

    if (!end_Y) {
      alert("end date can't be empty!");
      return false;
    }

    if (end_Y <= start_Y) {
      alert('end date should be later than start date!');
      return false;
    }

    if (!number_Y) {
      alert("number date can't be empty!");
      return false;
    }

    if (parseInt(number_Y) <= 0) {
      alert('number should be larger than 0');
      return false;
    }
    return true;
  };

  saveGoal = async () => {
    if (!this.validate()) {
      return;
    }
    try {
      this.context.showLoading();
      this.setState({ visible: false });
      const { goal } = this.state;

      if (!goal) {
        await Database.createGoal({
          number: this.state.number,
          segGoal: this.state.segGoal,
          segTime: this.state.seg,
          start: this.state.start,
          end: this.state.end,
          uid: firebase.auth().currentUser.uid
        });
      } else {
        await Database.updateGoal({
          id: this.state.goal.id,
          number: this.state.number,
          segGoal: this.state.segGoal,
          //segTime: this.state.seg,
          start: this.state.start,
          end: this.state.end,
          value: this.state.value
          //uid: firebase.auth().currentUser.uid
        });
      }

      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  saveGoal_Y = async () => {
    if (!this.validate_Y()) {
      return;
    }
    try {
      this.context.showLoading();
      this.setState({ visible_Y: false });
      const { goal_Y } = this.state;

      if (!goal_Y) {
        await Database.createGoal({
          number: this.state.number_Y,
          segGoal: this.state.segGoal_Y,
          segTime: this.state.seg,
          start: this.state.start_Y,
          end: this.state.end_Y,
          uid: firebase.auth().currentUser.uid
        });
      } else {
        await Database.updateGoal({
          id: this.state.goal_Y.id,
          number: this.state.number_Y,
          segGoal: this.state.segGoal_Y,
          //segTime: this.state.seg,
          start: this.state.start_Y,
          end: this.state.end_Y,
          value: this.state.value_Y
          //uid: firebase.auth().currentUser.uid
        });
      }

      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  toggleGoal = () => {
    this.setState({ visible: true });
  };

  toggleGoal_Y = () => {
    this.setState({ visible_Y: true });
  };

  toggleGoals = () => {
    this.props.navigation.navigate('goals');
  };

  toggleReminder = () => {};

  renderSetGoal = () => {
    return (
      <Content contentContainerStyle={{ alignItems: 'center' }}>
        <Icon
          type="FontAwesome"
          name="trophy"
          style={{ fontSize: 60, color: '#007AFF' }}
        />

        <Segment style={{ marginBottom: 20 }}>
          <Button
            first
            active={this.state.segGoal === 1 ? true : false}
            onPress={() => this.setState({ segGoal: 1 })}
          >
            <Text>Goal in hours</Text>
          </Button>
          <Button
            active={this.state.segGoal === 2 ? true : false}
            onPress={() => this.setState({ segGoal: 2 })}
          >
            <Text>Goal in pages</Text>
          </Button>
        </Segment>

        <Item rounded style={{ marginBottom: 20 }}>
          <Input
            placeholder="Enter a number"
            autoCapitalize="none"
            keyboardType="numeric"
            value={this.state.number.toString()}
            onChangeText={this.inputChanged('number')}
          />
        </Item>
        <Item
          rounded
          style={{ width: '99%', paddingVertical: 5, marginBottom: 20 }}
        >
          <DatePicker
            defaultDate={new Date(2019, 1, 1)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2028, 12, 31)}
            locale={'en'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            placeHolderText={moment(this.state.start).format('LL')}
            //textStyle={{ color: "green" }}
            //placeHolderTextStyle={{ color: '#d3d3d3' }}
            onDateChange={this.setStartDate}
            disabled={false}
            formatChosenDate={(date) => {
              return moment(date).format('LL');
            }}
            //value={this.state.start}
          />
        </Item>
        <Item
          rounded
          style={{ width: '99%', paddingVertical: 5, marginBottom: 20 }}
        >
          <DatePicker
            defaultDate={new Date(2019, 1, 1)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2028, 12, 31)}
            locale={'en'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            placeHolderText={moment(this.state.end).format('LL')}
            //textStyle={{ color: "green" }}
            //placeHolderTextStyle={{ color: '#d3d3d3' }}
            onDateChange={this.setEndDate}
            disabled={false}
            formatChosenDate={(date) => {
              return moment(date).format('LL');
            }}
          />
        </Item>
        <Button rounded primary style={styles.button} onPress={this.saveGoal}>
          <Text style={styles.buttonText}>SAVE GOAL</Text>
        </Button>
      </Content>
    );
  };

  renderSetGoal_Y = () => {
    return (
      <Content contentContainerStyle={{ alignItems: 'center' }}>
        <Icon
          type="FontAwesome"
          name="trophy"
          style={{ fontSize: 60, color: '#007AFF' }}
        />

        <Segment style={{ marginBottom: 20 }}>
          <Button
            first
            active={this.state.segGoal_Y === 1 ? true : false}
            onPress={() => this.setState({ segGoal_Y: 1 })}
          >
            <Text>Goal in hours</Text>
          </Button>
          <Button
            active={this.state.segGoal_Y === 2 ? true : false}
            onPress={() => this.setState({ segGoal_Y: 2 })}
          >
            <Text>Goal in pages</Text>
          </Button>
        </Segment>

        <Item rounded style={{ marginBottom: 20 }}>
          <Input
            placeholder="Enter a number"
            autoCapitalize="none"
            keyboardType="numeric"
            value={this.state.number_Y.toString()}
            onChangeText={this.inputChanged('number_Y')}
          />
        </Item>
        <Item
          rounded
          style={{ width: '99%', paddingVertical: 5, marginBottom: 20 }}
        >
          <DatePicker
            defaultDate={new Date(2019, 1, 1)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2028, 12, 31)}
            locale={'en'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            placeHolderText={moment(this.state.start_Y).format('LL')}
            //textStyle={{ color: "green" }}
            //placeHolderTextStyle={{ color: '#d3d3d3' }}
            onDateChange={this.setStartDate_Y}
            disabled={false}
            formatChosenDate={(date) => {
              return moment(date).format('LL');
            }}
          />
        </Item>
        <Item
          rounded
          style={{ width: '99%', paddingVertical: 5, marginBottom: 20 }}
        >
          <DatePicker
            defaultDate={new Date(2019, 1, 1)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2028, 12, 31)}
            locale={'en'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            placeHolderText={moment(this.state.end_Y).format('LL')}
            //textStyle={{ color: "green" }}
            //placeHolderTextStyle={{ color: '#d3d3d3' }}
            onDateChange={this.setEndDate_Y}
            disabled={false}
            formatChosenDate={(date) => {
              return moment(date).format('LL');
            }}
          />
        </Item>
        <Button rounded primary style={styles.button} onPress={this.saveGoal_Y}>
          <Text style={styles.buttonText}>SAVE GOAL</Text>
        </Button>
      </Content>
    );
  };

  renderMonthly = () => {
    return (
      <Content padder contentContainerStyle={{ alignItems: 'center' }}>
        <Grid>
          <Col>
            <H1 style={{ alignSelf: 'center' }}>
              {this.state.hasGoal ? 'IN PROGRESS' : 'NOT SET YET'}
            </H1>
          </Col>
          <Col style={{ width: 35 }}>
            <TouchableOpacity onPress={this.toggleGoal}>
              <Icon type="FontAwesome5" name="edit" />
            </TouchableOpacity>
          </Col>
        </Grid>

        {this.state.hasGoal ? (
          <View
            style={{ alignItems: 'center', width: dm.width, marginTop: 30 }}
          >
            <Icon
              type="FontAwesome"
              name="trophy"
              style={{ fontSize: 60, color: '#007AFF', marginBottom: 30 }}
            />

            <Text>Started On {moment(this.state.start).format('LL')}</Text>
            <Text>Ends On {moment(this.state.end).format('LL')}</Text>
            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center'
              }}
            >
              <Slider
                value={this.state.value}
                onValueChange={(value) => this.setState({ value })}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                thumbTintColor={'#007AFF'}
                style={{ width: dm.width * 0.95, marginTop: 30 }}
              />
              <H3 style={{ alignSelf: 'center', color: '#007AFF' }}>
                {this.state.value}/{this.state.number}{' '}
                {this.state.segGoal === 1 ? 'hours' : 'pages'}
              </H3>

              <Label style={{ alignSelf: 'center', marginTop: 30 }}>
                Read some more to complete it!
              </Label>
            </View>
          </View>
        ) : (
          <Button
            rounded
            primary
            style={[styles.button, { marginTop: 50, marginBottom: 50 }]}
            onPress={this.toggleGoals}
          >
            <Icon type="FontAwesome5" name="trophy" />
            <Text style={styles.buttonText}>Set a goal</Text>
          </Button>
        )}

        <Button
          rounded
          primary
          style={[styles.button, { marginTop: 30 }]}
          onPress={this.toggleGoals}
        >
          <Icon type="FontAwesome5" name="award" />
          <Text style={styles.buttonText}>Completed Goals</Text>
        </Button>
        <Button
          rounded
          primary
          style={styles.button}
          onPress={this.toggleReminder}
        >
          <Icon type="FontAwesome5" name="user-clock" />
          <Text style={styles.buttonText}>Reminders</Text>
        </Button>
      </Content>
    );
  };

  renderYearly = () => {
    return (
      <Content padder contentContainerStyle={{ alignItems: 'center' }}>
        {/* <H1 style={{ alignSelf: 'center' }}>
          {this.state.hasGoal_Y ? 'IN PROGRESS' : 'NOT SET YET'}
        </H1>
        <TouchableOpacity onPress={this.toggleGoal_Y}>
          <Icon type="FontAwesome5" name="edit" />
        </TouchableOpacity> */}

        <Grid>
          <Col>
            <H1 style={{ alignSelf: 'center' }}>
              {this.state.hasGoal_Y ? 'IN PROGRESS' : 'NOT SET YET'}
            </H1>
          </Col>
          <Col style={{ width: 35 }}>
            <TouchableOpacity onPress={this.toggleGoal_Y}>
              <Icon type="FontAwesome5" name="edit" />
            </TouchableOpacity>
          </Col>
        </Grid>

        {this.state.hasGoal_Y ? (
          <View
            style={{ alignItems: 'center', width: dm.width, marginTop: 30 }}
          >
            <Icon
              type="FontAwesome"
              name="trophy"
              style={{ fontSize: 60, color: '#007AFF', marginBottom: 30 }}
            />

            <Text>Started On {moment(this.state.start_Y).format('LL')}</Text>
            <Text>Ends On {moment(this.state.end_Y).format('LL')}</Text>
            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center'
              }}
            >
              <Slider
                value={this.state.value_Y}
                onValueChange={(value) => this.setState({ value_Y: value })}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                thumbTintColor={'#007AFF'}
                style={{ width: dm.width * 0.95, marginTop: 30 }}
              />
              <H3 style={{ alignSelf: 'center', color: '#007AFF' }}>
                {this.state.value_Y}/{this.state.number_Y}{' '}
                {this.state.segGoal_Y === 1 ? 'hours' : 'pages'}
              </H3>

              <Label style={{ alignSelf: 'center', marginTop: 30 }}>
                Read some more to complete it!
              </Label>
            </View>
          </View>
        ) : (
          <Button
            rounded
            primary
            style={[styles.button, { marginTop: 50, marginBottom: 50 }]}
            onPress={this.toggleGoal_Y}
          >
            <Text style={styles.buttonText}>Set a goal</Text>
          </Button>
        )}

        <Button
          rounded
          primary
          style={[styles.button, { marginTop: 30 }]}
          onPress={this.toggleGoals}
        >
          <Icon type="FontAwesome5" name="award" />
          <Text style={styles.buttonText}>Completed Goals</Text>
        </Button>
        <Button
          rounded
          primary
          style={styles.button}
          onPress={this.toggleReminder}
        >
          <Icon type="FontAwesome5" name="user-clock" />
          <Text style={styles.buttonText}>Reminders</Text>
        </Button>
      </Content>
    );
  };
  render() {
    return (
      <Container style={{ width: '100%' }}>
        <Navbar title="Goals" hasTabs={true} />
        <Segment>
          <Button
            first
            active={this.state.seg === 1 ? true : false}
            onPress={() => this.setState({ seg: 1 })}
          >
            <Text>Monthly</Text>
          </Button>
          <Button
            active={this.state.seg === 2 ? true : false}
            onPress={() => this.setState({ seg: 2 })}
          >
            <Text>Yearly</Text>
          </Button>
        </Segment>

        {this.state.visible && (
          <Overlay
            isVisible
            onBackdropPress={() => this.setState({ visible: false })}
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="white"
            width="80%"
            height="50%"
          >
            {this.renderSetGoal()}
          </Overlay>
        )}

        {this.state.visible_Y && (
          <Overlay
            isVisible
            onBackdropPress={() => this.setState({ visible_Y: false })}
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="white"
            width="80%"
            height="50%"
          >
            {this.renderSetGoal_Y()}
          </Overlay>
        )}

        {this.state.seg === 1 && this.renderMonthly()}
        {this.state.seg === 2 && this.renderYearly()}

        <TabBar tab2={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

GoalScreen.contextType = AppContext;

GoalScreen.propTypes = {
  navigation: PropTypes.object
};

export default GoalScreen;
