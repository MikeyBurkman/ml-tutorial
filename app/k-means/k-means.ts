
import * as R from 'ramda';

// Public API

export type Point = [number, number];

export function findClusterPoints(k: number, points: Point[]): Point[] {
    const initialClusters = R.range(0, k).map(randomPoint);
    const found = refineClusters(points, initialClusters);
    return R.sortBy(JSON.stringify, found);
} 

// Private functions

function distBetween(point1: Point, point2: Point): number {
    const deltaX = point1[0] - point2[0];
    const deltaY = point1[1] - point2[1];
    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
}

function averagePoint(points: Point[]): Point {
    const xs = R.map(point => point[0], points);
    const ys = R.map(point => point[1], points);
    return [
        R.sum(xs)/points.length || 1,
        R.sum(ys)/points.length || 1
    ];
}

function randomPoint(): Point {
    const max = 10;
    return [
        Math.ceil(Math.random() * max),
        Math.ceil(Math.random() * max)
    ];
}

// Returns the index of which cluster this point is closed to
function closestCluster(clusters: Point[], point: Point): number {
    const clusterDists = clusters.map((cluster, idx) => ({
        idx: idx,
        dist: distBetween(cluster, point)
    }));

    const sorted = R.sortBy(c => c.dist, clusterDists);

    return sorted[0].idx;
}

function refineClusters(points: Point[], clusters: Point[]): Point[] {

    const pointsToCluster: Point[][] = R.range(0, clusters.length).map(() => []);
    points.forEach(point => {
        const clusterIdx = closestCluster(clusters, point);
        pointsToCluster[clusterIdx].push(point);
    });

    const newClusters: Point[] = pointsToCluster.map(averagePoint);

    const pointChanged = (points: [Point, Point]) => distBetween(points[0], points[1]).toFixed(2) !== '0.00'

    const zipped = R.zip(clusters, newClusters);

    if (R.any(pointChanged, zipped)) {
        return refineClusters(points, newClusters);
    } else {
        return clusters;
    }
}