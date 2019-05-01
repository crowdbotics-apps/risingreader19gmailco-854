import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import { Database } from 'app/services';
import { alert, success } from 'app/utils/Alert';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, TabBar } from 'app/components';

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
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Segment
} from 'native-base';

class StatsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bestPages: 0,
      bestTime: 0,
      bookNo: 0,
      longStreak: 0,
      pageRead: 0,
      speedRead: 0,
      totalTime: 0,
      seg: 1 //1: all, 2: 2019
    };
  }

  async componentDidMount() {
    try {
      const item = await Database.getStats();

      if (!item) return;

      const {
        bestPages,
        bestTime,
        bookNo,
        longStreak,
        pageRead,
        speedRead,
        totalTime
      } = item;

      this.setState({
        bestPages,
        bestTime,
        bookNo,
        longStreak,
        pageRead,
        speedRead,
        totalTime
      });
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    const {
      bestPages,
      bestTime,
      bookNo,
      longStreak,
      pageRead,
      speedRead,
      totalTime
    } = this.state;

    return (
      <Container>
        <Navbar title="Stats" hasTabs={true} />
        <Segment>
          <Button
            first
            active={this.state.seg === 1 ? true : false}
            onPress={() => this.setState({ seg: 1 })}
          >
            <Text>All</Text>
          </Button>
          <Button
            active={this.state.seg === 2 ? true : false}
            onPress={() => this.setState({ seg: 2 })}
          >
            <Text>2019</Text>
          </Button>
        </Segment>
        <Content>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/002-open-book.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Pages read so far</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>{pageRead} </Text>
                <Text note>pages</Text>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/004-hourglass.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Total time so far</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>
                  {Math.floor(totalTime / 3600)}{' '}
                </Text>
                <Text note>hours</Text>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/003-stopwatch.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Reading speed</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>
                  {totalTime > 0
                    ? `${Math.round(pageRead / (totalTime / 3600))}`
                    : '0'}
                </Text>
                <Text note>pages/h</Text>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/001-books.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Books read so far</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>{bookNo} </Text>
                <Text note>books</Text>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/005-scholarship.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Best read day in pages</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>{bestPages} </Text>
                <Text note>pages</Text>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/006-time-passing.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Best read day in time</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>{Math.floor(bestTime / 60)} </Text>
                <Text note>mins</Text>
              </Right>
            </ListItem>
            {/* <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/007-schedule.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Longest reading streak</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>{longStreak}</Text>
                <Text note>days</Text>
              </Right>
            </ListItem> */}
          </List>
        </Content>
        <TabBar tab3={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

StatsScreen.contextType = AppContext;

StatsScreen.propTypes = {
  navigation: PropTypes.object
};

export default StatsScreen;
