
import {expect} from 'chai';

import {TypeKnownDwelling, guessType} from './k-neighbor';


const knownNodes: TypeKnownDwelling[] = [{
    rooms: 1,
    area: 350,
    type: 'apartment'
}, {
    rooms: 2,
    area: 300,
    type: 'apartment'
}, {
    rooms: 3,
    area: 300,
    type: 'apartment'
}, {
    rooms: 4,
    area: 250,
    type: 'apartment'
}, {
    rooms: 4,
    area: 500,
    type: 'apartment'
}, {
    rooms: 4,
    area: 400,
    type: 'apartment'
}, {
    rooms: 5,
    area: 450,
    type: 'apartment'
}, {
    rooms: 7,
    area: 850,
    type: 'house'
}, {
    rooms: 7,
    area: 900,
    type: 'house'
}, {
    rooms: 7,
    area: 1200,
    type: 'house'
}, {
    rooms: 8,
    area: 1500,
    type: 'house'
}, {
    rooms: 9,
    area: 1300,
    type: 'house'
}, {
    rooms: 8,
    area: 1240,
    type: 'house'
}, {
    rooms: 10,
    area: 1700,
    type: 'house'
}, {
    rooms: 9,
    area: 1000,
    type: 'house'
}, {
    rooms: 1,
    area: 800,
    type: 'flat'
}, {
    rooms: 3,
    area: 900,
    type: 'flat'
}, {
    rooms: 2,
    area: 700,
    type: 'flat'
}, {
    rooms: 1,
    area: 900,
    type: 'flat'
}, {
    rooms: 2,
    area: 1150,
    type: 'flat'
}, {
    rooms: 1,
    area: 1000,
    type: 'flat'
}, {
    rooms: 2,
    area: 1200,
    type: 'flat'
}, {
    rooms: 1,
    area: 1300,
    type: 'flat'
}];

expect(guessType(knownNodes, 3, {
    rooms: 3,
    area: 350
})).to.eql('apartment');

expect(guessType(knownNodes, 3, {
    rooms: 3,
    area: 1200
})).to.eql('flat');

expect(guessType(knownNodes, 3, {
    rooms: 7,
    area: 1400
})).to.eql('house');

console.log('k-neighbor tests ran successfully');