import { TRunResponse, SubmissionStatus } from "@/utils/global-types";
import {
  getCompileCmd,
  getDockerImage,
  getExecuteCmd,
  getTimeLimit,
} from "@/containers/docker-helper";
import Docker from "dockerode";
import pullDockerImage from "@containers/pull-image";
import createContainer from "./create-docker-container";
import formatSingleQuote from "@/utils/format-single-quote";
import compileCode from "./compile-code";
import executeCode from "./execute-code";
import runCode from "./run-code";

export default class CodeRunner {
  private docker: Docker;
  private dockerImage: string;
  private compileCmd: string;
  private executeCmd: string;
  private timeLimit: number;

  constructor(language: string, baseTimeLimit: number) {
    this.docker = new Docker();
    this.dockerImage = getDockerImage(language);
    this.compileCmd = getCompileCmd(language);
    this.executeCmd = getExecuteCmd(language);
    this.timeLimit = getTimeLimit(language, baseTimeLimit);
  }

  async execute(
    code: string,
    solutionCode: string,
    testcases: string[],
  ): Promise<TRunResponse> {
    console.log("Pulling Docker Image....");
    await pullDockerImage(this.docker, this.dockerImage);

    let container: Docker.Container | null = null;

    try {
      console.log("Initilizing docker container...");
      container = await createContainer(this.docker, this.dockerImage);
      await container.start();

      let formattedCode = formatSingleQuote(code);
      let runCompileCmd = `echo '${formattedCode}' > ${this.compileCmd}`;
      console.log("Compiling code....");
      let compiledOutput = await compileCode(container, runCompileCmd);

      if (compiledOutput) {
        return {
          error: compiledOutput,
          status: "CompiledError",
          data: [],
        };
      }
      console.log("Compiled Successful");

      console.log("Evaluating Testcases...");
      const codeResponse = await runCode(
        container,
        testcases,
        this.executeCmd,
        this.timeLimit,
      );

      formattedCode = formatSingleQuote(solutionCode);
      runCompileCmd = `echo '${formattedCode}' > ${this.compileCmd}`;
      console.log("Compiling sol code....");
      compiledOutput = await compileCode(container, runCompileCmd);

      if (compiledOutput) {
        return {
          error: compiledOutput,
          status: "CompiledError",
          data: [],
        };
      }
      console.log("Compiled Successful");

      console.log("Evaluating Testcases...");
      const solutionCodeResponse = await runCode(
        container,
        testcases,
        this.executeCmd,
        this.timeLimit,
      );

      const result: any[] = [];

      let overallStatus: SubmissionStatus = "Accepted";
      testcases.forEach((testcase, i) => {
        if (!codeResponse[i] || !solutionCodeResponse[i]) return;
        let status = codeResponse[i].status;

        if (codeResponse[i].status === "Done") {
          if (codeResponse[i].output === solutionCodeResponse[i].output) {
            status = "Accepted";
          } else status = "WrongAnswer";
        }

        if (status !== "Accepted") overallStatus = status as SubmissionStatus;

        result.push({
          input: testcase,
          executionOutput: codeResponse[i].output,
          output: solutionCodeResponse[i].output,
          status,
        });
      });

      return { status: overallStatus, error: null, data: result };
    } catch (error: any) {
      return { data: [], error: "Internal Server Error", status: "Error" };
    } finally {
      try {
        if (container) {
          await container.remove({ force: true });
          console.log("Cleaned up container.");
        }
      } catch (cleanupError) {
        container?.kill();
      }
    }
  }
}
