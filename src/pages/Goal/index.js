import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import moment, { lang } from 'moment';
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
  Row,
  Picker,
  Form,
  Thumbnail
} from 'native-base';
import { Slider, Overlay } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { timeConvert } from '../../utils/Alert';

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
      age: '',
      count: '', //interval breakdown

      //seg_Y: 1,
      value_Y: 0,
      hasGoal_Y: false,
      start_Y: new Date(),
      end_Y: new Date(),
      segGoal_Y: 1,
      number_Y: '',
      goal_Y: null,
      visible_Y: false,
      age_Y: ''

      //visiblePlanGenerator: true
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

  componentWillUnmount() {
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

  onValueChange = (value: string) => {
    this.setState({
      age: value
    });
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
      this.setState({ visiblePlanGenerator: true });
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
        <Thumbnail
          square
          style={{ marginBottom: 5 }}
          source={require('../../assets/images/001-best.png')}
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
            textAlign={'center'}
          />
        </Item>
        <Item
          rounded
          style={{
            width: '99%',
            paddingVertical: 5,
            marginBottom: 20,
            justifyContent: 'center'
          }}
        >
          <DatePicker
            defaultDate={new Date()}
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
          style={{
            width: '99%',
            paddingVertical: 5,
            marginBottom: 20,
            justifyContent: 'center'
          }}
        >
          <DatePicker
            defaultDate={new Date()}
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
          <Text style={styles.buttonSaveText}>SAVE GOAL</Text>
        </Button>
      </Content>
    );
  };

  renderSetGoal_Y = () => {
    return (
      <Content contentContainerStyle={{ alignItems: 'center' }}>
        <Thumbnail
          square
          style={{ marginBottom: 5 }}
          source={require('../../assets/images/001-best.png')}
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
            textAlign={'center'}
          />
        </Item>
        <Item
          rounded
          style={{
            width: '99%',
            paddingVertical: 5,
            marginBottom: 20,
            justifyContent: 'center'
          }}
        >
          <DatePicker
            defaultDate={new Date()}
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
          style={{
            width: '99%',
            paddingVertical: 5,
            marginBottom: 20,
            justifyContent: 'center'
          }}
        >
          <DatePicker
            defaultDate={new Date()}
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
          <Text style={styles.buttonSaveText}>SAVE GOAL</Text>
        </Button>
      </Content>
    );
  };

  renderPlanGenerator = () => {
    return (
      <Content contentContainerStyle={{ alignItems: 'center' }}>
        <Thumbnail
          square
          style={{ marginBottom: 5 }}
          source={require('../../assets/images/004-medal-1.png')}
        />

        <Label style={{ marginVertical: 20 }}>Generate a reading plan</Label>

        <Item
          picker
          style={{
            marginBottom: 20,
            width: '98%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Picker
            mode="dropdown"
            iosHeader="Select your child age"
            iosIcon={<Icon name="arrow-down" />}
            style={{
              width: '70%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            textStyle={{ paddingLeft: 55 }}
            selectedValue={this.state.age}
            placeholder="Select your child age"
            onValueChange={this.onValueChange.bind(this)}
          >
            <Picker.Item label="4-6" value="5" />
            <Picker.Item label="6-8" value="7" />
            <Picker.Item label="8-10" value="9" />
            <Picker.Item label="10-12" value="11" />
            <Picker.Item label="12+" value="13" />
          </Picker>
        </Item>

        <Item rounded style={{ marginBottom: 20, alignItems: 'center' }}>
          <Input
            placeholder="Enter interval breakdown"
            autoCapitalize="none"
            keyboardType="numeric"
            value={this.state.count}
            onChangeText={this.inputChanged('count')}
          />
        </Item>
        <Button
          rounded
          primary
          style={styles.button}
          onPress={this.generatePlan}
        >
          <Text style={styles.buttonSaveText}>GENERATE PLAN</Text>
        </Button>
      </Content>
    );
  };

  generatePlan = async () => {
    try {
      this.setState({ visiblePlanGenerator: false });
      this.context.showLoading();
      await Database.generatePlan({
        number: this.state.number,
        segGoal: this.state.segGoal,
        segTime: this.state.seg,
        start: this.state.start,
        end: this.state.end,
        age: this.state.age,
        uid: firebase.auth().currentUser.uid,
        goalId: this.state.goal.id,
        count: this.state.count
      });

      this.context.hideLoading();
      // success('A plan has been generated. Now your child is able to see it.')
    } catch (error) {
      this.context.hideLoading();
      alert(error);
    }
  };

  renderMonthly = () => {
    return (
      <Content padder contentContainerStyle={{ alignItems: 'center' }}>
        <Grid style={{ width: '100%' }}>
          <Row style={{ justifyContent: 'center' }}>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
              {this.state.hasGoal ? 'IN PROGRESS' : 'NOT SET YET'}
            </Text>
          </Row>
          {this.state.hasGoal ? (
            <Row
              style={{
                width: '100%',
                justifyContent: 'flex-end',
                marginTop: -25
              }}
            >
              <TouchableOpacity onPress={this.toggleGoal}>
                <Icon
                  type="FontAwesome5"
                  name="edit"
                  style={{ color: '#007AFF' }}
                />
              </TouchableOpacity>
            </Row>
          ) : (
            <React.Fragment />
          )}
        </Grid>

        {this.state.hasGoal ? (
          <View
            style={{ alignItems: 'center', width: dm.width, marginTop: 30 }}
          >
            <Thumbnail
              large
              square
              style={{ marginBottom: 30 }}
              source={require('../../assets/images/001-best.png')}
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
                value={
                  this.state.segGoal === 2
                    ? this.state.value
                    : timeConvert(this.state.value)
                }
                onValueChange={(value) => this.setState({ value })}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                thumbTintColor={'#007AFF'}
                style={{ width: dm.width * 0.95, marginTop: 30 }}
                disabled
              />
              <H3
                style={{
                  alignSelf: 'center',
                  color: '#007AFF',
                  fontWeight: 'bold'
                }}
              >
                {this.state.value}/{this.state.number}{' '}
              </H3>
              <Text note style={{ alignSelf: 'center' }}>
                {this.state.segGoal === 1 ? 'hours' : 'pages'}
              </Text>

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
            onPress={this.toggleGoal}
          >
            <Icon type="FontAwesome5" name="trophy" />
            <Text style={styles.buttonText}>Set A Goal</Text>
          </Button>
        )}

        {/* <Button
          rounded
          primary
          style={[styles.button, { position:'absolute', bottom: 10, }]}
          onPress={this.toggleGoals}
        >
          <Icon type="FontAwesome5" name="trophy" />
          <Text style={styles.buttonText}>Completed Goals</Text>
        </Button> */}
        {/* <Button
          rounded
          primary
          style={styles.button}
          onPress={this.toggleReminder}
        >
          <Icon type="FontAwesome5" name="user-clock" />
          <Text style={styles.buttonText}>Reminders</Text>
        </Button> */}
      </Content>
    );
  };

  renderYearly = () => {
    return (
      <Content padder contentContainerStyle={{ alignItems: 'center' }}>
        <Grid style={{ width: '100%' }}>
          <Row style={{ justifyContent: 'center' }}>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
              {this.state.hasGoal_Y ? 'IN PROGRESS' : 'NOT SET YET'}
            </Text>
          </Row>
          {this.state.hasGoal_Y ? (
            <Row
              style={{
                width: '100%',
                justifyContent: 'flex-end',
                marginTop: -25
              }}
            >
              <TouchableOpacity onPress={this.toggleGoal_Y}>
                <Icon
                  type="FontAwesome5"
                  name="edit"
                  style={{ color: '#007AFF' }}
                />
              </TouchableOpacity>
            </Row>
          ) : (
            <React.Fragment />
          )}
        </Grid>

        {this.state.hasGoal_Y ? (
          <View
            style={{ alignItems: 'center', width: dm.width, marginTop: 30 }}
          >
            <Thumbnail
              large
              square
              style={{ marginBottom: 30 }}
              source={require('../../assets/images/001-best.png')}
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
                value={
                  this.state.segGoal === 2
                    ? this.state.value_Y
                    : timeConvert(this.state.value_Y)
                }
                onValueChange={(value) => this.setState({ value_Y: value })}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                thumbTintColor={'#007AFF'}
                style={{ width: dm.width * 0.95, marginTop: 30 }}
                disabled
              />
              <H3
                style={{
                  alignSelf: 'center',
                  color: '#007AFF',
                  fontWeight: 'bold'
                }}
              >
                {this.state.value_Y}/{this.state.number_Y}{' '}
              </H3>
              <Text note style={{ alignSelf: 'center' }}>
                {this.state.segGoal_Y === 1 ? 'hours' : 'pages'}
              </Text>

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
            <Icon type="FontAwesome5" name="trophy" />
            <Text style={styles.buttonText}>Set A Goal</Text>
          </Button>
        )}

        {/* <Button
          rounded
          primary
          style={styles.button}
          onPress={this.toggleReminder}
        >
          <Icon type="FontAwesome5" name="user-clock" />
          <Text style={styles.buttonText}>Reminders</Text>
        </Button> */}
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
            <Text>Monthly Goal</Text>
          </Button>
          <Button
            active={this.state.seg === 2 ? true : false}
            onPress={() => this.setState({ seg: 2 })}
          >
            <Text>Yearly Goal</Text>
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

        {this.state.visiblePlanGenerator && (
          <Overlay
            isVisible
            onBackdropPress={() =>
              this.setState({ visiblePlanGenerator: false })
            }
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="white"
            width="80%"
            height="40%"
          >
            {this.renderPlanGenerator()}
          </Overlay>
        )}

        {this.state.seg === 1 && this.renderMonthly()}
        {this.state.seg === 2 && this.renderYearly()}
        <Button
          rounded
          primary
          style={[styles.button, { marginTop: 30 }]}
          onPress={this.toggleGoals}
        >
          <Icon type="FontAwesome5" name="award" />
          <Text style={styles.buttonText}>Completed Goals</Text>
        </Button>
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
