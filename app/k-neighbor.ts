import * as R from 'ramda';
import {expect} from 'chai';

type spaceType = 'apartment'|'house'|'flat';

interface KNode {
    readonly rooms:number;
    readonly area:number;
}

interface KnownKNode extends KNode {
    readonly type:spaceType
}

interface Ranges {
    roomRange: number,
    areaRange: number
}

function distanceBetween(ranges: Ranges, node1: KNode, node2: KNode): number {
    const deltaRooms = (node1.rooms - node2.rooms)/ranges.roomRange;
    const deltaAreas = (node1.area - node2.area)/ranges.areaRange;
    return Math.sqrt(deltaRooms*deltaRooms + deltaAreas * deltaAreas);
}

function getRanges(nodes: KNode[]): Ranges{
    var allRooms = nodes.map(node => node.rooms);
    var allAreas = nodes.map(node => node.area);
    return {
        roomRange: Math.max.apply(Math.max, allRooms) - Math.min.apply(Math.min, allRooms),
        areaRange: Math.max.apply(Math.max, allAreas) - Math.min.apply(Math.min, allAreas)
    }
}

function guessType(nodes: KnownKNode[], k: number, unknown: KNode): spaceType {

    const allNodes = [unknown].concat(knownNodes);
    const ranges = getRanges(allNodes);

    const diff = (node: KnownKNode) => distanceBetween(ranges, unknown, node);
    const values = nodes.map(node => ({
        type: node.type,
        dist: diff(node)
    }));
    
    const sorted = R.sortBy(a => a.dist, values);

    const topPicks = sorted.slice(0, k);

    const counts = R.countBy(pick => pick.type, topPicks);

    let curCount = -1;
    let curType:spaceType = 'house'; // Placeholder
    Object.keys(counts).forEach(type => {
        if (counts[type] >= curCount) {
            curType = <spaceType>type;
            curCount = counts[type];
        }
    });

    return curType;
}

///// Data and program below

const knownNodes: KnownKNode[] = [{
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
    rooms: 2,
    area: 1200
})).to.eql('flat');

expect(guessType(knownNodes, 3, {
    rooms: 7,
    area: 1400
})).to.eql('house');