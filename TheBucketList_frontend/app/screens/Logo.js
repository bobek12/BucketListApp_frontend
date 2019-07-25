import React, { Component } from 'react';
import { ScrollView, AsyncStorage, StatusBar, StyleSheet, View, ActivityIndicator, NetInfo, Image } from 'react-native';
import { Card, Button, List, ListItem, Text } from 'react-native-elements';

import { getPrijavljenUporabnik, getAllJavnaZelja, deleteAllJavnaZelje } from '../../databases/queries';

import I18n from 'react-native-i18n';

class Logo extends Component {
    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        setTimeout(function () {
            AsyncStorage.getItem('jezik')
                .then((value) => {
                    if (value != null) {
                        I18n.locale = value;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

            getPrijavljenUporabnik().then((uporabnik) => {
                if (uporabnik != null) {
                    this.props.navigation.navigate('Home');
                }
                else {
                    this.props.navigation.navigate('login');
                }
            }).catch((error) => {
                console.error(error);
            });

            AsyncStorage.getItem('sinhronizacija')
                .then((value) => {
                    if (value != "false") {
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
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            }
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }.bind(this), 2500);
    }

    render() {
        return (

            <View style={styles.container}>        
                <Image
                    resizeMode="contain"
                    style={styles.logo}
                    source={require('../img/TheBucketList_logo.jpg')}
                />                       
                <ActivityIndicator size="large" />
            </View>
        )
    }
}

export default Logo;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: '80%'
    }
})