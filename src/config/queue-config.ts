import amqplib from "amqplib";

import consumeQueue from "@utils/consume-queue";
import submissionWorker from "@workers/submission-worker";
import { RABBITMQ_URL } from "@config/server-config";
import { SUBMISSION_QUEUE } from "@utils/strings";

let channel: amqplib.Channel;
async function connectQueue() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    consumeQueue(channel, SUBMISSION_QUEUE, submissionWorker);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === "ENOTFOUND") {
      console.log("Error connecting Message Queue ");
      process.exit();
    }
  }
}

export default connectQueue;
export { channel };
