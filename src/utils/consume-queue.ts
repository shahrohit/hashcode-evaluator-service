import amqplib from "amqplib";

async function consumeQueue<T>(
  channel: amqplib.Channel,
  queueName: string,
  fn: (data: T) => Promise<void>,
) {
  await channel.assertQueue(queueName);
  channel.consume(queueName, async data => {
    if (!data) return;
    const content = JSON.parse(String(Buffer.from(String(data.content)))) as T;
    await fn(content);
    channel.ack(data);
  });
}

export default consumeQueue;
