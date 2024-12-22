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
    await pullDockerImage(this.docker, this.dockerImage);

    let container: Docker.Container | null = null;

    try {
      container = await createContainer(this.docker, this.dockerImage);
      await container.start();

      let formattedCode = formatSingleQuote(code);
      let runCompileCmd = `echo '${formattedCode}' > ${this.compileCmd}`;
      let compiledOutput = await compileCode(container, runCompileCmd);

      if (compiledOutput) {
        return {
          error: compiledOutput,
          status: "CompiledError",
          data: [],
        };
      }

      const codeResponse = await runCode(
        container,
        testcases,
        this.executeCmd,
        this.timeLimit,
      );

      formattedCode = formatSingleQuote(solutionCode);
      runCompileCmd = `echo '${formattedCode}' > ${this.compileCmd}`;
      compiledOutput = await compileCode(container, runCompileCmd);

      if (compiledOutput) {
        return {
          error: compiledOutput,
          status: "CompiledError",
          data: [],
        };
      }

      const solutionCodeResponse = await runCode(
        container,
        testcases,
        this.executeCmd,
        this.timeLimit,
      );

      const result: {
        input: string;
        output: string;
        executionOutput: string;
        status: SubmissionStatus;
      }[] = [];

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
          status: status as SubmissionStatus,
        });
      });

      return { status: overallStatus, error: null, data: result };
    } catch {
      return { data: [], error: "Internal Server Error", status: "Error" };
    } finally {
      try {
        if (container) {
          await container.remove({ force: true });
        }
      } catch {
        container?.kill();
      }
    }
  }
}
