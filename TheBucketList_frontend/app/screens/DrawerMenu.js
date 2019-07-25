import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator, DrawerNavigator, NavigationActions, DrawerActions } from 'react-navigation';
import { Card, ListItem, Icon, Divider } from 'react-native-elements';

import { getPrijavljenUporabnik, odjaviUporabnik } from '../../databases/queries';

import { strings } from '../../locales/i18n';


class DrawerMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            uporabniskoime: '',
            ime: '',
            priimek: '',
            email: ''
        };
    };
    componentDidMount() {
        getPrijavljenUporabnik().then((uporabnik) => {
            this.setState({
                id: uporabnik.id,
                uporabniskoime: uporabnik.uporabniskoIme,
                ime: uporabnik.ime,
                priimek: uporabnik.priimek,
                email: uporabnik.email
            })
        }).catch((error) => {
            console.error(error);
        });
    }

    handleWishPress = () => {
        //this.props.navigation.closeDrawer();
        this.props.navigation.navigate('WishList');
        this.props.navigation.dispatch(DrawerActions.closeDrawer());

    }

    handleSettingsPress = () => {
        //this.props.navigation.closeDrawer();
        this.props.navigation.navigate('Settings');
        this.props.navigation.dispatch(DrawerActions.closeDrawer());

    }

    handleUserPress = () => {
        //this.props.navigation.closeDrawer();
        this.props.navigation.navigate('User');
        this.props.navigation.dispatch(DrawerActions.closeDrawer());
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.sredina}>
                        <Icon
                            name='user-circle'
                            type='font-awesome'
                            color='white'
                            size={100}
                        />
                        <Text style={styles.font}>{this.state.ime}</Text>
                    </View>
                    <TouchableOpacity onPress={this.handleWishPress}>
                        <View style={styles.button}>
                            <Icon
                                name='home'
                                type='font-awesome'
                                color='#3A3A3C'
                                size={23}

                            />
                            <Text style={styles.buttonFont}>{strings('DrawerMenu.home')} </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleSettingsPress}>
                        <View style={styles.button}>
                            <Icon
                                name='settings'
                                type='material-community'
                                color='#3A3A3C'
                                size={23}

                            />
                            <Text style={styles.buttonFont}>{strings('DrawerMenu.settings')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleUserPress}>
                        <View style={styles.button}>
                            <Icon
                                name='user-circle'
                                type='font-awesome'
                                color='#3A3A3C'
                                size={23}
                                style={{ marginLeft: 20 }}
                            />
                            <Text style={styles.buttonFont}>{strings('DrawerMenu.user')}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    font: {
        marginTop: 15,
        fontSize: 30,
        fontWeight: '600',
        color: 'white'
    },
    sredina: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
        marginBottom: 15,
        backgroundColor: 'rgba(120, 230, 135, 0.8)',
    },
    button: {
        flexDirection: 'row',
        marginBottom: 30,
        paddingLeft: 25,
    },
    buttonFont: {
        fontSize: 17,
        fontWeight: '400',
        marginLeft: 15,
    }
});

export default DrawerMenu;