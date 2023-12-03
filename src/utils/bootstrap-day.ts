import { parseArgs } from 'node:util';
import { mkdir, writeFile, readdir, rm } from 'fs/promises';
import { resolve } from 'path';
import { get } from 'https';
import { createInterface } from 'readline/promises';
import { stdin, stdout } from 'process';

let previousOverwriteAnswer: 'all' | 'skip' | null = null;

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
      let answer: 'yes' | 'no' | 'skip' | 'all' | null =
        previousOverwriteAnswer;

      if (previousOverwriteAnswer) {
        answer = previousOverwriteAnswer;
      } else {
        answer = await promptForOverwrite();
      }

      if (answer === 'yes' || answer === 'all') {
        console.log(`Overwriting day ${day}...`);
        await rm(dayDir, { recursive: true, force: true });
        await mkdir(dayDir);
      } else {
        console.log(`Skipping day ${day}...`);
        return;
      }
    } else {
      console.error(e);
      return;
    }
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

  console.log(`Directory ./src/day-${day} was created successfully.`);
}

async function promptForOverwrite(): Promise<'yes' | 'no' | 'all' | 'skip'> {
  const rl = createInterface({ input: stdin, output: stdout });
  const rawAnswer = await rl.question(
    'A folder for day ${day} already exists. Do you want to overwrite it? (y)es/(n)o/(a)ll/(s)kip)',
  );
  rl.close();

  if (rawAnswer.startsWith('s')) {
    previousOverwriteAnswer = 'skip';
    return 'skip';
  } else if (rawAnswer.startsWith('a')) {
    previousOverwriteAnswer = 'all';
    return 'all';
  } else if (rawAnswer.startsWith('n')) {
    return 'no';
  } else if (rawAnswer.startsWith('y')) {
    return 'yes';
  } else {
    console.log('Invalid answer, try again...');
    return await promptForOverwrite();
  }
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
                break;
              case 404:
                console.error(
                  'Input not available yet, try again later or make sure you have the correct year configured in your .env file',
                );
                break;
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
