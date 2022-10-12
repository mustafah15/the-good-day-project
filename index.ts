#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import *  as fs from 'fs';
import { exec } from 'child_process';
import { questions } from './questions';

const prompt = inquirer.createPromptModule();
const program = new Command();

program
  .name('log')
  .description('Start logging your work day info')
  .version('0.1.0');
 
function writeInCSV(data) {
  const stringData = data.join();
  return fs.appendFileSync('data.csv', stringData + '\n');
}

program.command('log')
  .description('Start logging your work day info')
  .action(() => {
    prompt(questions).then(async (answers) => {
      const todayDate =  new Date().toLocaleDateString('es-CL');
      console.log(chalk.bgYellowBright.black(`saving your answers for today: ${ todayDate }`));

      // write the column headers
      if (!fs.existsSync('data.csv')) {
        const data = Object.keys(answers);
        data.push('date');
        writeInCSV(data);
      }

      // write values
      const data = Object.values(answers);
      data.push(todayDate);
      writeInCSV(data);

      console.log(chalk.bgGreen.black(`your data saved successfully in data.csv file 🎉`));
      console.log(chalk.bgYellowBright.black(`now committing to your git repository.. ⏳`));

      try {
        await exec(`git add . && git commit -m ' adding data for ${todayDate} ' && git push`);
        console.log(chalk.bgGreen.black(`All Done ✨`));
      } catch (error) {
        console.log(chalk.bgRed.black(`error committing to git repository`));
      }

    });
  });

program.parse();
