import { TSubmitResponse, Testcase } from "@/utils/global-types";
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

export default class CodeExecutor {
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

  async execute(code: string, testcases: Testcase[]): Promise<TSubmitResponse> {
    await pullDockerImage(this.docker, this.dockerImage);

    let container: Docker.Container | null = null;

    try {
      container = await createContainer(this.docker, this.dockerImage);
      await container.start();

      const formattedCode = formatSingleQuote(code);
      const runCompileCmd = `echo '${formattedCode}' > ${this.compileCmd}`;
      const compiledOutput = await compileCode(container, runCompileCmd);

      if (compiledOutput) {
        return {
          acceptedCount: 0,
          executionOutput: compiledOutput,
          status: "CompiledError",
        };
      }

      return await executeCode(
        container,
        testcases,
        this.executeCmd,
        this.timeLimit,
      );
    } catch {
      return {
        acceptedCount: 0,
        executionOutput: "Internal Server Error",
        status: "Error",
      };
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
