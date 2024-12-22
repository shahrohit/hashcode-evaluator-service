import { CPP_IMAGE, JAVA_IMAGE, PYTHON_IMAGE } from "@utils/strings";

type LanguageMapper = {
  [language: string]: {
    image: string;
    compileCmd: string;
    executeCmd: string;
    timeFactor: number;
  };
};

let map: LanguageMapper = {
  cpp: {
    image: CPP_IMAGE,
    compileCmd: "Main.cpp && g++ -O2 Main.cpp -o Main",
    executeCmd: "./Main",
    timeFactor: 1,
  },
  java: {
    image: JAVA_IMAGE,
    compileCmd: "Main.java && javac Main.java",
    executeCmd: "java Main",
    timeFactor: 2,
  },
  python: {
    image: PYTHON_IMAGE,
    compileCmd: "Main.py",
    executeCmd: "python Main.py",
    timeFactor: 5,
  },
};

const getDockerImage = (language: string) => {
  language = language.toLowerCase();
  return map[language]?.image || "";
};

const getCompileCmd = (language: string) => {
  language = language.toLowerCase();
  return map[language]?.compileCmd || "";
};
const getExecuteCmd = (language: string) => {
  language = language.toLowerCase();
  return map[language]?.executeCmd || "";
};
const getTimeLimit = (language: string, baseTimeLimit: number) => {
  language = language.toLowerCase();
  return (map[language]?.timeFactor || 1) * baseTimeLimit;
};

export { getDockerImage, getCompileCmd, getExecuteCmd, getTimeLimit };
