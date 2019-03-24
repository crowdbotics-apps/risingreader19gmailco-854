import React from 'react';
import { Root } from 'native-base';
// import { StackNavigator, DrawerNavigator } from "react-navigation";
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import LoadingScreen from './Loading';
import LoginScreen from './Login';
import ForgotPasswordScreen from './PasswordReset';
import SignupScreen from './Signup';


import MainScreen from './Main';
import GoalScreen from './Goal';
import StatsScreen from './Stats';
import LeaderBoardScreen from './LeaderBoard';
import MoreScreen from './More';

import UsersScreen from './Users';
import ProfileScreen from './Profile';


const AuthNavigator = createStackNavigator(
  {
    login: {
      screen: LoginScreen
    },
    signup: {
      screen: SignupScreen
    },
    forgotpassword: {
      screen: ForgotPasswordScreen
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'login'
  }
);

const MainStackNavigator = createStackNavigator(
  {
    books: MainScreen,
    goal: GoalScreen,
    stats: StatsScreen,
    leaderBoard: LeaderBoardScreen,
    more: MoreScreen,

    users:  UsersScreen,
    profile: ProfileScreen,

  },
  {
    initialRouteName: 'books',
    headerMode: 'none'
  }
);

const AppNavigator = createSwitchNavigator(
  {
    loading: LoadingScreen,
    auth: AuthNavigator,
    main: MainStackNavigator
  },
  {
    initialRouteName: 'loading'
  }
);

export default createAppContainer(AppNavigator);
