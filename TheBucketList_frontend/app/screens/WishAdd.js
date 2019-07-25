import React, { Component } from 'react';
import { View, Picker, Switch, AsyncStorage, NetInfo, Alert, ScrollView } from 'react-native';
import { Card, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import { getPrijavljenUporabnik, insertZelja, insertJavnaZelja, getAllJavnaZelja, deleteAllJavnaZelje } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class WishAdd extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.WishAdd')}`,
    });

    handleWishAdded = () => {
        this.props.navigation.navigate('WishList');
    }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            naziv: '',
            opis: '',
            lokacija: '',
            opombe: '',
            kategorija: 'Other',
            zasebnost: true,
            naziverror: '',
            opiserror: '',
            lokacijaerror: ''
        };
    };

    componentDidMount() {
        getPrijavljenUporabnik().then((uporabnik) => {
            this.setState({
                id: uporabnik.id
            })
        }).catch((error) => {
            console.error(error);
        });
    }

    addWish = () => {
        let naziv = this.state.naziv;
        let opis = this.state.opis;
        let lokacija = this.state.lokacija;

        if (naziv === '' || opis === '' || lokacija === '') {
            if (naziv === '') {
                this.setState({ naziverror: strings('WishAdd.errormessage') });
            }
            else {
                this.setState({ naziverror: '' });
            }
            if (opis === '') {
                this.setState({ opiserror: strings('WishAdd.errormessage') });
            }
            else {
                this.setState({ opiserror: '' });
            }
            if (lokacija === '') {
                this.setState({ lokacijaerror: strings('WishAdd.errormessage') });
            }
            else {
                this.setState({ lokacijaerror: '' });
            }
        }
        else {
            this.setState({ naziverror: '' });
            this.setState({ opiserror: '' });
            this.setState({ lokacijaerror: '' });

            zelja = {
                id: (Math.floor(Date.now()) / 1000),
                naziv: this.state.naziv,
                opis: this.state.opis,
                datumNastanka: new Date(),
                lokacija: this.state.lokacija,
                opombe: this.state.opombe,
                kategorija: this.state.kategorija,
                uresnicenost: false,
                zasebnost: this.state.zasebnost
            }

            insertZelja(this.state.id, zelja)
                .then(() => {
                    if (zelja.zasebnost === false) {
                        javnaZelja = {
                            id: (Math.floor(Date.now()) / 1000), 
                            naziv: this.state.naziv,
                            opis: this.state.opis,
                            lokacija: this.state.lokacija, 
                            uporabnikId: this.state.id
                        }
                                                    
                        insertJavnaZelja(javnaZelja)
                        .catch((error) => {
                            console.error(error);
                        });
                    }
                })
                .then(() => {
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
                            }
                        )
                    }
                })
            })
            .then(() => {
                this.handleWishAdded();
            })
            .catch((error) => {
                  console.error(error);
            });
        }
    }

    privacyChange = (value) => {
        this.setState({ zasebnost: value });

        if (value === false) {
            Alert.alert(
                `${strings('WishAdd.alert')}`,
                `${strings('WishAdd.alertprivacy')}`,
                [
                    { text: strings('WishAdd.alertok') },
                ]
            )
        }
    }

    render() {
        const naziverror = this.state.naziverror ? this.state.naziverror : undefined;
        const opiserror = this.state.opiserror ? this.state.opiserror : undefined;
        const lokacijaerror = this.state.lokacijaerror ? this.state.lokacijaerror : undefined;

        return (
            <View>
                <ScrollView>
                    <Card title={strings('WishAdd.title')}>
                        <FormLabel>{strings('WishAdd.name')}</FormLabel>
                        <FormInput
                            onChangeText={naziv => this.setState({ naziv })}
                        />
                        {naziverror &&
                            <FormValidationMessage>{naziverror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('WishAdd.description')}</FormLabel>
                        <FormInput
                            onChangeText={opis => this.setState({ opis })}
                        />
                        {opiserror &&
                            <FormValidationMessage>{opiserror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('WishAdd.location')}</FormLabel>
                        <FormInput
                            onChangeText={lokacija => this.setState({ lokacija })}
                        />
                        {lokacijaerror &&
                            <FormValidationMessage>{lokacijaerror}</FormValidationMessage>
                        }

                        <FormLabel>{strings('WishAdd.notes')}</FormLabel>
                        <FormInput
                            onChangeText={opombe => this.setState({ opombe })}
                        />

                        <FormLabel>{strings('WishAdd.category')}</FormLabel>
                        <View style={{ marginLeft: 12 }}>
                            <Picker
                                selectedValue={this.state.kategorija}
                                onValueChange={(value) => this.setState({ kategorija: value })}
                            >
                                <Picker.Item value="Sports" label={strings('WishAdd.categorySports')} />
                                <Picker.Item value="Adventure" label={strings('WishAdd.categoryAdventure')} />
                                <Picker.Item value="FoodDrinks" label={strings('WishAdd.categoryFoodDrinks')} />
                                <Picker.Item value="Career" label={strings('WishAdd.categoryCareer')} />
                                <Picker.Item value="Bodyhealth" label={strings('WishAdd.categoryBodyhealth')} />
                                <Picker.Item value="Relationship" label={strings('WishAdd.categoryRelationship')} />
                                <Picker.Item value="Travel" label={strings('WishAdd.categoryTravel')} />
                                <Picker.Item value="Other" label={strings('WishAdd.categoryOther')} />
                            </Picker>
                        </View>

                        <FormLabel>{strings('WishAdd.privacy')}</FormLabel>
                        <Switch
                            value={this.state.zasebnost}
                            onValueChange={(value) => this.privacyChange(value) }
                        />
                    </Card>
                    <View style={{ width: "100%", marginRight: 0, marginLeft: 0, height: 60, marginBottom: 30 }}>
                        <Button
                            icon={{
                                name: 'add-to-list',
                                type: 'entypo',
                                size: 18,
                                color: 'white'
                            }}
                            buttonStyle={{ height: 60 }}
                            backgroundColor="#66BB6A"
                            title={strings('WishAdd.add')}
                            onPress={this.addWish}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default WishAdd;