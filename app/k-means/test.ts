
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

const numClusters = 3;
const clusters = findClusterPoints(numClusters, data);

// Note: this algorithm has some randomness to it, so the best we can really do
//  is calculate the clusters several times, and very that the most common result
//  is the following: [1.7142857142857142, 2], [7.5, 2.6666666666666665], [8.333333333333334, 9]
console.log('Clusters:', JSON.stringify(clusters, null, 2));

expect(clusters.length).to.eql(numClusters);