import { z } from "zod";

export const LocationDTOSchema = z.object({
  zip: z.number(),
  lat: z.number(),
  lng: z.number(),
  city: z.string(),
  state_id: z.string(),
  state_name: z.string(),
  population: z.number(),
  density: z.number(),
  county_name: z.string(),
  po_box: z.number(),
  dist_highway: z.number(),
  dist2_large_airport: z.number(),
  dist2_medium_airport: z.number(),
  dist_to_shore: z.number(),
  number_of_business: z.number(),
  adjusted_gross_income: z.number(),
  total_income_amount: z.number(),
  number_of_returns: z.number(),
});

export type LocationDTO = z.infer<typeof LocationDTOSchema>;
