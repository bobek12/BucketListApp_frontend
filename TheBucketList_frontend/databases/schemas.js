import Realm from 'realm';

export const ZELJA_SCHEMA = 'Zelja';
export const JAVNAZELJA_SCHEMA = 'JavnaZelja';
export const PREDLOGZELJA_SCHEMA = 'PredlogZelja';
export const UPORABNIK_SCHEMA = 'Uporabnik'

export const ZeljaSchema = {
    name: ZELJA_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        naziv: 'string',
        opis: 'string',
        datumNastanka: 'date',
        lokacija: 'string',
        kategorija: 'string',
        opombe: 'string',
        uresnicenost: {
            type: 'bool',
            default: false
        },
        zasebnost: 'bool',
        uporabnik: {
            type: 'linkingObjects', 
            objectType: UPORABNIK_SCHEMA, 
            property: 'zelje'
        }
    }
};

export const JavnaZeljaSchema = {
    name: JAVNAZELJA_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        naziv: 'string',
        opis: 'string',
        lokacija: 'string',
        uporabnikId: 'int'
    }
};

export const PredlogZeljaSchema = {
    name: PREDLOGZELJA_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        naziv: 'string',
        opis: 'string',
        lokacija: 'string',
        uporabnikId: 'int'
    }
};

export const UporabnikSchema = {
    name: UPORABNIK_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        prijavljen: 'bool',
        uporabniskoIme: 'string',
        geslo: 'string',
        ime: 'string',
        priimek: 'string',
        email: 'string',
        zelje: {
            type: 'list',
            objectType: ZELJA_SCHEMA
        },
        javnezelje: {
            type: 'list',
            objectType: PREDLOGZELJA_SCHEMA
        },
    }
};