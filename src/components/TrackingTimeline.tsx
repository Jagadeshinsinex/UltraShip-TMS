import React from 'react';
import { CheckCircle2, Truck, Package, Home } from 'lucide-react';
import { clsx } from 'clsx';

interface TimelineEvent {
    id: string;
    title: string;
    location: string;
    timestamp: string;
    status: 'completed' | 'current' | 'pending';
    description?: string;
    icon: React.ComponentType<any>;
}

interface TrackingTimelineProps {
    status: 'pending' | 'in-transit' | 'delivered';
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ status }) => {
    // Determine step index based on status for mock logic
    // Determine step index based on status for mock logic
    const activeStepIndex: number = status === 'delivered' ? 5 : status === 'in-transit' ? 3 : 1;

    const events: TimelineEvent[] = [
        {
            id: '1',
            title: 'Order Placed',
            location: 'System Limitless',
            timestamp: 'Oct 24, 09:30 AM',
            status: activeStepIndex >= 1 ? 'completed' : 'pending',
            description: 'Shipment order received and processed.',
            icon: Package
        },
        {
            id: '2',
            title: 'Picked Up by Carrier',
            location: 'Warehouse District A',
            timestamp: 'Oct 24, 02:15 PM',
            status: activeStepIndex >= 2 ? 'completed' : 'pending',
            description: 'Carrier has picked up the package.',
            icon: Truck
        },
        {
            id: '3',
            title: 'In Transit - Hub Scan',
            location: 'Central Distribution Center',
            timestamp: 'Oct 25, 08:45 AM',
            status: activeStepIndex === 2 ? 'current' : activeStepIndex > 2 ? 'completed' : 'pending',
            description: 'Package processed at distribution hub.',
            icon: Home
        },
        {
            id: '4',
            title: 'Out for Delivery',
            location: 'Local Facility',
            timestamp: 'Predicted: Oct 26',
            status: activeStepIndex === 3 ? 'current' : activeStepIndex > 3 ? 'completed' : 'pending',
            description: 'Package is out for final delivery.',
            icon: Truck
        },
        {
            id: '5',
            title: 'Delivered',
            location: 'Customer Address',
            timestamp: '--',
            status: activeStepIndex === 4 ? 'completed' : 'pending',
            description: 'Package delivered to recipient.',
            icon: CheckCircle2
        }
    ];

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {events.map((event, eventIdx) => (
                    <li key={event.id}>
                        <div className="relative pb-8">
                            {eventIdx !== events.length - 1 ? (
                                <span
                                    className={clsx(
                                        "absolute top-4 left-4 -ml-px h-full w-0.5",
                                        event.status === 'completed' ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
                                    )}
                                    aria-hidden="true"
                                />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span
                                        className={clsx(
                                            "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-900 border-2",
                                            event.status === 'completed' ? "bg-indigo-600 border-indigo-600 text-white" :
                                                event.status === 'current' ? "bg-white dark:bg-slate-900 border-indigo-600 text-indigo-600 animate-pulse" :
                                                    "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-500"
                                        )}
                                    >
                                        <event.icon size={16} />
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className={clsx("text-sm font-bold",
                                            event.status === 'completed' || event.status === 'current' ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                                        )}>
                                            {event.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.description}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                            {event.location}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-xs text-slate-500 dark:text-slate-400">
                                        <time dateTime={event.timestamp}>{event.timestamp}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
