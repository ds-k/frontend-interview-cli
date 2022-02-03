#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const quizList = require("./quizList.json");

let curCategory;
let curNum;

const sleep = (ms = 1500) => new Promise((r) => setTimeout(r, ms));

const onboarding = async () => {
  const rainbowTitle = chalkAnimation.rainbow(
    `프론트엔드 개발자 면접을 위한 질문 모음\n`
  );

  await sleep();
  rainbowTitle.stop();

  console.log(
    `${chalk.blue(
      "Github repo : https://github.com/daeseongkim05/frontend-interview-cli"
    )}\n`
  );
  await qList();
};

// ! 목록
async function qList() {
  curCategory = "";
  const lists = await inquirer.prompt({
    name: "category",
    type: "list",
    message: "질문을 보고 싶은 항목을 선택해주세요(문제는 랜덤으로 나옵니다.)",
    choices: ["Javascript", "React"],
  });
  curCategory = lists.category;

  return quiz(curCategory);
}

// ! 문제
async function quiz(category) {
  const quizCategory = quizList[category];
  curNum = Math.floor(Math.random() * quizCategory.length);

  console.log(`
  
${quizCategory[curNum].Q}`);

  const radarTitle = chalkAnimation.rainbow(
    `

충분히 생각해보고 정답을 확인해보세요.(아무 키나 눌러주세요.)

      `
  );

  await inquirer.prompt({
    name: "정답은....?",
    type: "confirm",
  });

  return showAnswer(curCategory, curNum);
}

// ! 옵션 처리
async function handleQuizAnswer(options) {
  if (options === "다음 문제") {
    quiz(curCategory);
  } else {
    qList();
  }
}

async function showAnswer(category, num) {
  console.log(`
  
  ${quizList[category][num].A}
    
    `);
  const quiz = await inquirer.prompt({
    name: "options",
    message: "더 푸시겠습니까?",
    type: "list",
    choices: ["다음 문제", "목록으로 가기"],
  });
  return handleQuizAnswer(quiz.options);
}

await onboarding();
