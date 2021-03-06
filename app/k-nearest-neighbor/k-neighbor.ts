/*
 * Attempts to figure out the dwelling type (apartment, house, or flat) of a dwelling
 *  using a set of known values. Will find the k most-similar dwellings, and will 
 *  return the type that most of those k dwellings share.
 */


import * as R from 'ramda';

// Public API

export type DwellingType = 'apartment'|'house'|'flat';

export interface Dwelling {
    readonly rooms:number;
    readonly area:number;
}

export interface TypeKnownDwelling extends Dwelling {
    readonly type: DwellingType
}

export function guessType(nodes: TypeKnownDwelling[], k: number, unknown: Dwelling): DwellingType {
    const closestNodes = pickKClosest(k, nodes, unknown);
    return mostCommonType(closestNodes);
}

// Private stuff

interface Ranges {
    readonly roomRange: number,
    readonly areaRange: number
}

function distanceBetween(ranges: Ranges, node1: Dwelling, node2: Dwelling): number {
    const deltaRooms = (node1.rooms - node2.rooms)/ranges.roomRange;
    const deltaAreas = (node1.area - node2.area)/ranges.areaRange;
    return Math.sqrt(deltaRooms*deltaRooms + deltaAreas * deltaAreas);
}

function getRanges(nodes: Dwelling[]): Ranges{
    const allRooms = nodes.map(node => node.rooms);
    const allAreas = nodes.map(node => node.area);
    return {
        roomRange: Math.max.apply(Math.max, allRooms) - Math.min.apply(Math.min, allRooms),
        areaRange: Math.max.apply(Math.max, allAreas) - Math.min.apply(Math.min, allAreas)
    }
}

function pickKClosest(k: number, nodes: TypeKnownDwelling[], unknown: Dwelling): TypeKnownDwelling[] {
    const allNodes = [unknown].concat(nodes);
    const ranges = getRanges(allNodes);

    const sortedNodes = R.sortBy(node => distanceBetween(ranges, unknown, node), nodes);

    return sortedNodes.slice(0, k);
}

function mostCommonType(nodes: TypeKnownDwelling[]): DwellingType {
    const counts = R.countBy(pick => pick.type, nodes);

    let curCount = -1;
    let curType: DwellingType|null = null;
    Object.keys(counts).forEach(type => {
        if (counts[type] >= curCount) {
            curType = <DwellingType>type;
            curCount = counts[type];
        }
    });

    if (!curType) {
        throw new Error('No nodes provided, no common type can be found');
    }

    return curType;
}