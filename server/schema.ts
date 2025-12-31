import gql from 'graphql-tag';

export const typeDefs = gql`
  type Shipment {
    id: ID!
    name: String
    age: Int
    class: String
    subjects: [String]
    attendance: Float
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
  }

  input UpdateShipmentInput {
    name: String
    age: Int
    class: String
    subjects: [String]
    attendance: Float
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
