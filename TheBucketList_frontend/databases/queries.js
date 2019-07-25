import Realm from 'realm';

import { ZELJA_SCHEMA, JAVNAZELJA_SCHEMA, PREDLOGZELJA_SCHEMA, UPORABNIK_SCHEMA, ZeljaSchema, JavnaZeljaSchema, PredlogZeljaSchema, UporabnikSchema } from './schemas';

const databaseOptions = {
    path: 'thebucketlist.realm',
    schema: [ZeljaSchema, JavnaZeljaSchema, PredlogZeljaSchema, UporabnikSchema],
    schemaVersion: 0
}

export default new Realm(databaseOptions);

export const getOpenZelje = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let querryFilter = `uresnicenost == false AND uporabnik.id = ${id}`;
            let allZelja = realm.objects(ZELJA_SCHEMA).filtered(querryFilter);
            resolve(allZelja);
        }).catch((error) => {
            reject(error);
        });
});

export const getClosedZelje = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let querryFilter = `uresnicenost == true AND uporabnik.id = ${id}`;
            let allZelja = realm.objects(ZELJA_SCHEMA).filtered(querryFilter);
            resolve(allZelja);
        }).catch((error) => {
            reject(error);
        });
});

export const getZelja = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let zelja = realm.objects(ZELJA_SCHEMA).filtered(`id == ${id}`);
            resolve(zelja[0]);
        }).catch((error) => {
            reject(error);
        });
});

export const insertZelja = (id, newZelja) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let uporabnik = realm.objects(UPORABNIK_SCHEMA).filtered(`id == ${id}`);
                uporabnik[0].zelje.push(newZelja);
                resolve(newZelja);
            });
        }).catch((error) => {
            reject(error)
        });
});

export const updateZelja = (zelja) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let updatedZelja = realm.objectForPrimaryKey(ZELJA_SCHEMA, zelja.id);
                updatedZelja.naziv = zelja.naziv;
                updatedZelja.opis = zelja.opis;
                updatedZelja.datumNastanka = zelja.datumNastanka;
                updatedZelja.lokacija = zelja.lokacija;
                updatedZelja.kategorija = zelja.kategorija;
                updatedZelja.opombe = zelja.opombe;
                updatedZelja.uresnicenost = zelja.uresnicenost;
                updatedZelja.zasebnost = zelja.zasebnost;
                resolve();
            });
        }).catch((error) => {
            reject(error)
        });
});

export const deleteZelja = (zeljaId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let deletedZelja = realm.objectForPrimaryKey(ZELJA_SCHEMA, zeljaId);
                realm.delete(deletedZelja);
                resolve();
            });
        }).catch((error) => {
            reject(error)
        });
});




export const getAllJavnaZelja = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let alljavnaZelja = realm.objects(JAVNAZELJA_SCHEMA);
            resolve(alljavnaZelja);
        }).catch((error) => {
            reject(error);
        });
});

export const insertJavnaZelja = (newJavnaZelja) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                realm.create(JAVNAZELJA_SCHEMA, newJavnaZelja);
                resolve(newJavnaZelja);
            });
        }).catch((error) => {
            reject(error)
        });
});

export const deleteAllJavnaZelje = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let alljavnaZelja = realm.objects(JAVNAZELJA_SCHEMA);
                realm.delete(alljavnaZelja);
                resolve();
            });
        }).catch((error) => {
            reject(error)
        });
});



export const getAllPredlogZelja = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let allpredlogZelja = realm.objects(PREDLOGZELJA_SCHEMA);
            resolve(allpredlogZelja);
        }).catch((error) => {
            reject(error);
        });
});

export const insertPredlogZelja = (newPredlogZelja) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                newPredlogZelja.map(obj => {
                    let zelja = {
                        id: obj.id,
                        naziv: obj.naziv,
                        opis: obj.opis,
                        lokacija: obj.lokacija,
                        uporabnikId: obj.uporabnik_id
                    }
                    realm.create(PREDLOGZELJA_SCHEMA, zelja);
                })
                resolve();
            });
        }).catch((error) => {
            reject(error)
        });
});

export const deleteAllPredlogZelje = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let allpredlogZelja = realm.objects(PREDLOGZELJA_SCHEMA);
                realm.delete(allpredlogZelja);
                resolve();
            });
        }).catch((error) => {
            reject(error)
        });
});




export const getUporabnik = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let uporabnik = realm.objects(UPORABNIK_SCHEMA).filtered(`id == ${id}`);
            resolve(uporabnik[0]);
        }).catch((error) => {
            reject(error);
        });
});

export const getPrijavljenUporabnik = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            let uporabnik = realm.objects(UPORABNIK_SCHEMA).filtered(`prijavljen == true`);
            resolve(uporabnik[0]);
        }).catch((error) => {
            reject(error);
        });
});

export const insertUporabnik = (newUporabnik) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                realm.create(UPORABNIK_SCHEMA, newUporabnik);
                resolve(newUporabnik);
            });
        }).catch((error) => {
            reject(error)
        });
});

export const updateUporabnik = (uporabnik) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let updatedUporabnik = realm.objectForPrimaryKey(UPORABNIK_SCHEMA, uporabnik.id);
                updatedUporabnik.prijavljen = uporabnik.prijavljen;
                updatedUporabnik.uporabniskoIme = uporabnik.uporabniskoIme;
                updatedUporabnik.geslo = uporabnik.geslo;
                updatedUporabnik.ime = uporabnik.ime;
                updatedUporabnik.priimek = uporabnik.priimek;
                updatedUporabnik.email = uporabnik.email;
                resolve();
            });
        }).catch((error) => {
            reject(error)
        });
});

export const prijaviUporabnik = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let uporabnik = realm.objectForPrimaryKey(UPORABNIK_SCHEMA, id);
                uporabnik.prijavljen = true;
                resolve(uporabnik);
            });
        }).catch((error) => {
            reject(error);
        });
});

export const odjaviUporabnik = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            realm.write(() => {
                let uporabnik = realm.objectForPrimaryKey(UPORABNIK_SCHEMA, id);
                resolve(uporabnik.prijavljen = false);
            });
        }).catch((error) => {
            reject(error);
        });
});