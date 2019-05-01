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

import C_MainScreen from './C_Main';
import C_BookScreen from './C_Book';
import C_GoalScreen from './C_Goal';
import C_AchievementScreen from './C_Achievement';
import C_LeaderBoardScreen from './C_LeaderBoard';
import C_UserScreen from './C_User';

import UsersScreen from './Users';
import ProfileScreen from './Profile';
import GoalsScreen from './Goals';
import DonationScreen from './Donation';
import PremiumScreen from './Premium';
import ParentingScreen from './Parenting';
import C_ReadingScreen from './C_Reading';
// import C_ProgressScreen from './C_Progress';

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

    c_books: C_MainScreen,
    c_book: C_BookScreen,
    c_read: C_ReadingScreen,
    //c_progress: C_ProgressScreen,
    c_goal: C_GoalScreen,
    c_achievement: C_AchievementScreen,
    c_leaderBoard: C_LeaderBoardScreen,
    c_user: C_UserScreen,

    users: UsersScreen,
    profile: ProfileScreen,
    donation: DonationScreen,
    premium: PremiumScreen,
    parenting: ParentingScreen,

    goals: GoalsScreen
  },
  {
    initialRouteName: 'c_books',
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
