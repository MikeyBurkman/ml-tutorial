
import * as R from 'ramda';

interface KNode {
    readonly rooms:number;
    readonly area:number;
}

interface KnownKNode extends KNode {
    readonly type:string
}

interface KNodeList {
    readonly k:number;
    nodes:KNode[]
}

function normalize(values:number[]) {
    const ratio = Math.max.apply(Math.max, values)/1.0;
    return R.map(n => n / ratio, values);
}

console.log(normalize([2, 4, 3, 6, 12]));