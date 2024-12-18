export type Testcase = {
  input: string;
  output: string;
};

export type TSubmitConsumerJob = {
  type: "submit";
  username: string;
  problemId: number;
  langId: number;
  problemSlug: string;
  socketKey: string | null;
  language: string;
  code: string;
  testcases: Testcase[];
  timeLimit: number;
  timestamp: string;
};

export type TRunConsumerJob = {
  type: "run";
  username: string;
  problemId: number;
  langId: number;
  problemSlug: string;
  socketKey: string | null;
  language: string;
  code: string;
  solutionCode: string;
  testcases: string[];
  timeLimit: number;
  timestamp: string;
};

export type TExecutionConsumer = TSubmitConsumerJob | TRunConsumerJob;

export type DockerStreamOutput = {
  stdout: string;
  stderr: string;
};

export type SubmissionStatus =
  | "Accepted"
  | "CompiledError"
  | "WrongAnswer"
  | "Error"
  | "TLE"
  | "RTE";

export type TSubmitResponse = {
  input?: string;
  output?: string;
  executionOutput: string;
  status: SubmissionStatus;
  acceptedCount?: number;
};

export type TRunResponse = {
  status: SubmissionStatus;
  error: string | null;
  data: TSubmitResponse[];
};

export type TSubmitExecutionJob = TSubmitResponse & {
  type: "submit";
  username: string;
  problemId: number;
  langId: number;
  problemSlug: string;
  socketKey: string | null;
  testcaseCount: number;
  language: string;
  timestamp: string;
};

export type TRunExecutionJob = TRunResponse & {
  type: "run";
  username: string;
  problemId: number;
  langId: number;
  problemSlug: string;
  socketKey: string | null;
  testcaseCount: number;
  timestamp: string;
  language: string;
};

export type TExecutionProducer = TSubmitExecutionJob | TRunExecutionJob;
