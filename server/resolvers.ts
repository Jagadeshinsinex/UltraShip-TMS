// Helper to verify JWT role (Mock implementation for simplicity if middleware isn't enough context here)
import jwt from 'jsonwebtoken';

const SECRET_KEY = "ultra-secret-key";

// NOTE: We are using In-memory caching (Apollo's default) for performance.
// This ensures that for this active session, data access is extremely fast without database latency.

// Mock Data Source - Strictly matching Schema
// Mock Data Source - Strictly matching Schema
let shipments: any[] = [
    { id: "1", name: "Reliance Industries", age: 10, class: "Express", subjects: ["Petrochemicals", "Polymers"], attendance: 95.5 },
    { id: "2", name: "Amazon India", age: 2, class: "Express", subjects: ["Consumer Electronics", "Fashion"], attendance: 45.5 },
    { id: "3", name: "Flipkart Logistics", age: 3, class: "Standard", subjects: ["Mobile Phones", "Gadgets"], attendance: 100.0 },
    { id: "4", name: "Tata Motors", age: 12, class: "Economy", subjects: ["Auto Parts", "Steel Rods"], attendance: 0.0 },
    { id: "5", name: "Infosys Ltd", age: 1, class: "Standard", subjects: ["IT Equipment", "Servers"], attendance: 60.0 },
    { id: "6", name: "HDFC Bank", age: 0, class: "Express", subjects: ["Documents", "Secure Assets"], attendance: 100.0 },
    { id: "7", name: "Zomato Hyperpure", age: 1, class: "Express", subjects: ["Groceries", "Organic Produce"], attendance: 85.0 },
    { id: "8", name: "Maruti Suzuki", age: 14, class: "Economy", subjects: ["Engine Parts", "Tires"], attendance: 10.0 },
    { id: "9", name: "L&T Construction", age: 8, class: "Standard", subjects: ["Heavy Machinery", "Concrete"], attendance: 30.0 },
    { id: "10", name: "Wipro Tech", age: 4, class: "Express", subjects: ["Networking Gear", "Laptops"], attendance: 95.0 },
    { id: "11", name: "Dr. Reddy Labs", age: 5, class: "Standard", subjects: ["Medicines", "Pharma API"], attendance: 100.0 },
    { id: "12", name: "Asian Paints", age: 6, class: "Standard", subjects: ["Paints", "Chemicals"], attendance: 50.0 },
    { id: "13", name: "Adani Ports", age: 15, class: "Economy", subjects: ["Coal", "Minerals"], attendance: 5.0 },
    { id: "14", name: "Mahindra & Mahindra", age: 9, class: "Standard", subjects: ["Tractors", "Spare Parts"], attendance: 75.0 },
    { id: "15", name: "Airtel Digital", age: 2, class: "Express", subjects: ["Fiber Cables", "Routers"], attendance: 90.0 },
    { id: "16", name: "ITC Limited", age: 4, class: "Standard", subjects: ["FMCG Goods", "Paper"], attendance: 100.0 },
    { id: "17", name: "Hero MotoCorp", age: 7, class: "Economy", subjects: ["Bikes", "Alloy Wheels"], attendance: 20.0 },
    { id: "18", name: "Britannia Ind", age: 3, class: "Standard", subjects: ["Biscuits", "Dairy Goods"], attendance: 100.0 },
    { id: "19", name: "ICICI Logistics", age: 1, class: "Express", subjects: ["Vault Boxes", "Cash"], attendance: 98.0 },
    { id: "20", name: "Biocon Pharma", age: 11, class: "Standard", subjects: ["Insulin", "Bio-similars"], attendance: 40.0 }
];

// Resolvers
export const resolvers = {
    Query: {
        getShipments: (_: any, args: any, context: any) => {
            let result = [...shipments];

            // 1. Filtering by Status (Tab)
            if (args.status && args.status !== 'All Shipments') {
                result = result.filter(s => {
                    const status = s.attendance >= 100 ? 'Delivered' : s.attendance === 0 ? 'Pending' : 'In Transit';
                    return status === args.status;
                });
            }

            // 2. Search
            if (args.search) {
                const searchStr = args.search.toLowerCase();
                result = result.filter(s =>
                    s.name.toLowerCase().includes(searchStr) ||
                    s.id.toLowerCase().includes(searchStr) ||
                    s.class.toLowerCase().includes(searchStr) ||
                    s.subjects.some((subj: string) => subj.toLowerCase().includes(searchStr))
                );
            }

            // 3. Sorting
            if (args.sortBy) {
                const [field, direction] = args.sortBy.split('_');
                result.sort((a, b) => {
                    if (a[field] < b[field]) return direction === 'ASC' ? -1 : 1;
                    if (a[field] > b[field]) return direction === 'ASC' ? 1 : -1;
                    return 0;
                });
            }

            const totalCount = result.length;

            // Pagination
            if (args.offset !== undefined) {
                result = result.slice(args.offset);
            }
            if (args.limit !== undefined) {
                result = result.slice(0, args.limit);
            }

            return {
                totalCount,
                shipments: result
            };
        },
        getShipment: (_: any, args: { id: string }) => {
            return shipments.find(s => s.id === args.id);
        }
    },
    Mutation: {
        login: (_: any, args: { role: string }) => {
            const token = jwt.sign({ role: args.role }, SECRET_KEY, { expiresIn: '1h' });
            return { token, role: args.role };
        },
        createShipment: (_: any, args: { input: any }, context: any) => {
            if (context.user.role !== 'ADMIN' && context.user.role !== 'Admin') {
                throw new Error(`Access Denied: Admins only. Your role is: ${context.user.role}`);
            }
            const newShipment = {
                id: `SHP-${Math.floor(Math.random() * 100000)}`,
                ...args.input
            };
            shipments.unshift(newShipment); // Add to top
            return newShipment;
        },
        updateShipment: (_: any, args: { id: string, input: any }, context: any) => {
            if (context.user.role !== 'ADMIN' && context.user.role !== 'Admin') {
                throw new Error("Access Denied: Admins only.");
            }
            const index = shipments.findIndex(s => s.id === args.id);
            if (index === -1) throw new Error("Shipment not found");

            const updated = { ...shipments[index], ...args.input };
            shipments[index] = updated;
            return updated;
        },
        deleteShipment: (_: any, args: { id: string }, context: any) => {
            if (context.user.role !== 'ADMIN' && context.user.role !== 'Admin') {
                throw new Error("Access Denied: Admins only.");
            }
            const index = shipments.findIndex(s => s.id === args.id);
            if (index === -1) return false;
            shipments.splice(index, 1);
            return true;
        }
    }
};
