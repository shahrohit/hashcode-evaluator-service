import Docker from "dockerode";

const checkDockerConnection = async () => {
  try {
    const docker = new Docker();
    await docker.ping();
  } catch {
    console.log("Docker is not Running");
    process.exit();
  }
};

export default checkDockerConnection;
