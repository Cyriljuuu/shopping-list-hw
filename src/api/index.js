import { isMockEnabled } from "./client";
import * as mockApi from "./mock/mockApi";
import * as realApi from "./realApi";

export const api = isMockEnabled() ? mockApi : realApi;
