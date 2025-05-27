export interface Workflow {
  id: string;
  name: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  workflowId: string;
  details: string;
}
