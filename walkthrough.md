# UltraShip TMS - Final Project Documentation

## Project Overview
**UltraShip TMS** (Transportation Management System) is a high-performance, enterprise-grade logistics command center designed to manage complex fleet operations with ease. It features a high-density, real-time dashboard that balances massive data management with surgical operational focus.

## Key Features & Professional Capabilities

### 1. Enterprise-Scale Dashboard
- **Mission Control Layout**: A modular 3-layer architecture featuring top-level KPIs, a primary operational grid, and secondary monitoring tools.
- **Unified Logistics Toolbar**: A single-row "Command Strip" that consolidates Filter Tabs, Pagination, Search, Sort, and View Toggles into a cohesive interface.
- **Operational KPIs**: Real-time tracking of Active Shipments, On-Time Delivery %, Freight Spend, and Critical alerts.

### 2. High-Density Data Management
- **Hybrid View Modes**: Seamless toggle between a data-rich **Table Grid** (standard for logistics) and a visual **Tile Card** view.
- **Big Data Pagination**: Server-side pagination logic (10 items per page) designed to handle thousands of shipments without client-side lag.
- **Advanced Filtering**: Global search and status-based categorization synchronized between frontend UI and GraphQL backend.

### 3. Deep Tactical Tracking (Detail View)
- **Satellite Map HUD**: A sophisticated detail page featuring a dark-themed satellite tracking map with radar pulses and sensor telemetry.
- **Status Timeline**: Comprehensive transit history and real-time progress monitoring.
- **Action Suite**: Direct access to carrier contacts and manifest downloads from the shipment header.

### 4. Enterprise Security (RBAC)
- **Role-Based Access Control**: Fully implemented auth logic distinguishing between **Admin** and **Employee** roles.
- **UI-Level Protection**: Sensitive actions (Create, Edit, Delete) are contextually restricted/hidden for non-admin users.
- **Server-Level Protection**: GraphQL resolvers verify JWT tokens to prevent unauthorized data mutations.

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend/API**: Node.js, Apollo Server, GraphQL.
- **State/Data**: Apollo Client (In-memory caching), History API (Browser back-button support).
- **Design**: Premium "SaaS-tier" aesthetic with smooth transitions and high-density layouts.

## Implementation Summary (Progressive Refinement)
1. **Core Infrastructure**: Established GraphQL schema, mutations, and base React components.
2. **UX Consolidation**: Unified all scattered controls into a single "Command Strip" layout for maximum space efficiency.
3. **Operational Intelligence**: Integrated the StatsOverview and LiveActivityFeed for real-time situational awareness.
4. **Personalization**: Customized the environment for **Jagadesh S** with personalized headers and sub-domain readiness.

---
*Project ready for deployment at `ultraship.jagadesh.in`*
