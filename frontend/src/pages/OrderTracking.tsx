import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function OrderTracking() {
    type TrackingStep = {
        label: string;
        date: string;
        time: string;
        status: 'completed' | 'active' | 'pending';
        maker?: string;
        evidence?: string[];
    };

    const steps: TrackingStep[] = [
        { label: '订单已确认', date: 'Oct 12', time: '10:00 AM', status: 'completed' },
        { label: '基础素体准备中', date: 'Oct 15', time: '2:30 PM', status: 'completed' },
        { label: '面部妆容绘制中', date: 'Oct 18', time: 'In Progress', status: 'active', maker: 'Kiki Faceups (妆娘)', evidence: ['/images/faceup_kiki.png'] },
        { label: '专属娃衣制作与试穿', date: '待开始', time: '', status: 'pending', maker: 'Lumina Outfits (娃衣)' },
        { label: '组装与出厂质检', date: '待开始', time: '', status: 'pending' },
        { label: '已发货', date: '待开始', time: '', status: 'pending' },
    ];

    return (
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>订单详情 #TRK-9824X</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>三分 BJD (1/3 Scale) • 暗黑哥特主题</p>

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

                    {steps.map((step, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            gap: '2rem',
                            marginBottom: idx === steps.length - 1 ? 0 : '3rem',
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
                                            <p style={{ color: 'var(--accent)', fontSize: '0.9rem', marginTop: '0.25rem' }}>当前负责人: {step.maker}</p>
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
