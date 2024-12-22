import CodeRunner from "@/containers/code-runner";
import executionProducer from "@/producer/Execution-producer";
import CodeExecutor from "@containers/code-executor";
import { TRunConsumerJob, TSubmitConsumerJob } from "@utils/global-types";

const handleExecution = async (data: TSubmitConsumerJob) => {
  try {
    // 1. Handle Code Execution
    const codeExecutor = new CodeExecutor(data.language, data.timeLimit);
    const response = await codeExecutor.execute(data.code, data.testcases);

    if (data.socketKey) {
      // 2. Add to Queue
      executionProducer({
        type: data.type,
        ...response,
        socketKey: data.socketKey,
        testcaseCount: data.testcases.length,
        timestamp: data.timestamp,
        language: data.language,
        problemId: data.problemId,
        langId: data.langId,
        problemSlug: data.problemSlug,
        username: data.username,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleRun = async (data: TRunConsumerJob) => {
  try {
    const codeExecutor = new CodeRunner(data.language, data.timeLimit);
    // 1. Handle Code Execution
    const response = await codeExecutor.execute(
      data.code,
      data.solutionCode,
      data.testcases,
    );

    if (data.socketKey) {
      // 2. Add to Queue
      executionProducer({
        type: "run",
        ...response,
        socketKey: data.socketKey,
        testcaseCount: data.testcases.length,
        timestamp: data.timestamp,
        language: data.language,
        problemId: data.problemId,
        langId: data.langId,
        problemSlug: data.problemSlug,
        username: data.username,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const submissionService = {
  handleExecution,
  handleRun,
};

export default submissionService;
