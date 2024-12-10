export type TSubmissionJob = {
  id: string | null;
  language: string;
  code: string;
  testcases: Testcase[];
  timeLimit: number;
  timestamp: string;
};
export type DockerStreamOutput = {
  stdout: string;
  stderr: string;
};

export type Testcase = {
  input: string;
  output: string;
};

export type SubmissionStatus =
  | "Accepted"
  | "Compiled Error"
  | "Wrong Answer"
  | "Error"
  | "TLE"
  | "RTE";

export type ExecutionResponse = {
  input?: string;
  output?: string;
  executionOutput: string;
  status: SubmissionStatus;
  acceptedCount?: number;
};
export type ExecutionResponseJob = ExecutionResponse & {
  id: string;
  timestamp: string;
};

//  acceptd
//  output : "Accepted"

//
