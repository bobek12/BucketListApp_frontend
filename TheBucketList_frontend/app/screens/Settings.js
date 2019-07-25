import React, { Component } from 'react';
import { View, Picker, Switch, AsyncStorage, NetInfo, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';

import { getAllJavnaZelja, deleteAllJavnaZelje } from '../../databases/queries';

import { strings } from '../../locales/i18n';
import I18n from 'react-native-i18n';

class Settings extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.Settings')}`,
    });

    handleLangSettingsSave = () => {
        this.props.navigation.navigate('Logo');
    }

    handleSyncSettingsSave = () => {
        this.props.navigation.navigate('WishList');
    }

    constructor() {
        super();
        this.state = {
            langValue: 'en',
            sync: true
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('sinhronizacija')
            .then((value) => {
                if (value === "false") {
                    this.setState({
                        sync: false
                    })
                }
                else {
                    this.setState({
                        sync: true
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }


    handleLanguageSetting = () => {
        const jezik = this.state.langValue;

        AsyncStorage.setItem('jezik', jezik)
            .then(() => {
                I18n.locale = jezik;
            })
            .then(() => {
                this.handleLangSettingsSave();
            })
            .catch((error) => {
                console.error(error);
            })
    }

    handleSyncSettings = () => {
        const sync = this.state.sync;

        AsyncStorage.setItem('sinhronizacija', sync.toString())
            .then(() => {
                this.handleSyncSettingsSave();
            })
            .catch((error) => {
                console.error(error);
            })
    }

    handleSync = () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                getAllJavnaZelja().then((seznamZelja) => {
                    if (seznamZelja != null) {
                        seznamZelja.forEach(zelja => {
                            fetch('https://tvabucketlist.herokuapp.com/zelje', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    naziv: zelja.naziv,
                                    opis: zelja.opis,
                                    lokacija: zelja.lokacija,
                                    uporabnik_id: zelja.uporabnikId
                                })
                            })
                                .then(() => {
                                    deleteAllJavnaZelje()
                                        .catch((error) => {
                                            console.error(error);
                                        });
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        });
                    }
                })
                    .then(() => {
                        Alert.alert(
                            `${strings('Settings.alert')}`,
                            `${strings('Settings.alertsync')}`,
                            [
                                { text: strings('SignUp.alertok') },
                            ]
                        )
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            else {
                Alert.alert(
                    `${strings('Settings.alert')}`,
                    `${strings('Settings.alertnointernet')}`,
                    [
                        { text: strings('SignUp.alertok') },
                    ]
                )
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Card>
                        <View style={styles.languageContainer}>
                            <Icon
                                name='language'
                                color='#517fa4'
                                size={30}
                            />
                            <Text style={styles.formlabel}>{strings('Settings.langsettings')}</Text>
                        </View>
                        <Picker style={styles.picker}
                            selectedValue={this.state.langValue}
                            onValueChange={(value) => this.setState({ langValue: value })}
                        >
                            <Picker.Item value="en" label="English" />
                            <Picker.Item value="sl" label="Slovenščina" />
                        </Picker>
                        <Button
                            buttonStyle={{ marginTop: 20 }}
                            backgroundColor="#66BB6A"
                            title={strings('Settings.set')}
                            onPress={this.handleLanguageSetting}
                        />
                    </Card>
                    <Card>

                        <View style={styles.languageContainer}>
                            <Icon
                                name='system-update'
                                color='#517fa4'
                                size={30}
                            />
                            <Text style={styles.formlabel}>{strings('Settings.sinhrosettings')}</Text>
                        </View>
                        <Switch style={styles.switch}
                            value={this.state.sync}
                            onValueChange={(value) => this.setState({ sync: value })}
                        />
                        <Button
                            buttonStyle={{ marginTop: 20 }}
                            backgroundColor="#66BB6A"
                            title={strings('Settings.set')}
                            onPress={this.handleSyncSettings}
                        />
                        <Button
                            buttonStyle={{ marginTop: 20 }}
                            backgroundColor="#b0afae"
                            title={strings('Settings.syncnow')}
                            onPress={this.handleSync}
                        />
                    </Card>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    picker: {
        marginLeft: 13
    },
    switch: {
        marginRight: 10
    },
    languageContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    formlabel: {
        textAlignVertical: 'center',
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 16
    }
})

export default Settings;