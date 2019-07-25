import React, { Component } from 'react';
import { ScrollView, AsyncStorage, View } from 'react-native';
import { Card, Button, List, ListItem, Icon, Text } from 'react-native-elements';

import { getPrijavljenUporabnik, odjaviUporabnik } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.User')}`,
    });

    handleUpdatePress = () => {
        this.props.navigation.navigate('UserUpdate');
    }
    handleChangePswPress = () => {
        this.props.navigation.navigate('PasswordChange');
    }
    handleSignOutPress = () => {
        this.props.navigation.navigate('SignIn');
    }

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
        this.props.navigation.addListener('willFocus', () => {
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
        })
    }

    signOut = () => {
        odjaviUporabnik(this.state.id).then(() => {
            this.handleSignOutPress();
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        const uporabniskoime = this.state.uporabniskoime ? this.state.uporabniskoime : undefined;
        const ime = this.state.ime ? this.state.ime : undefined;
        const priimek = this.state.priimek ? this.state.priimek : undefined;
        const email = this.state.email ? this.state.email : undefined;

        return (
            <ScrollView>
                <Card>
                    <View style={{ marginLeft: 20 }}>
                        <Text h4 style={{ marginBottom: 20 }}>{ime} {priimek}</Text>
                        <Text style={{ marginBottom: 10, fontSize: 14, fontWeight: '500' }}>{strings('User.username')}: {uporabniskoime}</Text>
                        <Text style={{ marginBottom: 10, fontSize: 14, fontWeight: '500' }}>{strings('User.email')}: {email}</Text>
                    </View>
                    <Button
                        buttonStyle={{ marginTop: 20 }}
                        backgroundColor="#66BB6A"
                        title={strings('User.update')}
                        onPress={this.handleUpdatePress}
                    />
                    <Button
                        buttonStyle={{ marginTop: 20 }}
                        backgroundColor="#b0afae"
                        title={strings('User.change')}
                        onPress={this.handleChangePswPress}
                    />
                    <Button
                        buttonStyle={{ marginTop: 20 }}
                        backgroundColor="#292929"
                        title={strings('User.singout')}
                        onPress={this.signOut}
                    />
                </Card>
            </ScrollView>
        )
    }
}

export default User;