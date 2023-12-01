import { parseArgs } from 'node:util';
import { readFile } from 'fs/promises';

const {
  values: { day, part, test },
} = parseArgs({
  options: {
    day: {
      type: 'string',
    },
    part: {
      type: 'string',
    },
    test: {
      type: 'boolean',
    },
  },
});

if (!day) {
  console.error(
    'Must provide day (1 - 24) and part (optionally) (1 or 2) as command line arguments.\n',
  );
  console.error(`Example:\n`);
  console.error(
    `   npm run ${process.env['npm_lifecycle_event']} -- --day 1 --part 1`,
  );
  process.exit(1);
}

const {
  solvePartOne,
  solvePartTwo,
  expectedPartOneSampleOutput,
  expectedPartTwoSampleOutput,
} = await import(`./day-${day}/solution.ts`);

if (!part || part === '1') {
  if (test) {
    console.log(`Testing day ${day}, part 1...`);
  } else {
    console.log(`Solving day ${day}, part 1...`);
  }

  checkSolverFunctionOrExit(solvePartOne);

  const inputPath = test
    ? `./src/day-${day}/input-sample-part-1.txt`
    : `./src/day-${day}/input.txt`;
  const input = await readFile(inputPath, 'utf8');

  console.time('Duration');
  const partOneAnswer = await solvePartOne(input);

  if (test) {
    assertTestResult(partOneAnswer, expectedPartOneSampleOutput, '1');
  } else {
    console.log(`Answer: ${partOneAnswer}`);
  }

  console.timeEnd('Duration');

  if (!part) {
    console.log(``);
  }
}

if (!part || part === '2') {
  if (test) {
    console.log(`Testing day ${day}, part 2...`);
  } else {
    console.log(`Solving day ${day}, part 2...`);
  }

  checkSolverFunctionOrExit(solvePartTwo);

  const inputPath = test
    ? `./src/day-${day}/input-sample-part-2.txt`
    : `./src/day-${day}/input.txt`;
  const input = await readFile(inputPath, 'utf8');

  console.time('Duration');
  const partTwoAnswer = await solvePartTwo(input);

  if (test) {
    assertTestResult(partTwoAnswer, expectedPartTwoSampleOutput, '2');
  } else {
    console.log(`Answer: ${partTwoAnswer}`);
  }

  console.timeEnd('Duration');
}

function assertTestResult(actual: unknown, expected: unknown, part: string) {
  if (actual === expected) {
    console.log(
      `Day ${day}, part ${part} test passed! Expected: "${expected}", actual: "${actual}"`,
    );
  } else {
    console.error(
      `Day ${day}, part ${part} test failed! Expected: "${expected}", actual: "${actual}"`,
    );
  }
}

function checkSolverFunctionOrExit(solver: unknown) {
  if (!solver || typeof solver !== 'function') {
    console.error(`No solve function found for day ${day}, part ${part}.`);
    console.error(`Example:`);
    console.error(
      `    
          "./src/day-1/solution.ts"
          
          export async function solvePartOne(input: string): Promise<string> { 
              return "answer"; 
          }

          export async function solvePartTwo(input: string): Promise<string> { 
            return "answer"; 
          } 
      `,
    );
    process.exit(1);
  }
}
