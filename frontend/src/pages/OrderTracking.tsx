import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Package, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';

export default function OrderTracking() {
    const { orders } = useOrders();
    const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
    const navigate = useNavigate();

    const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

    if (!selectedOrder) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h2>暂无进行中的定制订单</h2>
                <p>前往定制工作室开启您的第一个跨界联名定制吧！</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            {orders.length > 1 && (
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                    {orders.map(order => (
                        <button
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            style={{
                                padding: '1rem 1.5rem',
                                background: selectedOrderId === order.id ? 'var(--accent)' : 'var(--glass-bg)',
                                border: selectedOrderId === order.id ? 'none' : '1px solid var(--glass-border)',
                                color: selectedOrderId === order.id ? 'white' : 'var(--text-primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Package size={18} />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>#{order.id}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{order.status === 'processing' ? '制作中' : '已完成'}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>订单详情 #{selectedOrder.id}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.name}</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ position: 'relative' }}>

                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '15px',
                        top: '20px',
                        bottom: '20px',
                        width: '2px',
                        background: 'var(--glass-border)'
                    }} />

                    {selectedOrder.steps.map((step, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            gap: '2rem',
                            marginBottom: idx === selectedOrder.steps.length - 1 ? 0 : '3rem',
                            position: 'relative',
                            opacity: step.status === 'pending' ? 0.5 : 1
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: step.status === 'completed' ? 'var(--accent)' : step.status === 'active' ? 'var(--bg-color)' : 'var(--glass-bg)',
                                border: `2px solid ${step.status === 'completed' || step.status === 'active' ? 'var(--accent)' : 'var(--glass-border)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                boxShadow: step.status === 'active' ? '0 0 0 4px var(--accent-light)' : 'none'
                            }}>
                                {step.status === 'completed' && <CheckCircle2 size={20} color="white" />}
                                {step.status === 'active' && <Clock size={16} color="var(--accent)" />}
                                {step.status === 'pending' && <Circle size={12} color="var(--glass-border)" />}
                            </div>

                            <div style={{ flex: 1, paddingTop: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: step.status === 'active' ? 'var(--accent)' : 'inherit' }}>
                                            {step.label}
                                        </h3>
                                        {step.maker && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <div style={{
                                                    width: '24px', height: '24px', borderRadius: '50%',
                                                    background: (step.status === 'active' || step.status === 'completed') ? 'var(--accent)' : 'var(--glass-border)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: (step.status === 'active' || step.status === 'completed') ? 'white' : 'var(--text-secondary)',
                                                    fontSize: '0.7rem', fontWeight: 600
                                                }}>
                                                    {step.maker.substring(0, 1)}
                                                </div>
                                                <p style={{ color: (step.status === 'active' || step.status === 'completed') ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    {step.status === 'completed' ? '参与者' : '当前负责人'}: {step.maker}
                                                    <span style={{ fontSize: '0.8rem', opacity: 0.8, marginLeft: '0.5rem' }}>
                                                        {(step.status === 'active' || step.status === 'completed') ? '(已进群)' : '(未进群)'}
                                                    </span>
                                                </p>
                                                {(step.status === 'active' || step.status === 'completed') && (
                                                    <button
                                                        onClick={() => navigate(`/collab?dmCreator=${encodeURIComponent(step.maker || '')}`)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'var(--accent)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            fontSize: '0.85rem',
                                                            marginLeft: '0.5rem',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '4px',
                                                        }}
                                                        className="hover-bg-glass"
                                                    >
                                                        <MessageCircle size={14} /> 联系
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                            <span>{step.date}</span>
                                            {step.time && <span>{step.time}</span>}
                                        </div>
                                    </div>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background: step.status === 'completed' ? 'var(--accent-light)' : step.status === 'active' ? 'var(--glass-bg)' : 'transparent',
                                        color: step.status === 'completed' ? 'var(--accent)' : step.status === 'active' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        border: step.status === 'active' ? '1px solid var(--accent)' : '1px solid transparent'
                                    }}>
                                        {step.status === 'completed' ? '已完成' : step.status === 'active' ? '买家确认中' : '等待接单'}
                                    </span>
                                </div>

                                {/* Visual Evidence Section */}
                                {step.evidence && (
                                    <div style={{ marginTop: '1.5rem', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>影像存证 (Visual Proof)</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                            {step.evidence.map((img, i) => (
                                                <img key={i} src={img} alt="proof" style={{ height: '120px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
                                            ))}
                                        </div>
                                        {step.status === 'active' && (
                                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>要求返工</button>
                                                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>确认通过 (进入下一节点)</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
