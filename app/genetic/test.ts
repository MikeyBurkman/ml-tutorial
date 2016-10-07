
import {run} from './ga';
import {getData} from './data';

const result = run({
    elements: getData(),
    threshold: 10000,
    numberOfChromosomes: 50,
    elitism: 0.4,
    maxWeight: 1000,
    mutationRate: 0.6
});

// Highest score should be 5968, with a weight of 998
console.log(result); 