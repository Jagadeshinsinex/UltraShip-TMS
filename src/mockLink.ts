import { ApolloLink, Observable } from '@apollo/client';

// Mock Data
let shipments = [
    { id: "1", name: "Reliance Industries", age: 10, class: "Express", subjects: ["Petrochemicals", "Polymers"], attendance: 95.5, origin: "Mumbai Hub", destination: "Delhi DC", priority: "HIGH" },
    { id: "2", name: "Amazon India", age: 2, class: "Express", subjects: ["Consumer Electronics", "Fashion"], attendance: 45.5, origin: "Primary Hub", destination: "Regional DC", priority: "HIGH" },
    { id: "3", name: "Flipkart Logistics", age: 3, class: "Standard", subjects: ["Mobile Phones", "Gadgets"], attendance: 100.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "4", name: "Tata Motors", age: 12, class: "Economy", subjects: ["Auto Parts", "Steel Rods"], attendance: 0.0, origin: "Chennai Port", destination: "Bangalore DC", priority: "NORMAL" },
    { id: "5", name: "Infosys Ltd", age: 1, class: "Standard", subjects: ["IT Equipment", "Servers"], attendance: 60.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "6", name: "HDFC Bank", age: 0, class: "Express", subjects: ["Documents", "Secure Assets"], attendance: 100.0, origin: "Primary Hub", destination: "Regional DC", priority: "HIGH" },
    { id: "7", name: "Zomato Hyperpure", age: 1, class: "Express", subjects: ["Groceries", "Organic Produce"], attendance: 85.0, origin: "Primary Hub", destination: "Regional DC", priority: "HIGH" },
    { id: "8", name: "Maruti Suzuki", age: 14, class: "Economy", subjects: ["Engine Parts", "Tires"], attendance: 10.0, origin: "Gurgaon Warehouse", destination: "Ahmedabad DC", priority: "NORMAL" },
    { id: "9", name: "L&T Construction", age: 8, class: "Standard", subjects: ["Heavy Machinery", "Concrete"], attendance: 30.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "10", name: "Wipro Tech", age: 4, class: "Express", subjects: ["Networking Gear", "Laptops"], attendance: 95.0, origin: "Primary Hub", destination: "Regional DC", priority: "HIGH" },
    { id: "11", name: "Dr. Reddy Labs", age: 5, class: "Standard", subjects: ["Medicines", "Pharma API"], attendance: 100.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "12", name: "Asian Paints", age: 6, class: "Standard", subjects: ["Paints", "Chemicals"], attendance: 50.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "13", name: "Adani Ports", age: 15, class: "Economy", subjects: ["Coal", "Minerals"], attendance: 5.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "14", name: "Mahindra & Mahindra", age: 9, class: "Standard", subjects: ["Tractors", "Spare Parts"], attendance: 75.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "15", name: "Airtel Digital", age: 2, class: "Express", subjects: ["Fiber Cables", "Routers"], attendance: 90.0, origin: "Primary Hub", destination: "Regional DC", priority: "HIGH" },
    { id: "16", name: "ITC Limited", age: 4, class: "Standard", subjects: ["FMCG Goods", "Paper"], attendance: 100.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "17", name: "Hero MotoCorp", age: 7, class: "Economy", subjects: ["Bikes", "Alloy Wheels"], attendance: 20.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "18", name: "Britannia Ind", age: 3, class: "Standard", subjects: ["Biscuits", "Dairy Goods"], attendance: 100.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" },
    { id: "19", name: "ICICI Logistics", age: 1, class: "Express", subjects: ["Vault Boxes", "Cash"], attendance: 98.0, origin: "Primary Hub", destination: "Regional DC", priority: "HIGH" },
    { id: "20", name: "Biocon Pharma", age: 11, class: "Standard", subjects: ["Insulin", "Bio-similars"], attendance: 40.0, origin: "Primary Hub", destination: "Regional DC", priority: "NORMAL" }
];

export const mockLink = new ApolloLink((operation) => {
    return new Observable((observer) => {
        const { operationName, variables } = operation;

        // Simulating network delay
        setTimeout(() => {
            try {
                let data = {};

                if (operationName === 'GetShipments') {
                    let result = [...shipments];

                    // 1. Filtering by Status (Tab)
                    if (variables.status && variables.status !== 'All Shipments') {
                        result = result.filter(s => {
                            const status = s.attendance >= 100 ? 'Delivered' : s.attendance === 0 ? 'Pending' : 'In Transit';
                            return status === variables.status;
                        });
                    }

                    // 2. Search
                    if (variables.search) {
                        const searchStr = variables.search.toLowerCase();
                        result = result.filter(s =>
                            s.name.toLowerCase().includes(searchStr) ||
                            s.id.toLowerCase().includes(searchStr) ||
                            s.class.toLowerCase().includes(searchStr) ||
                            s.subjects.some((subj: string) => subj.toLowerCase().includes(searchStr))
                        );
                    }

                    // 3. Sorting
                    if (variables.sortBy) {
                        const [field, direction] = variables.sortBy.split('_');
                        result.sort((a, b) => {
                            // @ts-ignore
                            if (a[field] < b[field]) return direction === 'ASC' ? -1 : 1;
                            // @ts-ignore
                            if (a[field] > b[field]) return direction === 'ASC' ? 1 : -1;
                            return 0;
                        });
                    }

                    const totalCount = result.length;

                    // Pagination
                    if (variables.offset !== undefined) {
                        result = result.slice(variables.offset);
                    }
                    if (variables.limit !== undefined) {
                        result = result.slice(0, variables.limit);
                    }

                    data = { getShipments: { totalCount, shipments: result } };
                }

                if (operationName === 'DeleteShipment') {
                    const index = shipments.findIndex(s => s.id === variables.id);
                    if (index > -1) {
                        shipments.splice(index, 1);
                        data = { deleteShipment: true };
                    } else {
                        data = { deleteShipment: false };
                    }
                }

                if (operationName === 'CreateShipment') {
                    const newShipment = {
                        id: `SHP-${Math.floor(Math.random() * 100000)}`,
                        origin: "Primary Hub", // Default value
                        destination: "Regional DC", // Default value
                        priority: variables.input.class === 'Express' ? 'HIGH' : 'NORMAL', // Auto-calculate from class
                        ...variables.input
                    };
                    shipments.unshift(newShipment);
                    data = { createShipment: newShipment };
                }

                if (operationName === 'UpdateShipment') {
                    const index = shipments.findIndex(s => s.id === variables.id);
                    if (index > -1) {
                        shipments[index] = { ...shipments[index], ...variables.input };
                        data = { updateShipment: shipments[index] };
                    }
                }

                if (operationName === 'Login') {
                    data = { login: { token: 'mock-token', role: variables.role } };
                }

                observer.next({ data });
                observer.complete();
            } catch (err) {
                observer.error(err);
            }
        }, 300); // 300ms simulated latency
    });
});
