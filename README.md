# Advent of Code - 20XX - Typescript

This repository sets up everything you need to start solving the Advent of Code puzzles in Typescript.

## Features

- Watch mode for quick feedback
- Timing of solutions
- Automatic reading of input files through convention so that you can focus on solving the problem
- Automatic creation of files and folders for each day
- Eslint, Prettier, and Typechecking preconfigured

## Quick Start

> [!NOTE]  
> Prerequisites: You must have Node installed. We use modern Node features so please check .nvmrc to make sure you are on a compatible version.

1. Clone this repository
2. Run `npm install`
3. (Optionally) Rename the `.env.sample` file to `.env` and fill in your session cookie from adventofcode.com and the year. This will allow you to automatically fetch your input data instead of needing to copy and paste it into the input.txt file.
4. Run `npm run bootstrap-day` to create the files and folders for the first day. (pass `-- --day X` to create the files and folders for a specific day).
5. Copy and Paste your input (if you didn't complete step 3) and sample input into the `./src/day-x/input.txt` and `./src/day-x/input-sample-part-1.txt` files.
6. Go to `./src/day-x/solution.ts` and enter the `expectedPartOneSampleOutput` for your sample input data.
7. Run `npm run watch -- --day 1 --part 1 --test` to test your solution for day 1 against the sample input.
8. Code your solution in the `solvePartOne` function of `./src/day-x/solution.ts`
9. Run `npm run solve -- --day 1 --part 1` to run your solution against the input data.
10. Each day, run `npm run bootstrap-day` to create the files for the next day and continue solving the puzzles.

## Fetching Input (Optional)

If you want to automatically fetch your input data, you will need the following environment variables set:

`AOC_SESSION` - Your session cookie from adventofcode.com. You can find this by logging into adventofcode.com and looking at the value of the `session` cookie.
`AOC_YEAR` - The year you are solving for.

## Expected Folder Structure

### `./src/day-x/solution.ts`

Must export functions named `solvePartOne` and `solvePartTwo` that each take a string as args and returns a `string` or `Promise<string>`
(this function can be async). If you want to use test mode to run your solution against the sample input, you will need to export a string named `expectedPartOneSampleOutput` and `expectedPartTwoSampleOutput` that contains the expected output for the sample input.

### `./src/day-x/input.txt`

The input for the given day.

### `./src/day-x/input-sample-part-1.txt`

The sample input for part 1 for the given day.

### `./src/day-x/input-sample-part-2.txt`

The sample input for part 2 for the given day.

## Commands

### Solve Mode

To run your solution, enter your data into the input.txt file and run the following command:

```bash
npm run solve -- --day 1
```

This will run both parts 1 and 2. You can also run one part at a time by specifying the part flag:

```bash
npm run solve -- --day 1 --part 1
```

### Watch Mode

To run your solution in watch mode (so that your solutions rerun whenever you make changes)
enter your data into the input.txt file and run the following command:

```bash
npm run watch -- --day 1 --part 1
```

This supports the same --part flag as solve mode.

### Test Flag

You can run your solution against the sample input via the --test flag. This works in both watch and solve mode.

You will need to fill out the `expectedPartOneSampleOutput` and `expectedPartTwoSampleOutput` exported string in the solution.ts file with
the expected output for the sample input as well as fill in the `input-sample-part-1.txt` and `input-sample-part-2.txt` files with your sample input.

```bash
npm run watch -- --day 1 --part 1 --test
```

### Bootstrap Files for a Day

To bootstrap the files and folders for a day, run the following command:

```bash
npm run bootstrap-day
```

This will automatically create the files and folders for the next day.

To create a specific day, pass in the day flag:

```bash
npm run bootstrap-day -- --day 1
```

To create all the days at once, pass in the all flag:

```bash
npm run bootstrap-day -- --all
```

### Typecheck

To check your types, run the following command:

```bash
npm run typecheck
```

### Lint

To lint your code, run the following command:

```bash
npm run lint
```

### Format

To format your code, run the following command:

```bash
npm run prettier
```

## Contributing

### Commit Messages

This project uses [commitlint](https://commitlint.js.org/#/) to enforce conventional commit messages. Run `npm run commit` and follow the prompts to create a commit message.
