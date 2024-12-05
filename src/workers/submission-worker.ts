import submissionService from "@/services/submission-service";
import { TSubmissionJob } from "@/utils/global-types";

const submissionWorker = async (data: TSubmissionJob) => {
  await submissionService.handleExecution(data);
};

export default submissionWorker;
