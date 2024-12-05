export type TSubmissionJob = {
  language: string;
  code: string;
  testcases: Testcase[];
  time: number;
};
export type DockerStreamOutput = {
  stdout: string;
  stderr: string;
  // eslint-disable-next-line semi
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

//  acceptd
//  output : "Accepted"

//
