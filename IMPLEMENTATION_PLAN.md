# UltraShip A1 Phase 2 Implementation Plan

This plan outlines the steps to implement the requested features: Dark Mode, CRUD for Drivers/Vehicles, Analytics Export, Notifications, Map Integration, and Tracking Timeline.

## 2. Notification System
**Goal**: Provide feedback for actions (e.g., "Driver Added Successfully", "Export Started").
- **Context**: Create `src/context/NotificationContext.tsx`.
- **Component**: Create `src/components/Toast.tsx` (or `NotificationContainer`) that floats on top of the UI.
- **Integration**: Wrap `App.tsx` with `NotificationProvider`.

## 3. CRUD for Drivers & Vehicles
**Goal**: Enable Add/Edit/Delete for fleet entities.
- **Mock Data Update**: Centralize driver/vehicle data in a Context (e.g., `FleetContext`) instead of deriving purely from shipments, OR create a helper that allows "overriding" or "adding" to the derived list.
- **Drivers Page**:
    - Add "Add Driver" button in header.
    - Create `AddDriverModal.tsx` with fields: Name, License, Phone, Status.
    - Add Action Menu (Edit/Delete) to driver rows.
- **Vehicles Page**:
    - Add "Add Vehicle" button.
    - Create `AddVehicleModal.tsx` with fields: Plate, Type, Status, Mileage.
    - Add Action Menu (Edit/Delete) to vehicle cards.

## 4. Analytics Export
**Goal**: Allow users to download reports.
- **Export Logic**: Create a utility `exportToCSV(data, filename)`.
- **UI**: Add "Export Report" button in `AnalyticsPage.tsx` header.
- **Functionality**:
    - When clicked, gather current stats/shipment data.
    - Trigger CSV download.
    - Show success notification.

## 5. Map Integration
**Goal**: Visualize fleet/shipment location.
- **Component**: Enhance `RouteMap.tsx` to accept coordinates or predefined routes.
- **Fleet View**: Create a `FleetMapPage.tsx` or add a "Map View" tab to `DriversPage`/`VehiclesPage`.
- **Shipment View**: Ensure `ShipmentDetail.tsx` uses the map properly (already likely does, but verifying integration).

## 6. Tracking Timeline
**Goal**: Detailed visual history of a shipment.
- **Component**: Create `TrackingTimeline.tsx`.
- **Integration**: Add to `ShipmentDetail.tsx` (below the map?).
- **Data**: Mock a history array (e.g., [Order Placed -> Picked Up -> In Transit]).

## 7. Permissions (Basic)
**Goal**: simple role-based UI toggles.
- **Settings**: Add "Role" selector in `SettingsPage` (Admin vs Staff).
- **Logic**: If Staff, hide "Delete" buttons and "Settings" access (visually).

## Execution Order
1.  **Dark Mode** (Global foundation)
2.  **Notification System** (Needed for CRUD feedback)
3.  **Drivers/Vehicles CRUD** (Core feature)
4.  **Analytics Export** (Quick win)
5.  **Tracking Timeline & Map** (Visual polish)
