import * as R from 'ramda';

export type spaceType = 'apartment'|'house'|'flat';

export interface KNode {
    readonly rooms:number;
    readonly area:number;
}

export interface KnownKNode extends KNode {
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
    const allRooms = nodes.map(node => node.rooms);
    const allAreas = nodes.map(node => node.area);
    return {
        roomRange: Math.max.apply(Math.max, allRooms) - Math.min.apply(Math.min, allRooms),
        areaRange: Math.max.apply(Math.max, allAreas) - Math.min.apply(Math.min, allAreas)
    }
}

export function guessType(nodes: KnownKNode[], k: number, unknown: KNode): spaceType {

    const allNodes = [unknown].concat(nodes);
    const ranges = getRanges(allNodes);

    const values = nodes.map(node => ({
        type: node.type,
        dist: distanceBetween(ranges, unknown, node)
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
