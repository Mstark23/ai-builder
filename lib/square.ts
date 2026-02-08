// lib/square.ts
// Square client initialization — matches existing supabaseAdmin.ts pattern

import { Client, Environment } from 'square/legacy';

const accessToken = process.env.SQUARE_ACCESS_TOKEN!;
const environment =
  process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox;

export const squareClient = new Client({
  accessToken,
  environment,
});

export const {
  paymentsApi,
  customersApi,
  cardsApi,
  subscriptionsApi,
  catalogApi,
  checkoutApi,
} = squareClient;

// Fix BigInt serialization (Square SDK uses BigInt for amounts)
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Plan prices in cents (matching your existing PLAN_PRICES)
export const PLAN_PRICES: Record<string, number> = {
  starter: 29900,
  landing: 29900,
  professional: 59900,
  service: 59900,
  premium: 79900,
  enterprise: 99900,
  ecommerce: 99900,
};

export const PLAN_NAMES: Record<string, string> = {
  starter: 'Starter Website',
  landing: 'Landing Page',
  professional: 'Professional Website',
  service: 'Service Business Website',
  premium: 'Premium Website',
  enterprise: 'Enterprise Website',
  ecommerce: 'E-Commerce Website',
};
