import { Client as workflowClient } from "@upstash/workflow";
import { QSTASH_TOKEN, QSTASH_URL } from "../config/env.js";

export const workflowClients = new workflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});
