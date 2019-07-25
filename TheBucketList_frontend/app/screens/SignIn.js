import React, { Component } from 'react';
import { View, Alert, AsyncStorage, NetInfo, ScrollView } from 'react-native';
import { Card, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import { insertUporabnik, prijaviUporabnik, getUporabnik, odjaviUporabnik } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class SignIn extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.SignIn')}`,
    });

    handleSignUpPress = () => {
        this.props.navigation.navigate('SignUp');
    }
    handleSignInPress = () => {
        this.props.navigation.navigate('WishList');
    }

    constructor(props) {
        super(props);
        this.state = {
            uporabniskoime: '',
            geslo: '',
            uporabniskoimeerror: '',
            gesloerror: '',
        };
    };

    signIn = () => {
        let uporabniskoime = this.state.uporabniskoime;
        let geslo = Base64.encode(this.state.geslo);

        if (uporabniskoime === '' || geslo === '') {
            if (uporabniskoime === '') {
                this.setState({ uporabniskoimeerror: strings('SignIn.errormessage') });
            }
            else {
                this.setState({ uporabniskoimeerror: '' });
            }
            if (geslo === '') {
                this.setState({ gesloerror: strings('SignIn.errormessage') });
            }
            else {
                this.setState({ gesloerror: '' });
            }
        }
        else {
            this.setState({ uporabniskoimeerror: '' });
            this.setState({ gesloerror: '' });

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    fetch('https://tvabucketlist.herokuapp.com/uporabniki/prijava', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            uporabniskoime,
                            geslo
                        })
                    })
                        .then((result) => result.json())
                        .then((res) => {
                            if (Object.getOwnPropertyNames(res).length === 0) {
                                Alert.alert(
                                    `${strings('SignIn.alert')}`,
                                    `${strings('SignIn.alertwrong')}`,
                                    [
                                        { text: strings('SignIn.alertok') },
                                    ]
                                )
                            }
                            else {
                                getUporabnik(res.id)
                                    .then((uporabnik) => {
                                        if (uporabnik != null) {
                                            prijaviUporabnik(res.id)
                                                .then(() => {
                                                    this.handleSignInPress();
                                                }).catch((error) => {
                                                    console.error(error);
                                                });
                                        }
                                        else {
                                            uporabnik = {
                                                id: res.id,
                                                prijavljen: true,
                                                uporabniskoIme: res.uporabniskoime,
                                                geslo: res.geslo,
                                                ime: res.ime,
                                                priimek: res.priimek,
                                                email: res.email
                                            }

                                            insertUporabnik(uporabnik)
                                                .then(() => {
                                                    this.handleSignInPress();
                                                }).catch((error) => {
                                                    console.error(error);
                                                });
                                        }
                                    }).catch((error) => {
                                        console.error(error);
                                    });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
                else {
                    Alert.alert(
                        `${strings('SignIn.alert')}`,
                        `${strings('SignIn.alertnointernet')}`,
                        [
                            { text: strings('SignIn.alertok') },
                        ]
                    )
                }
            })
        }
    }

    render() {
        const uporabniskoimeerror = this.state.uporabniskoimeerror ? this.state.uporabniskoimeerror : undefined;
        const gesloerror = this.state.gesloerror ? this.state.gesloerror : undefined;

        return (
            <View >
                <ScrollView>
                    <Card title={strings('SignIn.title')}>
                        <FormLabel>{strings('SignIn.username')}</FormLabel>
                        <FormInput
                            onChangeText={uporabniskoime => this.setState({ uporabniskoime })}
                        />
                        {uporabniskoimeerror &&
                            <FormValidationMessage>{uporabniskoimeerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('SignIn.password')}</FormLabel>
                        <FormInput
                            secureTextEntry
                            onChangeText={geslo => this.setState({ geslo })}
                        />
                        {gesloerror &&
                            <FormValidationMessage>{gesloerror}</FormValidationMessage>
                        }

                        <Button
                            buttonStyle={{ marginTop: 20 }}
                            backgroundColor="#66BB6A"
                            title={strings('SignIn.signin')}
                            onPress={this.signIn}
                        />

                        <Button
                            buttonStyle={{ marginTop: 20 }}
                            backgroundColor="transparent"
                            textStyle={{ color: "#bcbec1" }}
                            title={strings('SignIn.signup')}
                            onPress={this.handleSignUpPress}
                        />
                    </Card>
                </ScrollView>
            </View >
        )
    }
}

export default SignIn;