import { TeamManagementTableRow } from "./team-management-table";
import { v4 as uuidv4 } from "uuid";

export const columnNames: string[] = ["Email Address", "Credits", "Active numbers", "Status"];

export const TEAM_MANAGEMENT_TABLE_DATA: TeamManagementTableRow[] = [
  {
    id: uuidv4(),
    accountName: "Test",
    emailAddress: "example@gmail.com",
    credits: 5,
    activeNumbers: 0,
    status: "pending",
    actionEnabled: false,
  },
  {
    id: uuidv4(),
    accountName: "Jack6271",
    emailAddress: "example2@gmail.com",
    credits: 4,
    activeNumbers: 2,
    status: "confirmed",
    actionEnabled: false,
  },
  {
    id: uuidv4(),
    accountName: "Paypal22",
    emailAddress: "example3@gmail.com",
    credits: 2,
    activeNumbers: 6,
    status: "pending",
    actionEnabled: true,
  },
  {
    id: uuidv4(),
    accountName: "Test",
    emailAddress: "example@gmail.com",
    credits: 1,
    activeNumbers: 2,
    status: "confirmed",
    actionEnabled: true,
  },
  {
    id: uuidv4(),
    accountName: "Jack6271",
    emailAddress: "example@gmail.com",
    credits: 7,
    activeNumbers: 2,
    status: "pending",
    actionEnabled: false,
  },
  {
    id: uuidv4(),
    accountName: "Paypal22",
    emailAddress: "example@gmail.com",
    credits: 3,
    activeNumbers: 1,
    status: "pending",
    actionEnabled: true,
  },
  {
    id: uuidv4(),
    accountName: "Test",
    emailAddress: "example@gmail.com",
    credits: 5,
    activeNumbers: 3,
    status: "confirmed",
    actionEnabled: false,
  },
  {
    id: uuidv4(),
    accountName: "Paypal22",
    emailAddress: "example@gmail.com",
    credits: 6,
    activeNumbers: 2,
    status: "canceled",
    actionEnabled: true,
  },
];
