import React, { Component } from 'react';
import { View, TextInput, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import moment from 'moment';
import { AppContext, Navbar } from 'app/components';
import { Database } from 'app/services';
import { alert, success } from 'app/utils/Alert';

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
  Thumbnail
} from 'native-base';

import styles from './style';

class C_BookScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookId: '',
      uid: '',
      title: '',
      author: '',
      pages: '',
      image: ''
    };

    this.props.navigation.addListener('didFocus', this.onFocus);
  }

  onFocus = async (payload) => {
    this.context.showLoading();
    const bookId = this.props.navigation.getParam('bookId', '');

    if (bookId) {
      const book = await Database.getBook(bookId);
      this.setState({
        bookId: book.id,
        title: book.title,
        author: book.author,
        pages: book.pages,
        image: book.uri
      });
    }
    this.context.hideLoading();
  };

  leftHandler = () => {
    this.props.navigation.goBack();
  };

  saveHandler = async () => {
    if (!this.validate()) {
      return;
    }
    try {
      this.context.showLoading();
      const bookId = this.props.navigation.getParam('bookId', '');
      const { title, author, pages, uri } = this.state;

      if (!bookId) {
        await Database.createBook({
          uid: '', //TODO
          masterId: '', //TODO
          title: title,
          author: author,
          pages: pages,
          read: '0',
          uri: uri
        });
      } else {
        await Database.updateBook({
          id: bookId,
          uid: '', //TODO
          masterId: '', //TODO
          title: title,
          author: author,
          pages: pages,
          read: '0',
          uri: uri
        });
      }

      this.context.hideLoading();
      this.props.navigation.goBack();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  deleteHandler = (id) => {
    Alert.alert(
      'Delete Book',
      'Are you sure to delete this book?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              this.context.showLoading();
              await Database.deleteBook(id);
              this.props.navigation.goBack();
              this.context.hideLoading();
            } catch (error) {
              this.context.hideLoading();
              alert(error.message);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  validate = () => {
    let { title, author, pages } = this.state;
    if (!title) {
      alert("Title can't be empty!");
      return false;
    }

    if (!author) {
      alert("author can't be empty!");
      return false;
    }

    if (!pages) {
      alert("pages can't be empty!");
      return false;
    }
    return true;
  };

  inputChanged = (key) => (text) => {
    this.setState({ [key]: text });
  };

  render() {
    const bookId = this.props.navigation.getParam('bookId', '');

    return (
      <Container>
        <Navbar left="arrow-back" leftHandler={this.leftHandler} title="Book" />

        <Content padder>
          <Form>
            <Item rounded style={styles.input}>
              <Input
                placeholder="Book Title"
                autoFocus={true}
                //autoCapitalize="none"
                value={this.state.title}
                onChangeText={this.inputChanged('title')}
              />
            </Item>
            <Item rounded style={styles.input}>
              <Input
                placeholder="Book Author"
                //autoFocus={true}
                //autoCapitalize="none"
                value={this.state.author}
                onChangeText={this.inputChanged('author')}
              />
            </Item>
            <Item rounded style={styles.input}>
              <Input
                placeholder="Number of pages"
                //autoFocus={true}
                //autoCapitalize="none"
                value={this.state.pages}
                onChangeText={this.inputChanged('pages')}
              />
            </Item>
            <Thumbnail
              style={{ alignSelf: 'center', marginBottom: 20 }}
              square
              large
              source={
                this.state.image
                  ? { uri: this.state.image }
                  : require('../../assets/images/book.png')
              }
            />

            <Grid style={{ marginBottom: 30 }}>
              <Row>
                <Col style={{ alignItems: 'center' }}>
                  <Icon
                    active
                    type="FontAwesome"
                    name="camera"
                    style={{ color: '#007AFF' }}
                  />
                </Col>
                <Col style={{ alignItems: 'center' }}>
                  <Icon
                    active
                    type="FontAwesome"
                    name="upload"
                    style={{ color: '#007AFF' }}
                  />
                </Col>
              </Row>
            </Grid>

            <Button
              rounded
              primary
              style={styles.button}
              onPress={this.saveHandler}
            >
              {/* <Icon type="FontAwesome5" name="award" /> */}
              <Text style={styles.buttonText}>Save</Text>
            </Button>
            <Button
              rounded
              danger
              style={styles.button}
              onPress={this.deleteHandler.bind(this, bookId)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

C_BookScreen.contextType = AppContext;

C_BookScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_BookScreen;
