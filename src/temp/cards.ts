import { faker } from "@faker-js/faker";

export const cards = [
  { id: "1", name: "Card name 1", cardholder: faker.person.fullName(), endingDigits: 1234 },
  { id: "2", name: "Card name 2", cardholder: faker.person.fullName(), endingDigits: 4321 },
  { id: "3", name: "Card name 3", cardholder: faker.person.fullName(), endingDigits: 5621 },
  { id: "4", name: "Card name 4", cardholder: faker.person.fullName(), endingDigits: 2398 },
  { id: "5", name: "Card name 5", cardholder: faker.person.fullName(), endingDigits: 4565 },
  { id: "6", name: "Card name 6", cardholder: faker.person.fullName(), endingDigits: 5621 },
  { id: "7", name: "Card name 7", cardholder: faker.person.fullName(), endingDigits: 2398 },
  { id: "8", name: "Card name 8", cardholder: faker.person.fullName(), endingDigits: 4565 },
];
