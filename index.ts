#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import *  as fs from 'fs';
import { WORK_DAY_COUNTS, WORK_DAY_EMOTIONS, WORK_DAY_FEELING, WORK_DAY_SCALE, WORK_DAY_TIMES } from './enums'
import { exec } from 'child_process';

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
    prompt([
      {
        type: 'rawlist',
        name: 'work_day_feeling',
        message: 'How was your work day?',
        choices: WORK_DAY_FEELING
      },
      {
        type: 'rawlist',
        name: 'work_with_others',
        message: 'I worked with other people?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'rawlist',
        name: 'help_others',
        message: 'I helped other people?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'rawlist',
        name: 'work_day_interruptions',
        message: 'My work was interrupted?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'rawlist',
        name: 'progress_towards_my_goals',
        message: 'I made progress toward my goals?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'rawlist',
        name: 'high_quality_work',
        message: 'I did high-quality work?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'rawlist',
        name: 'work_done',
        message: 'I did a lot of work?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'rawlist',
        name: 'work_day_emotions',
        message: 'Which best describes how you feel about your work day?',
        choices: WORK_DAY_EMOTIONS,
      },
      {
        type: 'rawlist',
        name: 'work_day_stress',
        message: 'My day was stressful?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'rawlist',
        name: 'work_day_breaks',
        message: 'I took breaks today	?',
        choices: WORK_DAY_SCALE,
      },
      {
        type: 'list',
        name: 'work_day_meetings',
        message: 'How many meetings did you have today?',
        choices: WORK_DAY_COUNTS 
      },
      {
        type: 'list',
        name: 'work_day_most_productive',
        message: 'Today, I felt most productive: ?',
        choices: WORK_DAY_TIMES 
      },
      {
        type: 'list',
        name: 'work_day_least_productive',
        message: 'Today, I felt least productive: ?',
        choices: WORK_DAY_TIMES 
      }
    ]).then(async (answers) => {
      const todayDate =  new Date().toLocaleDateString('es-CL');
      console.log(chalk.bgYellowBright.black(`saving your answers for today: ${ todayDate }`));

      if (!fs.existsSync('data.csv')) {
        const data = Object.keys(answers);
        data.push('date');
        writeInCSV(data);
      }

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
