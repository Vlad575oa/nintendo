import axios from "axios";

const SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;

const auth = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64");

export const yookassa = {
  createPayment: async (amount: number, description: string, returnUrl: string) => {
    const response = await axios.post(
      "https://api.yookassa.ru/v3/payments",
      {
        amount: {
          value: amount.toFixed(2),
          currency: "RUB",
        },
        confirmation: {
          type: "redirect",
          return_url: returnUrl,
        },
        capture: true,
        description: description,
      },
      {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Idempotence-Key": Math.random().toString(36).substring(7),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
};
