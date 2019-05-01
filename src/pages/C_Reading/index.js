import React, { Component } from 'react';
import { View, TextInput, Alert, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import moment from 'moment';
import { AppContext, Navbar } from 'app/components';
import { Database } from 'app/services';
import { alert, success } from 'app/utils/Alert';
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid';

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
  DatePicker,
  Thumbnail,
  List,
  ListItem,
  H1
} from 'native-base';
import { Overlay } from 'react-native-elements';
import timer from 'react-native-timer';

import styles from './style';

class C_ReadingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      book: null,

      visibleEndSession: false,
      visibleTimer: false,
      visibleAchieve: false,

      interval: 0,
      timerStarted: false,
      page: '',
      error: '',

      childId: '',
      currentAchievement: null
    };

    const bookId = this.props.navigation.getParam('bookId', '');

    //console.error(bookId)
    this.bookRef = firebase
      .firestore()
      .collection('books')
      .where('id', '==', bookId)
      .where('status', '==', 1);

    this.unsubscribe = null;
  }

  onBookUpdate = async (querySnapshot) => {
    try {
      this.context.showLoading();

      let book = null;
      const books = [];
      //console.error(querySnapshot.empty)
      querySnapshot &&
        querySnapshot.forEach((doc) => {
          const { title, author, pages, read, filename, duration } = doc.data();

          books.push({
            key: doc.id,
            doc, // DocumentSnapshot
            title,
            author,
            pages,
            read,
            filename,
            duration
          });
        });

      book = books && books[0];

      if (book) {
        this.setState({
          bookId: book.id,
          title: book.title,
          author: book.author,
          pages: book.pages,
          read: book.read,
          duration: book.duration,
          uri: `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/${
            book.filename
          }`
        });
      }

      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  async componentDidMount() {
    this.unsubscribe = this.bookRef.onSnapshot(this.onBookUpdate);

    const uid = await AsyncStorage.getItem('childId');
    this.setState({
      childId: uid
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  leftHandler = () => {
    this.props.navigation.goBack();
  };

  readHandler = (id) => {
    // this.props.navigation.navigate('c_progress', { bookId: id });
    this.setState({ visibleTimer: true });
  };

  editHandler = (id) => {
    this.props.navigation.navigate('c_book', { bookId: id });
  };

  inputChanged = (key) => (text) => {
    this.setState({ [key]: text });
  };

  timerStart = () => {
    if (!this.state.timerStarted) {
      this.setState({ timerStarted: true });
      timer.setInterval(
        this,
        'timer',
        () => {
          this.setState({ interval: this.state.interval + 1 });
        },
        1000
      );
    } else {
      this.setState({ timerStarted: false });
      timer.clearInterval(this);
    }
  };

  secondsToHms = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 9 ? h + ':' : h > 0 ? '0' + h + ':' : '00:';
    var mDisplay = m > 9 ? m + ':' : m > 0 ? '0' + m + ':' : '00:';
    var sDisplay = s > 9 ? s : s > 0 ? '0' + s : '00';
    return hDisplay + mDisplay + sDisplay;
  };

  timerEnd = () => {
    timer.clearInterval(this);
    this.setState({
      timerStarted: false,
      visibleTimer: false,
      visibleEndSession: true
    });
  };

  renderAchievement = () => {
    const { icon, title, name } = this.state.currentAchievement;
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
      </Content>
    );
  };

  renderTimer = () => {
    return (
      <Content contentContainerStyle={{ alignItems: 'center' }}>
        <Icon
          type="FontAwesome5"
          name="hourglass-half" //hourglass-half
          style={{ fontSize: 60, color: '#007AFF' }}
        />

        <Label style={{ marginVertical: 20 }}>Start your reading</Label>

        <H1>{this.secondsToHms(this.state.interval)}</H1>

        <Grid style={{ marginVertical: 20 }}>
          <Col>
            <Button
              rounded
              primary
              style={{ alignSelf: 'center' }}
              onPress={this.timerStart}
            >
              <Text style={styles.buttonSaveText}>
                {this.state.timerStarted ? 'PAUSE' : 'START'}
              </Text>
            </Button>
          </Col>
          <Col>
            <Button
              rounded
              primary
              style={{ alignSelf: 'center' }}
              onPress={this.timerEnd}
            >
              <Text style={styles.buttonSaveText}>STOP</Text>
            </Button>
          </Col>
        </Grid>
      </Content>
    );
  };

  renderEndSession = () => {
    return (
      <Content contentContainerStyle={{ alignItems: 'center' }}>
        <Icon
          type="FontAwesome5"
          name="hourglass-end"
          style={{ fontSize: 60, color: '#007AFF' }}
        />

        <Label style={{ marginVertical: 20 }}>
          Before ending this session, please enter number of pages you read:
        </Label>

        {this.state.error ? (
          <Label style={{ color: 'red', marginBottom: 5 }}>
            {this.state.error}
          </Label>
        ) : (
          <React.Fragment />
        )}

        <Item rounded style={{ marginBottom: 20, alignItems: 'center' }}>
          <Input
            placeholder="Page number"
            autoCapitalize="none"
            keyboardType="numeric"
            value={this.state.page}
            onChangeText={this.inputChanged('page')}
            textAlign={'center'}
          />
        </Item>

        <Button
          rounded
          primary
          style={{ alignSelf: 'center' }}
          onPress={this.endSessionHandler}
        >
          <Text style={styles.buttonSaveText}>END SESSION</Text>
        </Button>
      </Content>
    );
  };

  endSessionHandler = async () => {
    try {
      this.setState({ visibleEndSession: false });
      this.context.showLoading();
      const bookId = this.props.navigation.getParam('bookId', '');

      if (
        !this.state.page ||
        parseInt(this.state.page) < 1 ||
        parseInt(this.state.page) + this.state.read > this.state.pages
      ) {
        this.context.hideLoading();
        this.setState({
          error:
            'The number of pages is not less than 1 or greater than total pages ' +
            this.state.pages +
            ' ',
          visibleEndSession: true
        });
        return;
      }

      const book = await Database.updateBook({
        id: bookId,
        read: parseInt(this.state.page),
        duration: parseInt(this.state.interval)
      });

      //Todo: update goal, achievement, reading plan, stats (create if not existed)
      const list = await Database.updateOthers({
        childId: this.state.childId,
        page: parseInt(this.state.page),
        interval: parseInt(this.state.interval),
        book: book.completed ? 1 : 0
      });

      //Todo: show achievement
      if (list && list[0])
        this.setState({
          currentAchievement: list[0],
          visibleAchieve: true
        });

      this.setState({
        error: '',
        visibleEndSession: false,
        interval: 0,
        page: ''
      });

      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  render() {
    const bookId = this.props.navigation.getParam('bookId', '');
    const { key, title, author, uri, read, pages, duration } = this.state;
    return (
      <Container>
        <Navbar
          left="arrow-back"
          leftHandler={this.leftHandler}
          title="Reading"
        />

        {this.state.visibleTimer && (
          <Overlay
            isVisible
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="white"
            width="80%"
            height="40%"
          >
            {this.renderTimer()}
          </Overlay>
        )}

        {this.state.visibleEndSession && (
          <Overlay
            isVisible
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="white"
            width="80%"
            height="40%"
          >
            {this.renderEndSession()}
          </Overlay>
        )}

        {this.state.visibleAchieve && (
          <Overlay
            isVisible
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="white"
            width="80%"
            height="40%"
            onBackdropPress={() => this.setState({ visibleAchieve: false })}
          >
            {this.renderAchieve()}
          </Overlay>
        )}

        <Content padder>
          <ListItem thumbnail>
            <Left>
              <Thumbnail
                style={{ width: 120, height: 120 }}
                square
                source={
                  uri ? { uri: uri } : require('../../assets/images/book.png')
                }
              />
            </Left>
            <Body>
              <Text style={{ marginBottom: 5 }}>Title: {title}</Text>
              <Text style={{ marginBottom: 5 }}>Author: {author}</Text>
              <Text style={{ marginBottom: 20 }}>{`Pages: ${pages}`}</Text>
              <Row>
                <Button rounded onPress={this.readHandler.bind(this, bookId)}>
                  <Text>Read</Text>
                </Button>

                <Button
                  rounded
                  style={{ marginLeft: 20 }}
                  onPress={this.editHandler.bind(this, bookId)}
                >
                  <Text>Edit</Text>
                </Button>
              </Row>
            </Body>
            <Right>
              <React.Fragment />
            </Right>
          </ListItem>
          {/* <Thumbnail
            style={{ width: 200, height: 200 }}
            square
            source={
              this.state.uri
                ? { uri: this.state.uri }
                : require('../../assets/images/add-book.png')
            }
          /> */}

          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={require('../../assets/images/002-open-book.png')}
                />
              </Left>
              <Body style={styles.body}>
                <Text>Total pages read</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>{read} </Text>
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
                <Text>Total time read</Text>
              </Body>
              <Right style={styles.right}>
                <Text style={styles.value}>{this.secondsToHms(duration)} </Text>
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
                  {duration > 0
                    ? `${Math.round(read / (duration / 3600))}`
                    : '0'}
                </Text>
                <Text note>pages/h</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

C_ReadingScreen.contextType = AppContext;

C_ReadingScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_ReadingScreen;
