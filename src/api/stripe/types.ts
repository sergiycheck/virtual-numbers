export interface StripePayment {
  id: string;
  object: string;
  after_expiration: null;
  allow_promotion_codes: null;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: AutomaticTax;
  billing_address_collection: null;
  cancel_url: string;
  client_reference_id: null;
  client_secret: null;
  consent: null;
  consent_collection: null;
  created: number;
  currency: string;
  currency_conversion: null;
  custom_fields: object[];
  custom_text: CustomText;
  customer: string;
  customer_creation: null;
  customer_details: CustomerDetails;
  customer_email: null;
  expires_at: number;
  invoice: null;
  invoice_creation: InvoiceCreation;
  livemode: boolean;
  locale: null;
  metadata: Metadata;
  mode: string;
  payment_intent: null;
  payment_link: null;
  payment_method_collection: string;
  payment_method_configuration_details: null;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: PhoneNumberCollection;
  recovered_from: null;
  setup_intent: null;
  shipping_address_collection: null;
  shipping_cost: null;
  shipping_details: null;
  shipping_options: object[];
  status: string;
  submit_type: null;
  subscription: null;
  success_url: string;
  total_details: TotalDetails;
  ui_mode: string;
  url: string;
}

export interface AutomaticTax {
  enabled: boolean;
  status: null;
}

export interface CustomText {
  after_submit: null;
  shipping_address: null;
  submit: null;
  terms_of_service_acceptance: null;
}

export interface CustomerDetails {
  address: null;
  email: string;
  name: null;
  phone: null;
  tax_exempt: string;
  tax_ids: null;
}

export interface InvoiceCreation {
  enabled: boolean;
  invoice_data: InvoiceData;
}

export interface InvoiceData {
  account_tax_ids: null;
  custom_fields: null;
  description: null;
  footer: null;
  metadata: PaymentMethodOptions;
  rendering_options: null;
}

export interface PaymentMethodOptions {}

export interface Metadata {
  quantity: string;
}

export interface PhoneNumberCollection {
  enabled: boolean;
}

export interface TotalDetails {
  amount_discount: number;
  amount_shipping: number;
  amount_tax: number;
}

export interface StripeCard {
  id: string;
  object: string;
  address_city: string;
  address_country: string;
  address_line1: string;
  address_line1_check: string;
  address_line2: string;
  address_state: string;
  address_zip: string;
  address_zip_check: string;
  brand: string;
  country: string;
  customer: string;
  cvc_check: string;
  dynamic_last4: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  last4: string;
  metadata: object;
  name: string;
  tokenization_method: string;
  wallet: string;
}

export type GetCardsResponse = {
  cards: StripeCard[];
  defaultCardId: string;
};

export interface CreateCardBody {
  token: string;
  setDefault: boolean;
}

export type PutCardRequest = {
  token: string;
  setDefault: boolean;
  cardId: string;
};

export type SendPaymentRequest = {
  quantity: number;
  cardId: string;
};

export type Price = {
  id: string;
  credits: number;
  pricePerCredit: number;
  total: number;
};
