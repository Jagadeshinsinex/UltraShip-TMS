"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
  type Shipment {
    id: ID!
    name: String
    age: Int
    class: String
    subjects: [String]
    attendance: Float
    origin: String
    destination: String
    priority: String
  }

  type ShipmentConnection {
      totalCount: Int!
      shipments: [Shipment!]!
  }

  input NewShipmentInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    origin: String
    destination: String
    priority: String
  }

  input UpdateShipmentInput {
    name: String
    age: Int
    class: String
    subjects: [String]
    attendance: Float
    origin: String
    destination: String
    priority: String
  }

  type AuthPayload {
    token: String!
    role: String!
  }

  type Query {
    getShipments(limit: Int, offset: Int, sortBy: String, status: String, search: String): ShipmentConnection!
    getShipment(id: ID!): Shipment
  }

  type Mutation {
    createShipment(input: NewShipmentInput!): Shipment!
    updateShipment(id: ID!, input: UpdateShipmentInput!): Shipment!
    deleteShipment(id: ID!): Boolean!
    login(role: String!): AuthPayload!
  }
`;
