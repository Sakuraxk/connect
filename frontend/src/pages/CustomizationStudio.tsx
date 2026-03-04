import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import type { Order } from '../contexts/OrderContext';

type Step = 'body' | 'faceup' | 'hair' | 'outfit' | 'review';
const steps: { id: Step; label: string }[] = [
    { id: 'body', label: '基础素体' },
    { id: 'faceup', label: '专属妆面 (妆娘)' },
    { id: 'hair', label: '头发与眼片' },
    { id: 'outfit', label: '服饰搭配' },
    { id: 'review', label: '确认订单' },
];

const mockData = {
    body: [
        { id: 'b1', name: '三分树脂素体 (1/3)', price: 200, time: 30, img: '/images/preview_base.png' },
        { id: 'b2', name: '四分树脂素体 (1/4)', price: 150, time: 20, img: '/images/preview_base.png' },
        { id: 'b3', name: '20cm 棉花娃娃素体', price: 40, time: 10, img: '/images/cotton_doll.png' },
    ],
    faceup: [
        { id: 'f1', name: 'Kiki (柔美粉彩风)', price: 60, time: 45, img: '/images/preview_faceup_kiki.png' },
        { id: 'f2', name: 'Luna (暗黑哥特风)', price: 75, time: 60, img: '/images/preview_faceup_luna.png' },
        { id: 'f3', name: '跳过 (暂不化妆/自带)', price: 0, time: 0, img: '' },
    ],
    hair: [
        { id: 'h1', name: '大波浪微卷金发', price: 25, time: 5, img: '/images/hair_blonde.png' },
        { id: 'h2', name: '利落短波波头 (黑)', price: 20, time: 5, img: '' },
    ],
    outfit: [
        { id: 'o1', name: '森林精灵华丽套装', price: 45, time: 15, img: '/images/outfit_fairy.png' },
        { id: 'o2', name: '日常高街休闲服', price: 30, time: 10, img: '' },
    ]
};

