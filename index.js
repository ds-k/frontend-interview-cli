#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import open from "open";
import quizList from "./quizList/index.js";

let curCategory;
let curNum;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

const onboarding = async () => {
  const msg = "Frontend\nInterview";

  figlet.text(msg, { font: "Big" }, (err, data) => {
    console.log(` 💻 프론트엔드 개발자 면접을 위한 질문 모음`);
    console.log(gradient.teen.multiline(data));
    console.log(` 😜 https://github.com/ds-k`);
  });
  await sleep();
  await qList();
};

async function qList() {
  console.clear();
  curCategory = "";
  const lists = await inquirer.prompt({
    name: "category",
    type: "rawlist",
    message: "질문을 보고 싶은 항목을 선택해주세요(문제는 랜덤으로 나옵니다.)",
    choices: [
      "CS",
      "Algorithm",
      "DataStructure",
      "JavaScript",
      "TypeScript",
      "React",
      "HTML_CSS",
      "Network",
      "Browser",
      "Auth",
    ],
  });
  curCategory = lists.category;

  return quiz();
}

async function quiz() {
  console.clear();
  const quizByCategory = quizList[curCategory];
  let randomInt = Math.floor(Math.random() * quizByCategory.length);
  while (curNum === randomInt) {
    randomInt = Math.floor(Math.random() * quizByCategory.length);
  }
  curNum = randomInt;
  console.log(chalk.bold(`👉 : ${quizByCategory[curNum].Q}`));

  chalkAnimation.karaoke(
    `\n\n\n충분히 생각해보고 정답을 확인해보세요.(아무 키나 눌러주세요.)\n\n\n`
  );

  await inquirer.prompt({
    name: "정답 확인",
    type: "confirm",
  });

  return showAnswer();
}

async function handleQuizAnswer(options) {
  if (options === "다음 문제") {
    quiz(curCategory);
  } else if (options === "깃허브 방문하기") {
    open("https://github.com/ds-k/frontend-interview-cli");
    qList();
  } else {
    qList();
  }
}

async function showAnswer() {
  console.log(`\n\n✅ : ${quizList[curCategory][curNum].A}\n\n`);
  const quiz = await inquirer.prompt({
    name: "options",
    message: "더 푸시겠습니까?",
    type: "list",
    choices: ["다음 문제", "목록으로 가기", "깃허브 방문하기"],
  });
  return handleQuizAnswer(quiz.options);
}

await onboarding();
