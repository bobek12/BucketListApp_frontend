import React, { Component } from 'react';
import { View, NetInfo, Alert, ScrollView } from 'react-native';
import { Card, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { Base64 } from 'js-base64';

import { strings } from '../../locales/i18n';

class SignUp extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.SignUp')}`,
    });

    handleUserAdded = () => {
        this.props.navigation.navigate('SignIn');
    }

    constructor(props) {
        super(props);
        this.state = {
            uporabniskoime: '',
            geslo: '',
            ime: '',
            priimek: '',
            email: '',
            uporabniskoimeerror: '',
            gesloerror: '',
            imeerror: '',
            priimekerror: '',
            emailerror: ''
        };
    };

    signUp = () => {
        let uporabniskoime = this.state.uporabniskoime;
        let geslo = Base64.encode(this.state.geslo);
        let ime = this.state.ime;
        let priimek = this.state.priimek;
        let email = this.state.email;

        if (uporabniskoime === '' || geslo === '' || ime === '' || priimek === '' || email === '') {
            if (uporabniskoime === '') {
                this.setState({ uporabniskoimeerror: strings('SignUp.errormessage') });
            }
            else {
                this.setState({ uporabniskoimeerror: '' });
            }
            if (geslo === '') {
                this.setState({ gesloerror: strings('SignUp.errormessage') });
            }
            else {
                this.setState({ gesloerror: '' });
            }
            if (ime === '') {
                this.setState({ imeerror: strings('SignUp.errormessage') });
            }
            else {
                this.setState({ imeerror: '' });
            }
            if (priimek === '') {
                this.setState({ priimekerror: strings('SignUp.errormessage') });
            }
            else {
                this.setState({ priimekerror: '' });
            }
            if (email === '') {
                this.setState({ emailerror: strings('SignUp.errormessage') });
            }
            else {
                this.setState({ emailerror: '' });
            }
        }
        else {
            this.setState({ uporabniskoimeerror: '' });
            this.setState({ gesloerror: '' });
            this.setState({ imeerror: '' });
            this.setState({ priimekerror: '' });
            this.setState({ emailerror: '' });

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    fetch('https://tvabucketlist.herokuapp.com/uporabniki', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            uporabniskoime,
                            geslo,
                            ime,
                            priimek,
                            email
                        })
                    })
                        .then((result) => result.json())
                        .then((res) => {
                            if (res.email_obstaja === true) {
                                Alert.alert(
                                    `${strings('SignUp.alert')}`,
                                    `${strings('SignUp.alertexists')}`,
                                    [
                                        { text: strings('SignUp.alertok') },
                                    ]
                                )
                            }
                            else {
                                if (res.uporabniskoime_obstaja === true) {
                                    Alert.alert(
                                        `${strings('SignUp.alert')}`,
                                        `${strings('SignUp.alerttaken')}`,
                                        [
                                            { text: strings('SignUp.alertok') },
                                        ]
                                    )
                                }
                                else {
                                    this.handleUserAdded();
                                }
                            }
                        }).catch((error) => {
                            console.error(error);
                        });
                }
                else {
                    Alert.alert(
                        `${strings('SignUp.alert')}`,
                        `${strings('SignUp.alertnointernet')}`,
                        [
                            { text: strings('SignUp.alertok') },
                        ]
                    )
                }
            })
        }
    }

    render() {
        const uporabniskoimeerror = this.state.uporabniskoimeerror ? this.state.uporabniskoimeerror : undefined;
        const gesloerror = this.state.gesloerror ? this.state.gesloerror : undefined;
        const imeerror = this.state.imeerror ? this.state.imeerror : undefined;
        const priimekerror = this.state.priimekerror ? this.state.priimekerror : undefined;
        const emailerror = this.state.emailerror ? this.state.emailerror : undefined;

        return (
            <View>
                <ScrollView>
                    <Card title={strings('SignUp.title')}>
                        <FormLabel>{strings('SignUp.firstname')}</FormLabel>
                        <FormInput
                            onChangeText={ime => this.setState({ ime })}
                        />
                        {imeerror &&
                            <FormValidationMessage>{imeerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('SignUp.lastname')}</FormLabel>
                        <FormInput
                            onChangeText={priimek => this.setState({ priimek })}
                        />
                        {priimekerror &&
                            <FormValidationMessage>{priimekerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('SignUp.email')}</FormLabel>
                        <FormInput
                            onChangeText={email => this.setState({ email })}
                        />
                        {emailerror &&
                            <FormValidationMessage>{emailerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('SignUp.username')}</FormLabel>
                        <FormInput
                            onChangeText={uporabniskoime => this.setState({ uporabniskoime })}
                        />
                        {uporabniskoimeerror &&
                            <FormValidationMessage>{uporabniskoimeerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('SignUp.password')}</FormLabel>
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
                            title={strings('SignUp.signup')}
                            onPress={this.signUp}
                        />
                    </Card>
                </ScrollView>
            </View>
        )
    }
}

export default SignUp;