import { parseArgs } from 'node:util';
import { mkdir, writeFile, readdir } from 'fs/promises';
import { resolve } from 'path';

const {
  values: { day: parsedDay, all },
} = parseArgs({
  options: {
    all: {
      type: 'boolean',
    },
    day: {
      type: 'string',
    },
  },
});

const defaultFileContent = `
export const expectedPartOneSampleOutput = "";

export function solvePartOne(input: string): string {
  return "unanswered";
}

export const expectedPartTwoSampleOutput = "";

export function solvePartTwo(input: string): string {
  return "unanswered";
}
`.trimStart();

const day = parsedDay ? parseInt(parsedDay, 10) : await nextDayNumber();

const lastDay = all ? 25 : day;

for (let i = day; i <= lastDay; i++) {
  await bootstrapDay(i.toString());
}

async function nextDayNumber(): Promise<number> {
  const srcPath = resolve('./', 'src');
  const paths = await readdir(srcPath, { withFileTypes: true });

  const dirPaths = paths
    .filter((path) => path.isDirectory() && path.name.includes('day-'))
    .map((path) => parseInt(path.name.split('-')[1], 10))
    .sort((a, b) => a - b);

  if (dirPaths.length === 0) {
    return 1;
  }

  return dirPaths[dirPaths.length - 1] + 1;
}

async function bootstrapDay(day: string): Promise<void> {
  const dayDir = resolve('./', 'src', `day-${day}`);
  await mkdir(dayDir);

  const solutionFile = resolve(dayDir, 'solution.ts');
  await writeFile(solutionFile, defaultFileContent);

  const inputSampleFile = resolve(dayDir, 'input-sample.txt');
  await writeFile(inputSampleFile, ``);

  const inputRealFile = resolve(dayDir, 'input.txt');
  await writeFile(inputRealFile, ``);
}
