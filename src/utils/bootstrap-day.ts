import { parseArgs } from 'node:util';
import { mkdir, writeFile, readdir } from 'fs/promises';
import { resolve } from 'path';
import { get } from 'https';

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

  try {
    await mkdir(dayDir);
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'EEXIST') {
      console.error(`A folder for day ${day} already exists. Skipping...`);
    } else {
      console.error(e);
    }

    return;
  }

  const solutionFile = resolve(dayDir, 'solution.ts');
  await writeFile(solutionFile, defaultFileContent);

  const inputSamplePartOneFile = resolve(dayDir, 'input-sample-part-1.txt');
  await writeFile(inputSamplePartOneFile, ``);

  const inputSamplePartTwoFile = resolve(dayDir, 'input-sample-part-2.txt');
  await writeFile(inputSamplePartTwoFile, ``);

  const inputRealFile = resolve(dayDir, 'input.txt');

  let input = '';
  try {
    const fetchedInput = await fetchInputIfConfigured(day);

    if (fetchedInput != null) {
      input = fetchedInput;
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }

    return;
  }

  await writeFile(inputRealFile, input);
}

async function fetchInputIfConfigured(day: string): Promise<string | null> {
  if (!process.env.AOC_YEAR) {
    console.info(
      'No AOC_YEAR found in .env file, skipping fetch from adventofcode.com',
    );
    return null;
  }

  if (!process.env.AOC_SESSION) {
    console.info(
      'No AOC_YEAR found in .env file, skipping fetch from adventofcode.com',
    );
    return null;
  }

  console.log(
    `Fetching input from adventofcode.com... (YEAR: ${process.env.AOC_YEAR}, DAY: ${day})`,
  );

  return new Promise((resolve, reject) => {
    const req = get(
      `https://adventofcode.com/${process.env.AOC_YEAR}/day/${day}/input`,
      {
        headers: {
          cookie: `session=${process.env.AOC_SESSION}`,
        },
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('Fetched input from adventofcode.com...');
            resolve(data);
          } else {
            console.error(
              `Failed to fetch input from adventofcode.com... status: ${res.statusCode}: ${res.statusMessage}`,
            );

            switch (res.statusCode) {
              case 400:
                console.error(
                  'This may be because the AOC_SESSION value set in your .env file is invalid.',
                );
              case 404:
                console.error(
                  'Input not available yet, try again later or make sure you have the correct year configured in your .env file',
                );
              default:
                console.error(
                  'Unknown error. Please check your .env file to make sure it is configured correctly.',
                );
            }

            reject();
          }
        });
      },
    );

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
