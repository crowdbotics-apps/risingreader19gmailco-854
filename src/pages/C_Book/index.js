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
      uri: '',
      filename: ''
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
        uri: `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/${
          book.filename
        }`
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
      let bookId = this.props.navigation.getParam('bookId', '');
      const { title, author, pages, uri, filename } = this.state;

      const [userToken, childId] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('childId')
      ]);

      if (!bookId) {
        bookId = uuid();
        await Database.createBook({
          id: bookId,
          uid: childId,
          masterId: userToken,
          title: title,
          author: author,
          pages: pages,
          read: '0',
          uri: uri,
          filename: filename
        });
      } else {
        await Database.updateBook({
          id: bookId,
          uid: childId,
          masterId: userToken,
          title: title,
          author: author,
          pages: pages,
          //read: '0',
          uri: uri,
          filename: filename
        });
      }

      // Todo: upload to firestore if needed
      // if (filename) {
      //    firebase
      //     .storage()
      //     .ref(`/books/${bookId}`)
      //     .putFile(
      //       `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/${filename}`
      //     )
      //     .then((uploadedFile) => {
      //       console.log(uploadedFile);
      //     })
      //     .catch((err) => {
      //       alert(err.message);
      //     });
      // }

      this.props.navigation.goBack();
      this.context.hideLoading();
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
              this.props.navigation.navigate('c_books');
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

  pickImage = () => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: 'Book Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const filename =
          'images/' + response.uri.substring(response.uri.lastIndexOf('/') + 1);

        // success(response.uri + '--' + firebase.storage.Native.DOCUMENT_DIRECTORY_PATH + '/images/' + filename)

        this.setState({
          uri: response.uri,
          filename: filename
        });
      }
    });
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
            <Button
              transparent
              style={{
                alignSelf: 'center',
                marginBottom: 20,
                width: 220,
                height: 220
              }}
              onPress={this.pickImage}
            >
              <Thumbnail
                style={{ width: 200, height: 200 }}
                source={
                  this.state.uri
                    ? { uri: this.state.uri }
                    : require('../../assets/images/book.png')
                }
              />
            </Button>

            {/* <Grid style={{ marginBottom: 30 }}>
              <Row>
                <Col style={{ alignItems: 'center' }}>
                  <Button transparent onPress={this.pickImage}>
                    <Icon
                      active
                      type="FontAwesome"
                      name="camera"
                      style={{ color: '#007AFF' }}
                    />
                  </Button>
                </Col>
                <Col style={{ alignItems: 'center' }}>
                  <Button transparent onPress={this.pickImage}>
                    <Icon
                      active
                      type="FontAwesome"
                      name="upload"
                      style={{ color: '#007AFF' }}
                    />
                  </Button>
                </Col>
              </Row>
            </Grid> */}

            <Button
              rounded
              primary
              style={styles.button}
              onPress={this.saveHandler}
            >
              {/* <Icon type="FontAwesome5" name="award" /> */}
              <Text style={styles.buttonText}>Save</Text>
            </Button>
            {bookId ? (
              <Button
                rounded
                danger
                style={styles.button}
                onPress={this.deleteHandler.bind(this, bookId)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Button>
            ) : (
              <React.Fragment />
            )}
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
