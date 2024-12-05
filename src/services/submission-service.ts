import executionProducer from "@/producer/Execution-producer";
import CodeExecutor from "@containers/code-executor";
import { SubmissionStatus, TSubmissionJob } from "@utils/global-types";

const handleExecution = async (data: TSubmissionJob) => {
  try {
    // 1. Handle Code Execution
    const codeExecutor = new CodeExecutor(data.language, data.time);
    const response = await codeExecutor.execute(data.code, data.testcases);
    console.log(response);
    // 2. Add to Queue
    executionProducer(response);
  } catch (error) {
    console.log(error);
  }
};

const submissionService = {
  handleExecution,
};

export default submissionService;
