import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Card, ListItem } from 'react-native-elements';

import { getPrijavljenUporabnik, getClosedZelje } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class CompletedWishes extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.CompletedTab')}`,
    });

    handleDetailsPress = (id) => {
        this.props.navigation.navigate('WishDetails', { id });
    }

    constructor(props) {
        super(props);
        this.state = {
            seznamZelja: []
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', (playload) => {
            getPrijavljenUporabnik()
                .then((uporabnik) => {
                    let id = uporabnik.id;
                    return id;
                })
                .then((id) => {
                    getClosedZelje(id)
                        .then((seznamZelja) => {
                            this.setState({
                                seznamZelja: seznamZelja
                            })
                        }).catch((error) => {
                            this.setState({ seznamZelja: [] });
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    render() {
        const seznam = this.state.seznamZelja.map((p) => {

            let iconica = "";
            let iconType = "";
            if (p.kategorija === "Relationship") {
                iconica = 'account-heart'
                iconType = 'material-community';
            } else if (p.kategorija === "Sports") {
                iconica = 'soccer-ball-o';
                iconType = 'font-awesome';
            } else if (p.kategorija === "Adventure") {
                iconica = 'car-convertible';
                iconType = 'material-community';
            } else if (p.kategorija === "Other") {
                iconica = 'baidu';
                iconType = 'entypo';
            } else if (p.kategorija === "FoodDrinks") {
                iconica = 'food';
                iconType = 'material-community';

            } else if (p.kategorija === "Career") {
                iconica = 'money';
                iconType = 'font-awesome';
            } else if (p.kategorija === "Bodyhealth") {
                iconica = 'heartbeat';
                iconType = 'font-awesome'
            } else if (p.kategorija === "Travel") {
                iconica = 'plane';
                iconType = 'font-awesome';
            }

            let item = {
                id: p.id,
                naziv: p.naziv,
                opis: p.opis,
                kategorija: p.kategorija,
                ikonica: iconica,
                ikonicaType: iconType
            }

            return item;
        })
        return (
            <View style={styles.container} >
                <FlatList
                    data={seznam}
                    keyExtractor={() => Math.random().toString(36).substr(2, 9)}
                    renderItem={({ item }) =>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: "100%" }}>
                                <ListItem
                                    title={item.naziv}
                                    subtitle={item.opis}
                                    leftIcon={{
                                        name: item.ikonica,
                                        type: item.ikonicaType,
                                        color: '#517fa4',
                                        style: { marginRight: 25, marginLeft: 5 },
                                    }}
                                    rightIcon={{
                                        name: 'check-circle',
                                        type: "font-awesome",
                                        color: '#66BB6A',
                                    }}
                                    onPress={() => this.handleDetailsPress(item.id)}
                                />
                            </View>
                        </View>
                    }
                />
            </ View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'column',
        flex: 1
    }
});

export default CompletedWishes;