export default function CustomizationStudio() {
    const navigate = useNavigate();
    const { addOrder } = useOrders();
    const [currentStep, setCurrentStep] = useState<Step>('body');
    const [reviewStep, setReviewStep] = useState<number>(1); // Sub-steps for the review modal (1, 2, or 3)
    const [selections, setSelections] = useState<Record<string, any>>({
        body: null,
        faceup: null,
        hair: null,
        outfit: null,
    });

    const handleSelect = (item: any) => {
        setSelections(prev => ({ ...prev, [currentStep]: item }));
    };

    const nextStep = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id);
            if (steps[currentIndex + 1].id === 'review') {
                setReviewStep(1); // Reset review sub-step when entering review mode
            }
        }
    };

    const prevStep = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id);
        }
    };

    const clearSelection = () => {
        setSelections(prev => ({ ...prev, [currentStep]: null }));
    };

    const calculateTotal = () => {
        let total = 0;
        let time = 0;
        let details: Record<string, { name: string, price: number }> = {};

        Object.entries(selections).forEach(([key, item]) => {
            if (item && item.price > 0) {
                total += Number(item.price);
                time += Number(item.time) || 0; // Simplified additive wait time
                details[key] = { name: item.name, price: Number(item.price) };
            }
        });

        // ArtChain Platform Escrow & Insurance Fee (5%)
        const platformFee = Math.round(total * 0.05);

        return { total, time, details, platformFee, grandTotal: total + platformFee };
    };

    const renderOptions = (items: any[]) => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {items.map(item => (
                <div
                    key={item.id}
                    className="glass-card hover-scale"
                    style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        border: selections[currentStep]?.id === item.id ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
                        position: 'relative'
                    }}
                    onClick={() => handleSelect(item)}
                >
                    {selections[currentStep]?.id === item.id && (
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent)', color: 'white', borderRadius: '50%', padding: '4px' }}>
                            <Check size={16} />
                        </div>
                    )}
                    {item.img ? (
                        <img src={item.img} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                    ) : (
                        <div style={{ width: '100%', height: '150px', background: 'var(--glass-border)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            暂无预览图
                        </div>
                    )}
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span>${item.price}</span>
                        <span>{item.time} 天</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleSubmitOrder = () => {
        const { grandTotal } = calculateTotal();
        const baseName = selections.body?.name || '未知素体';
        const faceupName = selections.faceup ? ` • ${selections.faceup.name}` : '';
        const orderName = `${baseName}${faceupName}`;

        const newOrder: Order = {
            id: `TRK-${Math.floor(Math.random() * 100000)}`,
            name: orderName,
            date: new Date().toISOString().split('T')[0],
            status: 'processing',
            total: grandTotal,
            img: selections.body?.img || '/images/cotton_doll.png',
            steps: [
                { label: '订单已确认', date: 'Just now', time: '', status: 'completed' },
                { label: '基础素体准备中', date: '待开始', time: '', status: 'pending' },
                { label: '面部妆容绘制中', date: '待开始', time: '', status: 'pending' },
                { label: '专属娃衣制作与试穿', date: '待开始', time: '', status: 'pending' },
                { label: '组装与出厂质检', date: '待开始', time: '', status: 'pending' },
                { label: '已发货', date: '待开始', time: '', status: 'pending' },
            ]
        };

        addOrder(newOrder);
        navigate('/tracking');
    };

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

            {/* Sidebar / Visualizer Panel */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>

                {/* Visualizer has been moved to the main form area */}

                {/* Progress Tracker Tracker */}
                <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="title-gradient" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>定制进度</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {steps.map((step, idx) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = steps.findIndex(s => s.id === currentStep) > idx || (step.id === 'review' && currentStep === 'review');

                            return (
                                <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: isActive || isCompleted ? 1 : 0.5 }}>
                                    <div style={{
                                        width: '30px', height: '30px', borderRadius: '50%',
                                        background: isActive ? 'var(--accent)' : isCompleted ? 'var(--accent-light)' : 'var(--glass-bg)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isActive ? 'white' : 'inherit',
                                        border: `1px solid ${isActive || isCompleted ? 'var(--accent)' : 'var(--glass-border)'}`
                                    }}>
                                        {isCompleted && !isActive ? <Check size={16} color="var(--accent)" /> : <span style={{ fontSize: '0.9rem' }}>{idx + 1}</span>}
                                    </div>
                                    <span style={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--accent)' : 'inherit' }}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>预估总金额:</span>
                            <span style={{ fontWeight: 700 }}>${calculateTotal().grandTotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                            <span>预计工期:</span>
                            <span>约 {calculateTotal().time} 天</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="glass-panel" style={{ flex: 1, padding: '2rem', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                {currentStep !== 'review' ? (
                    <>
                        <h2 className="title-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>选择 {steps.find(s => s.id === currentStep)?.label}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>从优质且认证的创作者中挑选您的神仙太太，打造独一无二的作品。</p>

                        {renderOptions(mockData[currentStep as keyof typeof mockData])}



                        <div style={{ marginTop: 'auto', paddingTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                className="btn-secondary hover-scale"
                                onClick={clearSelection}
                                disabled={!selections[currentStep]}
                                style={{ opacity: !selections[currentStep] ? 0.5 : 1, fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                            >
                                清空当前选择
                            </button>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn-secondary hover-scale"
                                    onClick={prevStep}
                                    disabled={currentStep === 'body'}
                                    style={{ opacity: currentStep === 'body' ? 0.5 : 1, visibility: currentStep === 'body' ? 'hidden' : 'visible' }}
                                >
                                    返回上一步
                                </button>
                                <button
                                    className="btn-primary hover-scale"
                                    onClick={nextStep}
                                    disabled={!selections[currentStep]}
                                    style={{ opacity: !selections[currentStep] ? 0.5 : 1 }}
                                >
                                    下一步 <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '3rem 0' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: 'var(--glass-bg)',
                            border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(138, 43, 226, 0.3)'
                        }}>
                            <CheckCircle2 size={40} color="var(--accent)" />
                        </div>
                        <h2 className="title-gradient" style={{ fontSize: '2rem' }}>配置已完成</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>您已完成全部定制选项，订单已生成。您可以在弹出的确认窗口中核对并提交订单。</p>
                        <button className="btn-secondary hover-scale" onClick={prevStep} style={{ marginTop: '1rem', padding: '0.8rem 2.5rem' }}>
                            返回修改配置
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Overlay for Review Step */}
            {currentStep === 'review' && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0', // Full bleed, no padding around the modal panel
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="glass-panel" style={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto', // Allow scrolling if screen is too small
                        background: 'var(--bg-primary)',
                        padding: '2rem', // Add a little margin on all sides of the box
                        borderRadius: '0',
                        position: 'relative',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start' // Changed from center to allow natural sizing from top
                    }}>
                        {/* Sub-Step 1: Introduction */}
                        {reviewStep === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, animation: 'fadeIn 0.3s ease-out' }}>
                                <div style={{ textAlign: 'center', marginBottom: '2rem', flexShrink: 0 }}>
                                    <CheckCircle2 size={56} color="var(--accent)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
                                    <h2 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>准备就绪 (ArtChain 资金存管体系)</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.5 }}>
                                        您的多方协作订单已生成。ArtChain 官方资金存管 (Escrow) 将在每一位创作者完成节点打卡（影像存证）并经您确认后，才会按比例解冻资金。让您的定制彻底告别翻车与卷款跑路。
                                    </p>
                                </div>
                                <button className="btn-primary" onClick={() => setReviewStep(2)} style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                                    开始确认订单
                                </button>
                            </div>
                        )}

                        {/* Sub-Step 2: Cost Breakdown */}
                        {reviewStep === 2 && (
                            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'nowrap', alignItems: 'stretch', justifyContent: 'center', flex: 1, animation: 'fadeIn 0.3s ease-out', width: '100%', maxWidth: '1200px', margin: '0 auto', minHeight: 'min-content' }}>
                                {/* Left Side: Itemized Breakdown */}
                                <div style={{ flex: 2, background: 'var(--glass-bg)', padding: '2.5rem 3.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>拆单计费明细</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {Object.entries(calculateTotal().details).map(([key, item]) => {
                                            const percentage = Math.round((item.price / calculateTotal().grandTotal) * 100);
                                            return (
                                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.4rem' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                                            {key === 'body' ? '素体/材料费' : '创作者手工费'}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                                        <span style={{ fontWeight: 600, fontSize: '1.15rem' }}>${item.price}</span>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{percentage}%</span>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.4rem' }}>ArtChain 组装与保险费 (5%)</div>
                                                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>包含物流聚合与保险责任</div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                                <span style={{ fontWeight: 600, fontSize: '1.15rem' }}>${calculateTotal().platformFee}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {Math.round((calculateTotal().platformFee / calculateTotal().grandTotal) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Total & Actions */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'center' }}>
                                    <div style={{ background: 'var(--glass-bg)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>总计</div>
                                        <div style={{ color: 'var(--accent)', fontSize: '3rem', fontWeight: 700 }}>${calculateTotal().grandTotal}</div>
                                    </div>

                                    <button className="btn-secondary hover-scale" onClick={prevStep} style={{ width: '100%', padding: '1.25rem', fontSize: '1.15rem', borderRadius: '16px', background: 'transparent' }}>
                                        返回修改配置
                                    </button>
                                    <button className="btn-primary" onClick={() => setReviewStep(3)} style={{ width: '100%', padding: '1.25rem', fontSize: '1.15rem', borderRadius: '16px' }}>
                                        确认明细，下一步
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Sub-Step 3: Payment Plan */}
                        {reviewStep === 3 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, animation: 'fadeIn 0.3s ease-out', width: '100%', maxWidth: '1000px', margin: '0 auto', minHeight: 'min-content' }}>
                                <div style={{ width: '100%', background: 'var(--glass-bg)', padding: '3.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', marginBottom: '3rem', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>节点打款计划</h3>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', whiteSpace: 'nowrap' }}>阶段 1: 创作者备料 <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>(冻结)</span></span>
                                            <span style={{ fontWeight: 600, fontSize: '1.25rem', whiteSpace: 'nowrap' }}>30% (${Math.round(calculateTotal().grandTotal * 0.3)})</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', whiteSpace: 'nowrap' }}>阶段 2: 核心制作完工 <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>(冻结)</span></span>
                                            <span style={{ fontWeight: 600, fontSize: '1.25rem', whiteSpace: 'nowrap' }}>40% (${Math.round(calculateTotal().grandTotal * 0.4)})</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', whiteSpace: 'nowrap' }}>阶段 3: 官方发货后 <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>(冻结)</span></span>
                                            <span style={{ fontWeight: 600, fontSize: '1.25rem', whiteSpace: 'nowrap' }}>30% (${Math.round(calculateTotal().grandTotal * 0.3)})</span>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '1rem', color: 'var(--accent)', marginTop: '2.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                                        *资金将托管于平台，仅在您确认节点存证后解冻。
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                                    <button className="btn-secondary hover-scale" onClick={() => setReviewStep(2)} style={{ flex: 1, padding: '1.25rem', fontSize: '1.25rem', borderRadius: '16px', background: 'transparent' }}>
                                        上一步
                                    </button>
                                    <button className="btn-primary" onClick={handleSubmitOrder} style={{ flex: 2, padding: '1.25rem', fontSize: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: '16px' }}>
                                        <ShoppingBag size={24} /> 托管资金并提交订单
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
