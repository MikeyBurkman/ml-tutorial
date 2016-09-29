import * as R from 'ramda';

// Public API

export type dwellingType = 'apartment'|'house'|'flat';

export interface KNode {
    readonly rooms:number;
    readonly area:number;
}

export interface KnownKNode extends KNode {
    readonly type:dwellingType
}

export function guessType(nodes: KnownKNode[], k: number, unknown: KNode): dwellingType {
    const closestNodes = pickKClosest(k, nodes, unknown);
    return mostCommonType(closestNodes);
}

// Private stuff

interface Ranges {
    readonly roomRange: number,
    readonly areaRange: number
}

function distanceBetween(ranges: Ranges, node1: KNode, node2: KNode): number {
    const deltaRooms = (node1.rooms - node2.rooms)/ranges.roomRange;
    const deltaAreas = (node1.area - node2.area)/ranges.areaRange;
    return Math.sqrt(deltaRooms*deltaRooms + deltaAreas * deltaAreas);
}

function getRanges(nodes: KNode[]): Ranges{
    const allRooms = nodes.map(node => node.rooms);
    const allAreas = nodes.map(node => node.area);
    return {
        roomRange: Math.max.apply(Math.max, allRooms) - Math.min.apply(Math.min, allRooms),
        areaRange: Math.max.apply(Math.max, allAreas) - Math.min.apply(Math.min, allAreas)
    }
}

function pickKClosest(k: number, nodes: KnownKNode[], unknown: KNode): KnownKNode[] {
    const allNodes = [unknown].concat(nodes);
    const ranges = getRanges(allNodes);

    const nodeAndDist = nodes.map(node => ({
        node: node,
        dist: distanceBetween(ranges, unknown, node)
    }));
    
    const sorted = R.sortBy(a => a.dist, nodeAndDist);

    const topPicks = sorted.slice(0, k);

    return topPicks.map(pick => pick.node);
}

function mostCommonType(nodes: KnownKNode[]): dwellingType {
    const counts = R.countBy(pick => pick.type, nodes);

    let curCount = -1;
    let curType:dwellingType|null = null;
    Object.keys(counts).forEach(type => {
        if (counts[type] >= curCount) {
            curType = <dwellingType>type;
            curCount = counts[type];
        }
    });

    if (!curType) {
        throw new Error('No nodes provided, no common type can be found');
    }

    return curType;
}