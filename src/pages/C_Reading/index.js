import React, { Component } from 'react';
import { View, TextInput, Alert } from 'react-native';
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

      interval: 0,
      timerStarted: false,
      page: ''
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

  componentDidMount() {
    this.unsubscribe = this.bookRef.onSnapshot(this.onBookUpdate);
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
                {this.state.timerStarted ? 'PAUSED' : 'START'}
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
          Before ending this session, please enter the page you got to:
        </Label>

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

  endSessionHandler = () => {
    try {
      this.setState({ visibleEndSession: false });
      this.context.showLoading();
      const bookId = this.props.navigation.getParam('bookId', '');

      Database.updateBook({
        id: bookId,
        read: this.state.page,
        duration: this.state.interval
      });

      //Todo: update goals

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
            height="50%"
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

          <Grid style={{ margin: 10 }}>
            <Row style={{ marginBottom: 20 }}>
              <Col>
                <Text>Pages Read</Text>
                <Text>{read}</Text>
              </Col>
              <Col>
                <Text>Read Time</Text>
                <Text>{this.secondsToHms(duration)}</Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text>Read Speed</Text>
                <Text>
                  {duration > 0
                    ? `${Math.round(read / (duration / 3600))}`
                    : '0'}{' '}
                </Text>
              </Col>
              <Col>
                <React.Fragment />
              </Col>
            </Row>
          </Grid>
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
