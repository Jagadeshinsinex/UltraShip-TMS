export interface Shipment {
    id: string;
    name: string;
    age: number;
    class: string;
    subjects: string[];
    attendance: number;
    origin?: string;
    destination?: string;
    priority?: string;
}

export interface Driver {
    id: string;
    name: string;
    phone: string;
    email: string;
    vehicleType: string;
    status: 'Active' | 'Inactive';
    totalShipments: number;
    completedShipments: number;
    performance: number;
}

export interface Vehicle {
    id: string;
    model: string;
    licensePlate: string;
    type: string;
    status: 'Active' | 'In Maintenance' | 'Idle';
    currentShipments: number;
    totalMileage: number;
    lastService: string;
}
