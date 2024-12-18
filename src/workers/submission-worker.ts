import submissionService from "@/services/submission-service";
import { TExecutionConsumer } from "@/utils/global-types";

const submissionWorker = async (data: TExecutionConsumer) => {
  if (data.type === "submit") {
    await submissionService.handleExecution(data);
  } else if (data.type === "run") {
    await submissionService.handleRun(data);
  }
};

export default submissionWorker;
