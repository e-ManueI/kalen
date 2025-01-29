import { SessionPayload } from "./definitions";

export const sampleSessionPayload: SessionPayload = {
  id: "12345",
  first_name: "John",
  phone_number: "1234567890",
  last_name: "Doe",
  email: "john.doe@example.com",
  user_type: "admin",
  access:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sampleAccessTokenPayload.sampleSignature",
  refresh:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sampleRefreshTokenPayload.sampleSignature",
};

export const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
  },
  {
    title: "Subscriptions",
    value: "+2350",
    description: "+180.1% from last month",
  },
  {
    title: "Sales",
    value: "+12,234",
    description: "+19% from last month",
  },
  {
    title: "Active Now",
    value: "+573",
    description: "+201 since last hour",
  },
];
