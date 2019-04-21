import React, { Component } from 'react';
import { View, TextInput, Image, Dimensions, Linking } from 'react-native';
import PropTypes from 'prop-types';

import firebase from 'react-native-firebase';
import moment from 'moment';
import { AppContext, Navbar } from 'app/components';
import { AuthController } from 'app/services';
import { alert, success } from 'app/utils/Alert';

let dm = Dimensions.get('screen');

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
  Card,
  CardItem,
  Thumbnail
} from 'native-base';

import styles from './style';

class ParentingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blogs: []
    };
  }

  async componentDidMount() {
    //const uid = await AsyncStorage.getItem('childId');
    this.ref = firebase.firestore().collection('blogs');
    //.where('status', '==', 1);

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  onCollectionUpdate = async (querySnapshot) => {
    try {
      this.context.showLoading();
      const blogs = [];
      // let users = [];
      querySnapshot.forEach((doc) => {
        const { source, title, url, imageURI } = doc.data();

        blogs.push({
          key: doc.id,
          doc, // DocumentSnapshot
          source,
          title,
          url,
          imageURI
        });
      });

      this.setState({
        blogs: blogs
      });
      this.context.hideLoading();
    } catch (error) {
      this.context.hideLoading();
      alert(error.message);
    }
  };

  leftHandler = () => {
    this.props.navigation.navigate('more');
  };

  gotoURL = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  render() {
    return (
      <Container>
        <Navbar
          left="arrow-back"
          leftHandler={this.leftHandler}
          title="Articles"
        />
        <Content>
          {this.state.blogs.map((data, i) => {
            const { key, source, title, url, imageURI } = data;
            return (
              <Card key={key}>
                <CardItem
                  cardBody
                  button
                  onPress={this.gotoURL.bind(this, url)}
                >
                  <Image
                    source={{
                      uri: imageURI
                    }}
                    style={{ height: 200, width: null, flex: 1 }}
                  />
                </CardItem>
                <CardItem button onPress={this.gotoURL.bind(this, url)}>
                  <Left>
                    <Body>
                      <Text>{title}</Text>
                      <Text note>From {source}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            );
          })}
        </Content>
      </Container>
    );
  }
}

ParentingScreen.contextType = AppContext;

ParentingScreen.propTypes = {
  navigation: PropTypes.object
};

export default ParentingScreen;
