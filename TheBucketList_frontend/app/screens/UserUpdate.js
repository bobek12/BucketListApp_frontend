import React, { Component } from 'react';
import { ScrollView, Text, View, AsyncStorage, NetInfo, Alert } from 'react-native';
import { Card, Button, List, ListItem, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import { getPrijavljenUporabnik, updateUporabnik } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class UserUpdate extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.UserUpdate')}`,
    });

    handleUpdatePress = () => {
        this.props.navigation.navigate('User');
    }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            ime: '',
            priimek: '',
            email: '',
            uporabniskoime: '',
            geslo: '',
            uporabniskoimeerror: '',
            imeerror: '',
            priimekerror: '',
            emailerror: ''
        };
    }

    componentDidMount() {
        getPrijavljenUporabnik().then((uporabnik) => {
            this.setState({
                id: uporabnik.id,
                uporabniskoime: uporabnik.uporabniskoIme,
                ime: uporabnik.ime,
                priimek: uporabnik.priimek,
                geslo: uporabnik.geslo,
                email: uporabnik.email
            })
        }).catch((error) => {
            console.error(error);
        });
    }

    updateUser = () => {
        let id = this.state.id;
        let uporabniskoime = this.state.uporabniskoime;
        let ime = this.state.ime;
        let priimek = this.state.priimek;
        let email = this.state.email;

        if (uporabniskoime === '' || ime === '' || priimek === '' || email === '') {
            if (uporabniskoime === '') {
                this.setState({ uporabniskoimeerror: strings('UserUpdate.errormessage') });
            }
            else {
                this.setState({ uporabniskoimeerror: '' });
            }
            if (ime === '') {
                this.setState({ imeerror: strings('UserUpdate.errormessage') });
            }
            else {
                this.setState({ imeerror: '' });
            }
            if (priimek === '') {
                this.setState({ priimekerror: strings('UserUpdate.errormessage') });
            }
            else {
                this.setState({ priimekerror: '' });
            }
            if (email === '') {
                this.setState({ emailerror: strings('UserUpdate.errormessage') });
            }
            else {
                this.setState({ emailerror: '' });
            }
        }
        else {
            this.setState({ uporabniskoimeerror: '' });
            this.setState({ imeerror: '' });
            this.setState({ priimekerror: '' });
            this.setState({ emailerror: '' });

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    fetch('https://tvabucketlist.herokuapp.com/uporabniki/' + id, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            uporabniskoime,
                            ime,
                            priimek,
                            email
                        })
                    })
                        .then((result) => result.json())
                        .then((res) => {
                            if (res.email_obstaja === true) {
                                Alert.alert(
                                    `${strings('UserUpdate.alert')}`,
                                    `${strings('UserUpdate.alertexists')}`,
                                    [
                                        { text: strings('UserUpdate.alertok') },
                                    ]
                                )
                            }
                            else {
                                if (res.uporabniskoime_obstaja === true) {
                                    Alert.alert(
                                        `${strings('UserUpdate.alert')}`,
                                        `${strings('UserUpdate.alerttaken')}`,
                                        [
                                            { text: strings('UserUpdate.alertok') },
                                        ]
                                    )
                                }
                                else {
                                    uporabnik = {
                                        id: this.state.id,
                                        prijavljen: true,
                                        uporabniskoIme: res.uporabniskoime,
                                        geslo: this.state.geslo,
                                        ime: res.ime,
                                        priimek: res.priimek,
                                        email: res.email
                                    }

                                    updateUporabnik(uporabnik)
                                        .then(() => {
                                            this.handleUpdatePress();
                                        }).catch((error) => {
                                            console.error(error);
                                        });
                                }
                            }
                        }).catch((error) => {
                            console.error(error);
                        });
                }
                else {
                    Alert.alert(
                        `${strings('UserUpdate.alert')}`,
                        `${strings('UserUpdate.alertnointernet')}`,
                        [
                            { text: strings('UserUpdate.alertok') },
                        ]
                    )
                }
            })
        }
    }

    render() {
        const ime = this.state.ime ? this.state.ime : undefined;
        const priimek = this.state.priimek ? this.state.priimek : undefined;
        const email = this.state.email ? this.state.email : undefined;
        const uporabniskoime = this.state.uporabniskoime ? this.state.uporabniskoime : undefined;

        const uporabniskoimeerror = this.state.uporabniskoimeerror ? this.state.uporabniskoimeerror : undefined;
        const imeerror = this.state.imeerror ? this.state.imeerror : undefined;
        const priimekerror = this.state.priimekerror ? this.state.priimekerror : undefined;
        const emailerror = this.state.emailerror ? this.state.emailerror : undefined;

        return (
            <View>
                <ScrollView>
                    <Card title={strings('UserUpdate.title')}>
                        <FormLabel>{strings('UserUpdate.firstname')}</FormLabel>
                        <FormInput
                            value={ime}
                            onChangeText={ime => this.setState({ ime })}
                        />
                        {imeerror &&
                            <FormValidationMessage>{imeerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('UserUpdate.lastname')}</FormLabel>
                        <FormInput
                            value={priimek}
                            onChangeText={priimek => this.setState({ priimek })}
                        />
                        {priimekerror &&
                            <FormValidationMessage>{priimekerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('UserUpdate.email')}</FormLabel>
                        <FormInput
                            value={email}
                            onChangeText={email => this.setState({ email })}
                        />
                        {emailerror &&
                            <FormValidationMessage>{emailerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('UserUpdate.username')}</FormLabel>
                        <FormInput
                            value={uporabniskoime}
                            onChangeText={uporabniskoime => this.setState({ uporabniskoime })}
                        />
                        {uporabniskoimeerror &&
                            <FormValidationMessage>{uporabniskoimeerror}</FormValidationMessage>
                        }

                    </Card>
                    <Button
                        buttonStyle={{ marginTop: 0, height: 60 }}
                        backgroundColor="#66BB6A"
                        title={strings('UserUpdate.update')}
                        onPress={this.updateUser}
                    />
                </ScrollView>
            </View>
        )
    }
}

export default UserUpdate;