import Docker from "dockerode";

export default async function createContainer(
  docker: Docker,
  dockerImage: string,
) {
  const container = await docker.createContainer({
    Image: dockerImage,
    Cmd: ["/bin/sh", "-c", "tail -f /dev/null"],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    OpenStdin: true,
    HostConfig: {
      Memory: 256 * 1024 * 1024,
    },
  });

  return container;
}
