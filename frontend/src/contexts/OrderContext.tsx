import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type TrackingStep = {
    label: string;
    date: string;
    time: string;
    status: 'completed' | 'active' | 'pending';
    maker?: string;
    evidence?: string[];
};

export type Order = {
    id: string;
    name: string;
    date: string;
    status: 'processing' | 'shipped' | 'delivered';
    total: number;
    steps: TrackingStep[];
    img?: string;
};

type OrderContextType = {
    orders: Order[];
    addOrder: (order: Order) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    // Provide an initial mockup order so the page isn't empty on load
    const [orders, setOrders] = useState<Order[]>([{
        id: 'TRK-9824X',
        name: '三分 BJD (1/3 Scale) • 暗黑哥特主题',
        date: '2023-10-12',
        status: 'processing',
        total: 219,
        img: '/images/cotton_doll.png',
        steps: [
            { label: '订单已确认', date: 'Oct 12', time: '10:00 AM', status: 'completed' },
            { label: '基础素体准备中', date: 'Oct 15', time: '2:30 PM', status: 'completed' },
            { label: '面部妆容绘制中', date: 'Oct 18', time: 'In Progress', status: 'active', maker: 'Kiki Faceups (妆娘)', evidence: ['/images/faceup_kiki.png'] },
            { label: '专属娃衣制作与试穿', date: '待开始', time: '', status: 'pending', maker: 'Lumina Outfits (娃衣)' },
            { label: '组装与出厂质检', date: '待开始', time: '', status: 'pending' },
            { label: '已发货', date: '待开始', time: '', status: 'pending' },
        ]
    }]);

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
