import { makeApiRequest } from "..";
import {
  StripePayment,
  GetCardsResponse,
  PutCardRequest,
  CreateCardBody,
  SendPaymentRequest,
  Price,
} from "./types";

const DEFAULT_CARD_LS = "stripe-default-card";

export const setDefaultCardLs = (cardId: string) => {
  localStorage.setItem(DEFAULT_CARD_LS, cardId);
};

export const getDefaultCardLs = () => {
  return localStorage.getItem(DEFAULT_CARD_LS);
};

const StripeAPI = {
  cards: () =>
    makeApiRequest<GetCardsResponse>({
      method: "get",
      url: "/stripe/cards",
    }),
  createCard: async (item: CreateCardBody) => {
    return makeApiRequest({
      method: "post",
      url: "/stripe/cards",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(item),
    });
  },
  setDefaultCard: async ({ cardId }: { cardId: string }) => {
    return makeApiRequest({
      method: "post",
      url: "/stripe/cards/set-default",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ cardId }),
    });
  },
  putCard: async (item: PutCardRequest) => {
    return makeApiRequest({
      method: "put",
      url: "/stripe/cards/" + item.cardId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(item),
    });
  },
  deleteCard: async ({ cardId }: { cardId: string }) => {
    return makeApiRequest({
      method: "delete",
      url: "/stripe/cards/" + cardId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  },
  invoices: () =>
    makeApiRequest({
      method: "get",
      url: "/stripe/my-invoices",
    }),
  price: () =>
    makeApiRequest({
      method: "get",
      url: "/stripe/price",
    }),
  calculatePrice: (creditsAmount: number) =>
    makeApiRequest<number>({
      method: "get",
      url: `/stripe/payment/calc/${creditsAmount}`,
    }),
  getMockPrices: () =>
    makeApiRequest<Price[]>({
      method: "get",
      url: `/stripe/prices/mock`,
    }),
  payment: (body: SendPaymentRequest) =>
    makeApiRequest<StripePayment>({
      method: "post",
      url: "/stripe/payment",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      params: body,
    }),
};

export default StripeAPI;
