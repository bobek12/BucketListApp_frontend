import React from 'react';
import { StackNavigator, createBottomTabNavigator, SwitchNavigator, DrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Logo from './screens/Logo';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import WishList from './screens/WishList';
import WishDetails from './screens/WishDetails';
import WishUpdate from './screens/WishUpdate';
import InspireMe from './screens/InspireMe';
import CompletedWishes from './screens/CompletedWishes';
import WishAdd from './screens/WishAdd';
import User from './screens/User';
import UserUpdate from './screens/UserUpdate';
import PasswordChange from './screens/PasswordChange';
import Settings from './screens/Settings';
import DrawerMenu from './screens/DrawerMenu'

import { strings } from '../locales/i18n';

export const Root = SwitchNavigator({
    Welcome: {
        screen: StackNavigator({
            Logo: {
                screen: Logo, navigationOptions: {
                    headerStyle: {
                        backgroundColor: '#66BB6A'
                    }
                }
            }
        })
    },

    login: {
        screen: StackNavigator({
            SignIn: {
                screen: SignIn, navigationOptions: {
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#66BB6A'
                    }
                }
            },
            SignUp: {
                screen: SignUp, navigationOptions: {
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#66BB6A'
                    }
                }
            }
        })
    },

    Home: {
        screen: DrawerNavigator({
            WishList: {
                screen: StackNavigator({
                    WishList: {
                        screen: createBottomTabNavigator({
                            WishListTab: {
                                screen: WishList, navigationOptions: {
                                    tabBarIcon: ({ tintColor }) => (<Icon name='list' size={27} color={tintColor} />)
                                }
                            },
                            CompletedTab: {
                                screen: CompletedWishes, navigationOptions: {
                                    tabBarIcon: ({ tintColor }) => (<Icon name='check' size={27} color={tintColor} />)
                                }
                            },
                            InspireMeTab: {
                                screen: InspireMe, navigationOptions: {
                                    tabBarIcon: ({ tintColor }) => (<Icon name='search' size={27} color={tintColor} />)
                                }
                            },
                        }, {
                                tabBarOptions: {
                                    activeTintColor: '#66BB6A',
                                    inactiveTintColor: '#ACACAF',
                                    labelStyle: {
                                        fontSize: 10,
                                        fontWeight: '300'
                                    },
                                    style: {
                                        backgroundColor: 'white',
                                        borderWidth: 3,
                                        borderColor: 'white'
                                    }
                                }
                            }), navigationOptions: ({ navigation }) => ({
                                title: 'The Bucket List',
                                headerTintColor: 'white',
                                headerStyle: {
                                    backgroundColor: '#66BB6A'
                                },
                                headerRight: <Icon name="menu" type='feather' containerStyle={{ marginRight: 10 }} color='white' size={27} onPress={() => navigation.toggleDrawer()} />
                            }),
                    },
                    WishDetails: {
                        screen: WishDetails, navigationOptions: {
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#66BB6A'
                            },
                            headerRight: <Icon name="text-document" type='entypo' containerStyle={{ marginRight: 15 }} color='white' size={27} />

                        }
                    },
                    WishUpdate: {
                        screen: WishUpdate, navigationOptions: {
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#66BB6A'
                            },
                            headerRight: <Icon name="update" type='material-community' containerStyle={{ marginRight: 15 }} color='white' size={27} />
                        }
                    },
                    WishAdd: {
                        screen: WishAdd, navigationOptions: {
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#66BB6A'
                            },
                            headerRight: <Icon name="new-message" type='entypo' containerStyle={{ marginRight: 15 }} color='white' size={27} />
                        }
                    },
                    Settings: {
                        screen: Settings, navigationOptions: {
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#66BB6A'
                            },
                            headerRight: <Icon name="settings" type='feather' containerStyle={{ marginRight: 15 }} color='white' size={27} />

                        }
                    },
                    User: {
                        screen: User, navigationOptions: {
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#66BB6A'
                            },
                            headerRight: <Icon name="user" type='entypo' containerStyle={{ marginRight: 15 }} color='white' size={27} />

                        }
                    },
                    UserUpdate: {
                        screen: UserUpdate, navigationOptions: {
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#66BB6A'
                            },
                            headerRight: <Icon name="user" type='entypo' containerStyle={{ marginRight: 15 }} color='white' size={27} />

                        }
                    },
                    PasswordChange: {
                        screen: PasswordChange, navigationOptions: {
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#66BB6A'
                            },
                            headerRight: <Icon name="user" type='entypo' containerStyle={{ marginRight: 15 }} color='white' size={27} />

                        }
                    }
                }),

            },
        }, {
                contentComponent: DrawerMenu //Custom side menu
            }, ),
    }
}
)