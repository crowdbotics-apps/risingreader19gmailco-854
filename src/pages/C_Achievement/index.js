import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
let dm = Dimensions.get('screen');

import { AppContext, Navbar, C_TabBar } from 'app/components';
import { ACHIEVEMENTS } from '../../constant';

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
  Grid,
  Row,
  Thumbnail,
  Col,
  Label,
  H1
} from 'native-base';
import { Overlay } from 'react-native-elements';
import { Database } from '../../services';
import moment from 'moment';

class C_AchievementScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleAchievement: false,
      currentAchievement: '',

      list: ACHIEVEMENTS,
      achievements: []
    };

    //console.error(bookId)
    this.ref = firebase.firestore().collection('achievements');
    // .where('id', '==', bookId)
    // .where('status', '==', 1);

    this.unsubscribe = null;
  }

  onAchievementsUpdate = async (querySnapshot) => {
    try {
      this.context.showLoading();

      let book = null;
      const list = [];
      let row = [];

      //console.log(querySnapshot.)
      querySnapshot &&
        querySnapshot.forEach((doc) => {
          const {
            icon,
            id,
            imageURI,
            name,
            seg,
            status,
            title,
            value
          } = doc.data();

          console.table(doc.data());

          row.push({
            key: doc.id,
            doc, // DocumentSnapshot
            icon,
            imageURI,
            name,
            seg,
            status,
            title,
            value
          });

          if (row.length === 3) {
            list.push(row);
            row = [];
          }
        });
      if (row.length > 0) {
        list.push(row);
        row = [];
      }

      //book = books && books[0];

      if (list) {
        this.setState({
          list: list
        });
      }

      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  async componentDidMount() {
    // this.unsubscribe = this.ref.onSnapshot(this.onAchievementsUpdate);
    const childId = await AsyncStorage.getItem('childId');

    const list = await Database.getChildAchievements(childId);

    this.setState({
      achievements: list
    });
  }

  componentWillUnmount() {
    // if (this.unsubscribe) this.unsubscribe();
  }

  renderAchievement = () => {
    const { icon, title, name, date } = this.state.currentAchievement;
    return (
      <Content contentContainerStyle={{ alignItems: 'center' }}>
        <Thumbnail source={this.getImage(icon)} />

        <H1 style={{ marginTop: 20 }}>{name}</H1>

        <Label style={{ marginVertical: 20 }}>{title}</Label>

        <Button
          rounded
          primary
          style={{
            alignSelf: 'center',
            width: 100,
            marginTop: 10,
            justifyContent: 'center'
          }}
          onPress={this.okHandler}
        >
          <Text>OK</Text>
        </Button>
        {this.state.achieved ? (
          <Label style={{ marginVertical: 20 }}>
            Achieved on {moment(this.state.achieved).format('MM/DD/YYYY')}
          </Label>
        ) : (
          <React.Fragment />
        )}
      </Content>
    );
  };

  okHandler = () => {
    this.setState({
      visibleAchievement: false
      //currentAchievement: item
    });
  };

  openAchievement = (item, exist) => {
    this.setState({
      visibleAchievement: true,
      currentAchievement: item,
      achieved: exist && exist.date
    });
  };

  getImage = (id) => {
    switch (id) {
      case 1:
        return require('../../assets/achievements/001.png');
      case 2:
        return require('../../assets/achievements/002.png');
      case 3:
        return require('../../assets/achievements/003.png');
      case 4:
        return require('../../assets/achievements/004.png');
      case 5:
        return require('../../assets/achievements/005.png');
      case 6:
        return require('../../assets/achievements/006.png');
      case 7:
        return require('../../assets/achievements/007.png');
      case 8:
        return require('../../assets/achievements/008.png');
      case 9:
        return require('../../assets/achievements/009.png');
      case 10:
        return require('../../assets/achievements/010.png');
      case 11:
        return require('../../assets/achievements/011.png');
      case 12:
        return require('../../assets/achievements/012.png');
      default:
        return require('../../assets/achievements/012.png');
    }
  };

  render() {
    const { list } = this.state;

    return (
      <Container>
        <Navbar title="Achievement" />

        {this.state.visibleAchievement && (
          <Overlay
            isVisible
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="white"
            width="80%"
            height="40%"
            onBackdropPress={() => this.setState({ visibleAchievement: false })}
          >
            {this.renderAchievement()}
          </Overlay>
        )}

        <Content>
          <Grid>
            {list.map((row, i) => {
              return (
                <Row key={i}>
                  {row.map((item, j) => {
                    const exist = this.state.achievements.find(
                      (a) => a.aId === item.id
                    );

                    return (
                      <Col key={j}>
                        <TouchableOpacity
                          style={
                            !exist
                              ? styles.iconWrapper
                              : styles.iconWrapperActive
                          }
                          onPress={this.openAchievement.bind(this, item, exist)}
                        >
                          <Thumbnail small source={this.getImage(item.icon)} />
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }} note>
                          {item.name}
                        </Text>
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </Grid>
        </Content>

        <C_TabBar tab4={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

C_AchievementScreen.contextType = AppContext;

C_AchievementScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_AchievementScreen;
