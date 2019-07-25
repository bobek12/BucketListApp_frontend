import React, { Component } from 'react';
import { ScrollView, Text, View, Picker, Switch } from 'react-native';
import { Card, Button, List, ListItem, FormLabel, FormInput } from 'react-native-elements';

import { getZelja, updateZelja, deleteZelja } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class WishUpdate extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.WishUpdate')}`,
    });

    handleWishUpdated = (id) => {
        this.props.navigation.navigate('WishDetails', { id });
    }
    handleWishDeleted = () => {
        this.props.navigation.navigate('WishList');
    }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            naziv: '',
            opis: '',
            datumNastanka: '',
            lokacija: '',
            kategorija: '',
            opombe: '',
            uresnicenost: false,
            zasebnost: false
        };
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const id = params ? params.id : null;

        getZelja(id).then((zelja) => {
            this.setState({
                id: zelja.id,
                naziv: zelja.naziv,
                opis: zelja.opis,
                datumNastanka: zelja.datumNastanka,
                lokacija: zelja.lokacija,
                kategorija: zelja.kategorija,
                opombe: zelja.opombe,
                uresnicenost: zelja.uresnicenost,
                zasebnost: zelja.zasebnost
            })
        }).catch((error) => {
            console.error(error);
        });
    }

    updateWish = () => {
        zelja = {
            id: this.state.id,
            naziv: this.state.naziv,
            opis: this.state.opis,
            datumNastanka: this.state.datumNastanka,
            lokacija: this.state.lokacija,
            kategorija: this.state.kategorija,
            opombe: this.state.opombe,
            uresnicenost: this.state.uresnicenost,
            zasebnost: this.state.zasebnost
        }

        updateZelja(zelja)
            .then(() => {
                this.handleWishUpdated(this.state.id)
            }).catch((error) => {
                console.error(error);
            });
    }

    deleteWish = () => {
        deleteZelja(this.state.id)
            .then(() => {
                this.handleWishDeleted()
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        const naziv = this.state.naziv ? this.state.naziv : undefined;
        const opis = this.state.opis ? this.state.opis : undefined;
        const lokacija = this.state.lokacija ? this.state.lokacija : undefined;
        const kategorija = this.state.kategorija ? this.state.lokacija : undefined;
        const opombe = this.state.opombe ? this.state.opombe : undefined;

        return (
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'column',
                flex: 1
            }}>
                <ScrollView>

                    <Card title={strings('WishUpdate.title')}>
                        <FormLabel>{strings('WishUpdate.name')}</FormLabel>
                        <FormInput
                            value={naziv}
                            onChangeText={naziv => this.setState({ naziv })}
                        />
                        <FormLabel>{strings('WishUpdate.description')}</FormLabel>
                        <FormInput
                            value={opis}
                            onChangeText={opis => this.setState({ opis })}
                        />
                        <FormLabel>{strings('WishUpdate.location')}</FormLabel>
                        <FormInput
                            value={lokacija}
                            onChangeText={lokacija => this.setState({ lokacija })}
                        />
                        <FormLabel>{strings('WishUpdate.notes')}</FormLabel>
                        <FormInput
                            value={opombe}
                            onChangeText={opombe => this.setState({ opombe })}
                        />

                        <FormLabel>{strings('WishUpdate.category')}</FormLabel>
                        <View style={{ marginLeft: 12 }}>
                            <Picker
                                selectedValue={this.state.kategorija}
                                onValueChange={(value) => this.setState({ kategorija: value })}
                            >
                                <Picker.Item value="Sports" label={strings('WishUpdate.categorySports')} />
                                <Picker.Item value="Adventure" label={strings('WishUpdate.categoryAdventure')} />
                                <Picker.Item value="FoodDrinks" label={strings('WishUpdate.categoryFoodDrinks')} />
                                <Picker.Item value="Career" label={strings('WishUpdate.categoryCareer')} />
                                <Picker.Item value="Bodyhealth" label={strings('WishUpdate.categoryBodyhealth')} />
                                <Picker.Item value="Relationship" label={strings('WishUpdate.categoryRelationship')} />
                                <Picker.Item value="Travel" label={strings('WishUpdate.categoryTravel')} />
                                <Picker.Item value="Other" label={strings('WishUpdate.categoryOther')} />
                            </Picker>
                        </View>

                        <FormLabel>{strings('WishUpdate.completed')}</FormLabel>
                        <Switch
                            value={this.state.uresnicenost}
                            onValueChange={(value) => this.setState({ uresnicenost: value })}
                        />
                    </Card>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <View style={{ width: "100%", marginRight: 0, marginLeft: 0, height: 60 }}>
                            <Button
                                icon={{
                                    name: 'refresh',
                                    type: 'evillcons',
                                    size: 18,
                                    color: 'white'
                                }}
                                buttonStyle={{ height: 60 }}
                                backgroundColor="#66BB6A"
                                title={strings('WishUpdate.update')}
                                onPress={this.updateWish}
                            />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginRight: 0, marginLeft: 0, height: 60, marginBottom: 20 }}>
                        <Button
                            icon={{
                                name: 'delete',
                                type: 'feather',
                                size: 18,
                                color: 'white'
                            }}
                            buttonStyle={{ height: 60 }}
                            backgroundColor="red"
                            title={strings('WishUpdate.delete')}
                            onPress={this.deleteWish}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default WishUpdate;