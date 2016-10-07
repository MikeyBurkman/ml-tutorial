
/*
 * Basically the knapsack problem, solved using a genetic algorithm.
 * Given a set of elements, each with a weight and value, try to find the 
 *  combination of elements that would yield the most value without 
 *  going over the maximum weight allowed in the knapsack.
 */

import * as R from 'ramda';
import {Element} from './data';

export interface Params {
    readonly threshold: number;
    readonly numberOfChromosomes: number;
    readonly maxWeight: number;
    readonly elements: Element[];
    readonly mutationRate: number;
    readonly elitism: number;
}

export interface Result {
    readonly elements: string[];
    readonly weight: number;
    readonly value: number;
    readonly score: number;
}

export function run(params: Params): Result {
    const getScore = (c: ScoredPopulation) => c.chromosomes[0].score;

    // TODO: Make this functional?
    // This will reuire making it async with setTimeout to avoid overflowing the call stack.

    let noImprovement = 0;
    let highestScore = scorePopulation(newPopulation(params));

    while (noImprovement < params.threshold) {
        const nextPop = newPopulation(params, cullPopulation(highestScore))
        const scored = scorePopulation(nextPop);
        if (getScore(scored) > getScore(highestScore)) {
            highestScore = scored;
            noImprovement = 0;
        } else {
            noImprovement += 1;
        }
    }

    const highestChrome = highestScore.chromosomes[0];
    return {
        value: highestChrome.value,
        weight: highestChrome.weight,
        score: highestChrome.score,
        elements: getElementNames(params.elements, highestChrome)
    };
}

////

interface Chromosome {
    readonly elementIncluded: boolean[];
}

interface ScoredChromosome extends Chromosome {
    readonly weight: number;
    readonly value: number;
    readonly score: number;
}

interface Population {
    readonly params: Params;
    readonly chromosomes: (Chromosome|ScoredChromosome)[];
}

interface ScoredPopulation {
    readonly params: Params;
    readonly chromosomes: ScoredChromosome[];
}

function getElementNames(elements: Element[], chromosome: Chromosome): string[] {
    return chromosome.elementIncluded.reduce<string[]>((curList, included, idx) => {
        if (included) {
            curList.push(elements[idx].name);
        }   
        return curList;
    }, []);
}

function newPopulation(params: Params, previous?: Population): Population {
    const existing = previous ? previous.chromosomes : [];
    const newChromes = generateChromosomes(params, existing);
    return {
        params: params,
        chromosomes: newChromes
    };
}

function generateChromosomes(params: Params, existing: Chromosome[]): Chromosome[] {
    const newChromes = R.range(existing.length, params.numberOfChromosomes/3)
        .map(() => newRandomChromosome(params.elements));

    const allChromes = existing.concat(newChromes);

    const mated = R.range(existing.length + newChromes.length, params.numberOfChromosomes).map(() => {
        const chrome1 = allChromes[randInt(allChromes.length)];
        const chrome2 = allChromes[randInt(allChromes.length)];
        return mate(chrome1, chrome2);
    });

    const generated = allChromes.concat(mated);

    return generated.map(c => mutateIfNecessary(params.mutationRate, c));
}

function mutateIfNecessary(mutationRate: number, chromosome: Chromosome): Chromosome { 
    if (Math.random() < mutationRate) {
        return chromosome;
    } else {
        return mutate(chromosome);
    }
}

function mutate(chromosome: Chromosome): Chromosome {
    const idx = randInt(chromosome.elementIncluded.length);
    return {
        elementIncluded: chromosome.elementIncluded.map((ele, i) => {
            return (i === idx) ? !ele : ele;
        })
    };
}

function cullPopulation(population: ScoredPopulation): ScoredPopulation {
    const toKeep = Math.floor(population.params.elitism * population.chromosomes.length);
    return {
        params: population.params,
        chromosomes: population.chromosomes.slice(0, toKeep)
    };
}

function mate(chromosome1: Chromosome, chromosome2: Chromosome): Chromosome { 
    const pivot = randInt(chromosome1.elementIncluded.length);

    const fromFirstMate = chromosome1.elementIncluded.slice(0, pivot);
    const fromSecondMate = chromosome2.elementIncluded.slice(pivot);
    const mated = fromFirstMate.concat(fromSecondMate);

    return {
        elementIncluded: mated
    };
}

function scoreChromosome(maxWeight: number, elements: Element[], chromosome: Chromosome): ScoredChromosome {

    const includedElements = elements.filter((ele, idx) => chromosome.elementIncluded[idx]);
    const value = R.sum(includedElements.map(ele => ele.value));
    const weight = R.sum(includedElements.map(ele => ele.weight));

    const score = (weight <= maxWeight) ? value : value - ((weight - maxWeight) * 50);

    return {
        elementIncluded: chromosome.elementIncluded,
        value: value,
        weight: weight,
        score: score
    };
}

function scorePopulation(population: Population): ScoredPopulation {
    const score = (c: Chromosome) => scoreChromosome(population.params.maxWeight, population.params.elements, c);
    // Make sure it's sorted so high scores come first!
    const chromes = R.sortBy(x => -1 * x.score, population.chromosomes.map(score));
    return {
        params: population.params,
        chromosomes: chromes
    };
}

function newRandomChromosome(data: Element[]): Chromosome {
    return {
        elementIncluded: R.range(0, data.length).map(randBool)
    };
}

function randBool() {
    return randInt(2) > 0 ? true : false;
}

function randInt(max: number) {
    return Math.ceil(Math.random()*max) - 1;
}