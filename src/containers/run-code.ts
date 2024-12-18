import formatSingleQuote from "@/utils/format-single-quote";
import Docker from "dockerode";
import fetchDecodedStream from "./fetch-decoded-string";

export default async function runCode(
  container: Docker.Container,
  testcases: string[],
  executeCmd: string,
  timeLimit: number,
) {
  const result: { status: string; output: string }[] = [];
  for (const input of testcases) {
    const testCaseResult = await Promise.race([
      executeTestcase(container, input, executeCmd),
      new Promise<{ status: string; output: string }>(resolve =>
        setTimeout(
          () =>
            resolve({ status: "TLE", output: "Code is Taking longer time" }),
          timeLimit * 1000,
        ),
      ),
    ]);

    result.push(testCaseResult);
  }

  return result;
}

async function executeTestcase(
  container: Docker.Container,
  input: string,
  executeCmd: string,
): Promise<{ status: string; output: string }> {
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
    return { status: "RTE", output: codeResponse };
  }

  return { status: "Done", output: codeResponse };
}
