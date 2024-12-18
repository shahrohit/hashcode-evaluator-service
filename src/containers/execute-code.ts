import { TSubmitResponse, Testcase } from "@/utils/global-types";
import formatSingleQuote from "@/utils/format-single-quote";
import Docker from "dockerode";
import fetchDecodedStream from "./fetch-decoded-string";

export default async function executeCode(
  container: Docker.Container,
  testcases: Testcase[],
  executeCmd: string,
  timeLimit: number,
) {
  let acceptedCount = 0;
  let testCaseResult: TSubmitResponse = {
    executionOutput: "No Testcases",
    status: "Accepted",
  };
  for (const { input, output } of testcases) {
    testCaseResult = await Promise.race([
      executeTestcase(container, input, output, executeCmd),
      new Promise<TSubmitResponse>(resolve =>
        setTimeout(
          () =>
            resolve({
              input: input,
              output: output,
              executionOutput: "Code is Taking Longer than Expected Time",
              acceptedCount: acceptedCount,
              status: "TLE",
            }),
          timeLimit * 1000,
        ),
      ),
    ]);

    if (testCaseResult.status != "Accepted") break;
    acceptedCount++;
  }

  testCaseResult.acceptedCount = acceptedCount;

  return testCaseResult;
}

async function executeTestcase(
  container: Docker.Container,
  input: string,
  expectedOutput: string,
  executeCmd: string,
): Promise<TSubmitResponse> {
  const rawLogBuffer: Buffer[] = [];
  const formattedInput = formatSingleQuote(input);

  const runCmd = `echo '${formattedInput}' | ${executeCmd}`;

  const exec = await container.exec({
    Cmd: ["/bin/sh", "-c", runCmd],
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });

  const stream = await exec.start({ Detach: false, Tty: false });
  const codeResponse = await fetchDecodedStream(stream, rawLogBuffer);

  const exitCode = await exec.inspect();

  if (exitCode.ExitCode !== 0) {
    return {
      input: input,
      output: expectedOutput,
      status: "RTE",
      executionOutput: codeResponse,
    };
  }

  if (codeResponse.trim() === expectedOutput.trim()) {
    return { executionOutput: "Accepted", status: "Accepted" };
  } else {
    return {
      input: input,
      output: expectedOutput,
      executionOutput: codeResponse,
      status: "WrongAnswer",
    };
  }
}
