import { channel } from "@/config/queue-config";
import { ExecutionResponse } from "@/utils/global-types";
import { EXECUTION_QUEUE } from "@/utils/strings";

const executionProducer = (message: ExecutionResponse) => {
  try {
    if (!channel) throw new Error("RabbitMQ channel not initialized");
    channel.sendToQueue(EXECUTION_QUEUE, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.error("Error Producing message:", error);
  }
};

export default executionProducer;
