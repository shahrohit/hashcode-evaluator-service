import { Readable } from "stream";

export default async function fetchDecodedStream(
  stream: Readable,
  rawLogBuffer: Buffer[] = [],
): Promise<string> {
  return new Promise((resolve, reject) => {
    let result = "";
    stream.on("data", chunk => {
      rawLogBuffer.push(chunk);
      const buffer = Buffer.from(chunk);
      let index = 0;
      while (index < buffer.length) {
        const payloadLength = buffer.readUInt32BE(index + 4);
        const payload = buffer.subarray(index + 8, index + 8 + payloadLength);
        result += payload.toString(); // Append decoded payload to result
        index += 8 + payloadLength; // Move to the next multiplexed chunk
      }
    });
    stream.on("end", () => {
      resolve(result.trim());
    });

    stream.on("error", err => {
      reject(err);
    });
  });
}
