
import {Point, findClusterPoints} from './k-means';
import {expect} from 'chai';

const data:Point[] = [  
    [1, 2],
    [2, 1],
    [2, 4], 
    [1, 3],
    [2, 2],
    [3, 1],
    [1, 1],

    [7, 3],
    [8, 2],
    [6, 4],
    [7, 4],
    [8, 1],
    [9, 2],

    [10, 8],
    [9, 10],
    [7, 8],
    [7, 9],
    [8, 10],
    [9, 9],
];

const clusters = findClusterPoints(3, data);

console.log('Clusters:', JSON.stringify(clusters, null, 2));

expect(clusters.length).to.eql(3);