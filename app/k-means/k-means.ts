
/*
 * Attempts to find the centers of clusters in a known set of points. The number 
 *  of clusters is assumed to be known ahead of time (k). If k = 3, then the 
 *  algorithm will return 3 points, each of which is the approximate center of
 *  each of 3 clusters in the set of points. 
 */

import * as R from 'ramda';

// Public API

export type Point = [number, number];

export function findClusterPoints(k: number, points: Point[]): Point[] {
    const initialClusters = R.range(0, k).map(randomPoint);
    const found = refineClusters(points, initialClusters);
    return R.sortBy(JSON.stringify, found);
} 

// Private functions

type Cluster = Point[];

function randomPoint(): Point {
    const max = 10;
    return [
        Math.ceil(Math.random() * max),
        Math.ceil(Math.random() * max)
    ];
}

function distanceBetween(point1: Point, point2: Point): number {
    const deltaX = point1[0] - point2[0];
    const deltaY = point1[1] - point2[1];
    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
}

// Returns the index of which cluster center this point is closest to
function closestCluster(clusterCenters: Point[], point: Point): number {
    const clusterDists = clusterCenters.map((clusterCenter, idx) => ({
        idx: idx,
        dist: distanceBetween(clusterCenter, point)
    }));

    const sorted = R.sortBy(c => c.dist, clusterDists);

    return sorted[0].idx;
}

// Groups each point to the cluster center it's closest too.
// results[0] -> the list of points closest to clusterCenters[0], etc.
function groupPointsToClusters(points: Point[], clusterCenters: Point[]): Cluster[] {
    const clusters: Cluster[] = clusterCenters.map(() => []);

    points.forEach(point => {
        const clusterIdx = closestCluster(clusterCenters, point);
        clusters[clusterIdx].push(point);
    });

    return clusters;
}

function averagePoint(points: Point[]): Point {
    const xs = R.map(point => point[0], points);
    const ys = R.map(point => point[1], points);
    return [
        R.sum(xs)/points.length || 1,
        R.sum(ys)/points.length || 1
    ];
}

function pointHasChanged(points: [Point, Point]): boolean {
    return distanceBetween(points[0], points[1]).toFixed(3) !== '0.000';
}

function calculateNewCenter(cluster: Cluster): Point {
    // If we get a cluster with no points assigned to it, pick a new 
    //  random point, so it's not a permanently dead cluster
    return cluster.length === 0 ? randomPoint() : averagePoint(cluster);
}

function refineClusters(points: Point[], clusterCenters: Point[]): Point[] {

    const clusters = groupPointsToClusters(points, clusterCenters);

    const newClusterCenters = clusters.map(calculateNewCenter);

    if (R.any(pointHasChanged, R.zip(clusterCenters, newClusterCenters))) {
        return refineClusters(points, newClusterCenters);
    } else {
        return clusterCenters;
    }
}