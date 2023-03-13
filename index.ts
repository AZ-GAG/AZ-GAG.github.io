import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import assert from 'assert';

!existsSync('dist') && mkdirSync('dist');

const dataset = (() => {
  const question = readFileSync('dataset/question.csv')
    .toString()
    .split('\n')
    .filter((line) => line);
  const answer = readFileSync('dataset/answer.csv')
    .toString()
    .split('\n')
    .filter((line) => line);
  assert(question.length === answer.length);
  return question.map<[question: string, answer: string]>((_, i) => [
    question[i],
    answer[i],
  ]);
})();

writeFileSync('dist/index.json', JSON.stringify({ count: dataset.length }));
dataset.forEach(([question, answer], i) => {
  writeFileSync(`dist/${i}.json`, JSON.stringify({ question, answer }));
});
