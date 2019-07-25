import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Button, List, ListItem, Text, Icon } from 'react-native-elements';

import { getZelja } from '../../databases/queries';

import { strings } from '../../locales/i18n';

class WishDetails extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${strings('navigation.WishDetails')}`,
    });

    handleUpdatePress = (id) => {
        this.props.navigation.navigate('WishUpdate', { id });
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
            uresnicenost: '',
            zasebnost: ''
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => {
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
        })
    }

    render() {
        const id = this.state.id ? this.state.id : undefined;
        const naziv = this.state.naziv ? this.state.naziv : undefined;
        const opis = this.state.opis ? this.state.opis : undefined;
        const datumNastanka = this.state.datumNastanka ? this.state.datumNastanka : undefined;
        const lokacija = this.state.lokacija ? this.state.lokacija : undefined;
        let kategorija = this.state.kategorija ? this.state.kategorija : undefined;
        if (kategorija == 'Sports') {
            kategorija = `${strings('WishAdd.categorySports')}`;
        }
        else if (kategorija == 'Adventure') {
            kategorija = `${strings('WishAdd.categoryAdventure')}`;
        }
        else if (kategorija == 'FoodDrinks') {
            kategorija = `${strings('WishAdd.categoryFoodDrinks')}`;
        }
        else if (kategorija == 'Career') {
            kategorija = `${strings('WishAdd.categoryCareer')}`;
        }
        else if (kategorija == 'Bodyhealth') {
            kategorija = `${strings('WishAdd.categoryBodyhealth')}`;
        }
        else if (kategorija == 'Relationship') {
            kategorija = `${strings('WishAdd.categoryRelationship')}`;
        }
        else if (kategorija == 'Travel') {
            kategorija = `${strings('WishAdd.categoryTravel')}`;
        }
        else if (kategorija == 'Other') {
            kategorija = `${strings('WishAdd.categoryOther')}`;
        }
        const opombe = this.state.opombe ? this.state.opombe : undefined;
        const uresnicenost = this.state.uresnicenost ? `${strings('WishDetails.completed_yes')}` : `${strings('WishDetails.completed_no')}`;
        const zasebnost = this.state.zasebnost ? `${strings('WishDetails.privacy_yes')}` : `${strings('WishDetails.privacy_no')}`;

        return (
            <ScrollView>
                <Card containerStyle={{ marginBottom: 0, paddingBottom: 0 }}
                >
                    {naziv &&
                        <Text h3 style={{ marginBottom: 30, marginTop: 20, borderBottomWidth: 3, paddingBottom: 10 }}>{naziv}</Text>
                    }
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 20 }}>{strings('WishDetails.description')}</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            {opis &&
                                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }} >{opis}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 20 }}>{strings('WishDetails.location')}:</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            {lokacija &&
                                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }} >{lokacija}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 20 }}>{strings('WishDetails.category')}:</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            {kategorija &&
                                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }}>{kategorija}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 20 }}>{strings('WishDetails.completed')}:</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            {uresnicenost &&
                                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }} >{uresnicenost}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 20 }}>{strings('WishDetails.privacy')}:</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            {zasebnost &&
                                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }}>{zasebnost}</Text>
                            }
                        </View>
                    </View>
                </Card>
                <View style={{ width: '100%' }}>
                    <Button
                        icon={{
                            name: 'pencil',
                            type: 'simple-line-icon',
                            size: 18,
                            color: 'white'
                        }}
                        title={strings('WishDetails.update')}
                        buttonStyle={{ width: '100%', backgroundColor: '#66BB6A', height: 70 }}
                        onPress={() => this.handleUpdatePress(id)}
                    />
                </View>
            </ScrollView >
        )
    }
}

export default WishDetails;