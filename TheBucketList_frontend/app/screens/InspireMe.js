import React, { Component } from 'react';
import { FlatList, View, StyleSheet, Text, NetInfo } from 'react-native';
import { Card, ListItem, Button, SearchBar } from 'react-native-elements';

import { insertZelja, getPrijavljenUporabnik, getAllPredlogZelja, insertPredlogZelja, deleteAllPredlogZelje } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class InspireMe extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.InspireMeTab')}`,
    });

    handleWishAdded = (id) => {
        this.props.navigation.navigate('WishDetails', { id });
    }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            seznamZelja: [],
            searchZelje: ''
        };
    }

    componentDidMount() {
        getPrijavljenUporabnik().then((uporabnik) => {
            this.setState({
                id: uporabnik.id
            })
        }).catch((error) => {
            console.error(error);
        });

        this.props.navigation.addListener('willFocus', () => {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    fetch('https://tvabucketlist.herokuapp.com/javnezelje')
                        .then((result) => result.json())
                        .then((res) => {
                            this.setState({
                                seznamZelja: res
                            })
                            return res;
                        })
                        .then((res) => {
                            deleteAllPredlogZelje()
                                .catch((error) => {
                                    console.error(error);
                                });
                            return res;
                        })
                        .then((res) => {
                            insertPredlogZelja(res)
                                .catch((error) => {
                                    console.error(error);
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
                else {
                    getAllPredlogZelja()
                        .then((predlogZelja) => {
                            this.setState({
                                seznamZelja: predlogZelja
                            })
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            })
        })
    }

    addWish = (naziv, opis, lokacija) => {
        zelja = {
            id: (Math.floor(Date.now()) / 1000),
            naziv: naziv,
            opis: opis,
            datumNastanka: new Date(),
            lokacija: lokacija,
            opombe: '',
            kategorija: 'Other',
            uresnicenost: false,
            zasebnost: true
        }

        insertZelja(this.state.id, zelja)
            .then(() => {
                this.handleWishAdded(zelja.id);
            }).catch((error) => {
                console.error(error);
            });
    }

    onTextChange = (value) => {
        let lowerCaseCrke = value.toLowerCase();
        this.setState({ searchZelje: lowerCaseCrke });
    }


    render() {

        const filteredArray = this.state.seznamZelja.filter((p) => {
            let name = p.lokacija;
            return name.toLowerCase().indexOf(this.state.searchZelje) !== -1;
        });

        return (
            <View style={styles.container} >
                <SearchBar
                    containerStyle={{ backgroundColor: "#F4F4F4" }}
                    inputStyle={{ backgroundColor: "#F4F4F4" }}
                    lightTheme
                    showLoading
                    cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
                    onChangeText={(value) => this.onTextChange(value)}
                    placeholder={strings('InspireMe.searchText')} />
                <FlatList
                    data={filteredArray}
                    keyExtractor={() => Math.random().toString(36).substr(2, 9)}
                    renderItem={({ item }) =>
                        <ListItem
                            hideChevron
                            subtitle={
                                <View style={styles.rowDirection}>
                                    <View style={styles.textRowWidth}>
                                        <Text style={{ fontSize: 18, fontWeight: '600' }}>
                                            {item.naziv}
                                        </Text>
                                        <Text style={{ fontSize: 15, fontWeight: '400' }}>
                                            {item.opis}
                                        </Text>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: "#bb6766" }}>
                                            {item.lokacija}
                                        </Text>
                                    </View>
                                    <View style={styles.buttomRowWidth}>
                                        <Button
                                            title={strings('InspireMe.add')}
                                            icon={{
                                                name: 'playlist-add',
                                                color: 'white',

                                            }}
                                            onPress={() => this.addWish(item.naziv, item.opis, item.lokacija)}
                                            buttonStyle={{
                                                borderRadius: 7,
                                                textAlign: 'center',
                                                backgroundColor: '#66BB6A',
                                                height: 50,
                                            }}

                                        />
                                    </View>
                                </View>
                            }
                        />
                    }
                />
            </ View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'column',
        flex: 1
    },
    rowDirection: {
        flexDirection: 'row',
    },
    textRowWidth: {
        width: "62%",
        paddingLeft: 10
    },
    buttomRowWidth: {
        width: "37%",
        justifyContent: 'center',
    }
});

export default InspireMe;