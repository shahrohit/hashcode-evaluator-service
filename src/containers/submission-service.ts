import executionProducer from "@/producer/Execution-producer";
import CodeExecutor from "@containers/code-executor";
import { SubmissionStatus, TRunJob, TSubmissionJob } from "@utils/global-types";

const handleExecution = async (data: TSubmissionJob) => {
  try {
    // 1. Handle Code Execution
    const codeExecutor = new CodeExecutor(data.language, data.timeLimit);
    const response = await codeExecutor.execute(data.code, data.testcases);
    console.log(response);

    if (data.id) {
      // 2. Add to Queue
      executionProducer({
        ...response,
        id: data.id,
        testcaseCount: data.testcases.length,
        timestamp: data.timestamp,
        language: data.language,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleRun = async (data: TRunJob) => {
  try {
    // 1. Handle Code Execution
    const codeExecutor = new CodeExecutor(data.language, data.timeLimit);
    // const response = await codeExecutor.execute(data.code, data.testcases);
    // console.log(response);

    // if (data.id) {
    //   // 2. Add to Queue
    //   executionProducer({
    //     ...response,
    //     id: data.id,
    //     testcaseCount: data.testcases.length,
    //     timestamp: data.timestamp,
    //     language: data.language,
    //   });
    // }
  } catch (error) {
    console.log(error);
  }
};

const submissionService = {
  handleExecution,
  handleRun,
};

export default submissionService;
