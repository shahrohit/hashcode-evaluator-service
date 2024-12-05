import Docker from "dockerode";

export default async function pullDockerImage(
  docker: Docker,
  dockerImage: string,
): Promise<void> {
  try {
    if (!dockerImage) throw new Error("Invalid Docker Image");
    return new Promise((resolve, reject) => {
      docker.pull(
        dockerImage,
        (error: Error, stream: NodeJS.ReadableStream) => {
          if (error) return reject(error);
          docker.modem.followProgress(stream, err => {
            if (err) return reject(err);
            console.log(`Image ${dockerImage} pulled successfully.`);
            resolve();
          });
        },
      );
    });
  } catch (error) {
    console.error(`Unexpected error during image pull:`, error);
    throw error;
  }
}
