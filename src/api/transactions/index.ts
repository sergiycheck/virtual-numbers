import { makeApiRequest } from "..";
import { PaginatedParams, PaginatedResponse } from "../general.types";
import { Transaction } from "./types";

interface PostTransactionBody {
  sum: number;
  toUserId: string;
  fromUserId: string;
}

const TransactionsAPI = {
  get: () =>
    makeApiRequest<Transaction[]>({
      method: "get",
      url: "/transactions",
    }),
  getPayments: (params: PaginatedParams & { start_date?: string; end_date?: string }) =>
    makeApiRequest<PaginatedResponse<Transaction>>({
      method: "get",
      url: "/transactions/payments",
      params,
    }),
  exportPayments: (params: { start_date?: string; end_date?: string }) =>
    makeApiRequest<string>({
      method: "get",
      url: "/transactions/payments/export",
      params,
    }),
  post: (data: PostTransactionBody) =>
    makeApiRequest({
      method: "post",
      url: "/transactions",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    }),
};

export default TransactionsAPI;
