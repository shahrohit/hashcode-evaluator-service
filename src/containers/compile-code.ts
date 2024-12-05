import Docker from "dockerode";
import fetchDecodedStream from "./fetch-decoded-string";
// compile Code
export default async function compileCode(
  container: Docker.Container,
  runCmd: string,
) {
  const compileExec = await container.exec({
    Cmd: ["/bin/sh", "-c", runCmd],
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });

  const compileStream = await compileExec.start({
    Detach: false,
    Tty: false,
  });
  return await fetchDecodedStream(compileStream);
}
