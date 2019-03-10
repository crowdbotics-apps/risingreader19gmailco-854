import { connect } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';


const SwitchNavigator = createSwitchNavigator({
  Auth: AuthNavigator,
  Home: HomeNavigator,
});

const RootNavigator = createAppContainer(SwitchNavigator);

const middleware = createReactNavigationReduxMiddleware(
  state => state.navigation,
);

const AppWithNavigationState = createReduxContainer(RootNavigator);

const mapStateToProps = state => ({
  state: state.navigation,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);


export { RootNavigator, AppNavigator, middleware };
