import React, { Component } from 'react';
import { ScrollView, Text, View, AsyncStorage, NetInfo, Alert } from 'react-native';
import { Card, Button, List, ListItem, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import { getPrijavljenUporabnik, updateUporabnik } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class PasswordChange extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.PasswordChange')}`,
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
            staro_geslo: '',
            geslo: '',
            novo_geslo: '',
            gesloerror: '',
            novogesloerror: ''
        };
    }

    componentDidMount() {
        getPrijavljenUporabnik().then((uporabnik) => {
            this.setState({
                id: uporabnik.id,
                staro_geslo: uporabnik.geslo,
                uporabniskoime: uporabnik.uporabniskoIme,
                ime: uporabnik.ime,
                priimek: uporabnik.priimek,
                email: uporabnik.email
            })
        }).catch((error) => {
            console.error(error);
        });
    }

    changePassword = () => {
        let id = this.state.id;
        let staro_geslo = this.state.staro_geslo;
        let geslo = Base64.encode(this.state.geslo);
        let novo_geslo = Base64.encode(this.state.novo_geslo);

        if (geslo === '' || novo_geslo === '') {
            if (geslo === '') {
                this.setState({ gesloerror: strings('PasswordChange.errormessage') });
            }
            else {
                this.setState({ gesloerror: '' });
            }
            if (novo_geslo === '') {
                this.setState({ novogesloerror: strings('PasswordChange.errormessage') });
            }
            else {
                this.setState({ novogesloerror: '' });
            }
        }
        else {
            this.setState({ gesloerror: '' });
            this.setState({ novogesloerror: '' });

            if (staro_geslo === geslo) {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        fetch('https://tvabucketlist.herokuapp.com/uporabniki/' + id, {
                            method: 'PUT',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                uporabniskoime: this.state.uporabniskoime,
                                email: this.state.email,
                                geslo: novo_geslo
                            })
                        })
                            .then((result) => result.json())
                            .then((res) => {
                                uporabnik = {
                                    id: this.state.id,
                                    prijavljen: true,
                                    uporabniskoIme: this.state.uporabniskoime,
                                    geslo: res.geslo,
                                    ime: this.state.ime,
                                    priimek: this.state.priimek,
                                    email: this.state.email
                                }

                                updateUporabnik(uporabnik)
                                    .then(() => {
                                        this.handleUpdatePress();
                                    }).catch((error) => {
                                        console.error(error);
                                    });
                            }).catch((error) => {
                                console.error(error);
                            });
                    }
                    else {
                        Alert.alert(
                            `${strings('PasswordChange.alert')}`,
                            `${strings('PasswordChange.alertnointernet')}`,
                            [
                                { text: strings('PasswordChange.alertok') },
                            ]
                        )
                    }
                });
            }
            else {
                Alert.alert(
                    `${strings('PasswordChange.alert')}`,
                    `${strings('PasswordChange.alertoldpassword')}`,
                    [
                        { text: strings('PasswordChange.alertok') },
                    ]
                )
            }
        }
    }

    render() {
        const geslo = this.state.geslo ? this.state.geslo : undefined;
        const novo_geslo = this.state.novo_geslo ? this.state.novo_geslo : undefined;

        const gesloerror = this.state.gesloerror ? this.state.gesloerror : undefined;
        const novogesloerror = this.state.novogesloerror ? this.state.novogesloerror : undefined;

        return (
            <View>
                <ScrollView>
                    <Card title={strings('PasswordChange.title')}>
                        <FormLabel>{strings('PasswordChange.oldpassword')}</FormLabel>
                        <FormInput
                            secureTextEntry
                            value={geslo}
                            onChangeText={geslo => this.setState({ geslo })}
                        />
                        {gesloerror &&
                            <FormValidationMessage>{gesloerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('PasswordChange.newspassword')}</FormLabel>
                        <FormInput
                            secureTextEntry
                            value={novo_geslo}
                            onChangeText={novo_geslo => this.setState({ novo_geslo })}
                        />
                        {novogesloerror &&
                            <FormValidationMessage>{novogesloerror}</FormValidationMessage>
                        }

                    </Card>
                    <Button
                        buttonStyle={{ height: 60 }}
                        backgroundColor="#66BB6A"
                        title={strings('PasswordChange.change')}
                        onPress={this.changePassword}
                    />
                </ScrollView>
            </View>
        )
    }
}

export default PasswordChange;