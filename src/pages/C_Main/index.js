import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';

let dm = Dimensions.get('screen');

import { AppContext, Navbar, C_TabBar } from 'app/components';

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
  Col,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body
} from 'native-base';

class C_MainScreen extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase
      .firestore()
      .collection('books')
      //.where('masterId', '==', firebase.auth().currentUser.uid)
      .where('status', '==', 1);
    this.unsubscribe = null;

    this.state = {
      books: []
    };
  }

  onCollectionUpdate = async (querySnapshot) => {
    try {
      this.context.showLoading();
      const books = [];
      // let users = [];
      querySnapshot.forEach((doc) => {
        const { title, author, pages, uri, read } = doc.data();

        books.push({
          key: doc.id,
          doc, // DocumentSnapshot
          title,
          author,
          pages,
          uri,
          read
        });
      });

      this.setState({
        books: books
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

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  rightHandler = () => {
    this.props.navigation.navigate('c_book');
  };

  itemPressHandler = (id) => {
    this.props.navigation.navigate('c_book', { bookId: id });
  };

  render() {
    return (
      <Container>
        <Navbar
          left="arrow-back"
          leftHandler={this.leftHandler}
          title="All Books"
          right="plus-square"
          rightHandler={this.rightHandler}
        />
        <Content>
          <List>
            {this.state.books.map((data, i) => {
              const { key, title, author, uri, read, pages } = data;
              return (
                <ListItem
                  thumbnail
                  key={key}
                  onPress={this.itemPressHandler.bind(this, key)}
                >
                  <Left>
                    <Thumbnail
                      square
                      source={
                        this.state.image
                          ? { uri: this.state.image }
                          : require('../../assets/images/book.png')
                      }
                    />
                  </Left>
                  <Body>
                    <Text>Title: {title}</Text>
                    <Text>Author: {author}</Text>
                    <Text>{`${read} / ${pages}`}</Text>
                  </Body>
                  <Right>
                    <React.Fragment />
                  </Right>
                </ListItem>
              );
            })}
          </List>
        </Content>
        <C_TabBar tab1={true} navigation={this.props.navigation} />
      </Container>
    );
  }
}

C_MainScreen.contextType = AppContext;

C_MainScreen.propTypes = {
  navigation: PropTypes.object
};

export default C_MainScreen;
