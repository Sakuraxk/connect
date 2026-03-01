import { ArrowRight, Sparkles, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const categories = [
        { id: 'bjd', name: 'BJD 娃娃', desc: '树脂球体关节精美人偶', icon: Sparkles },
        { id: 'cotton', name: '棉花娃娃', desc: '软萌可爱毛绒填棉玩偶', icon: Heart },
        { id: '3d-dolls', name: '3D 娃娃/模型', desc: '精准 3D 打印工业级部件', icon: Star },
        { id: 'clay', name: '黏土人/手办', desc: '纯手工捏制独一无二 OC', icon: Star },
        { id: 'accessories', name: '周边配件', desc: '吧唧、色纸、痛包等小件', icon: Sparkles },
        { id: 'crochet', name: '钩织手作', desc: '毛线钩织温暖衣物与配饰', icon: Heart },
        { id: 'twisted-stick', name: '扭扭棒工艺', desc: '毛茸茸的魔法造型艺术', icon: Sparkles },
        { id: 'others', name: '其他种类', desc: '更多未分类的神仙定制脑洞', icon: Star },
    ];


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

            {/* Hero Section */}
            <section className="glass-panel" style={{
                position: 'relative',
                padding: '4rem 2rem',
                overflow: 'hidden',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center'
            }}>
                {/* Hero Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url(/images/hero_bjd.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%',
                    zIndex: 0
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, var(--bg-color) 0%, transparent 100%)',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', marginLeft: '4rem' }}>
                    <h1 className="title-gradient" style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                        让你的 OC <br />透明化地来到现实。
                    </h1>
                    <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        最懂得娃圈生态的一站式定制工作室。从 BJD、棉花娃娃到各式神仙手作周边。
                        这里连接顶尖创作者，全链路进度清晰可见，彻底告别漫无目的的排单等待。
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary hover-scale" onClick={() => navigate('/studio')} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            开始全链路定制 <ArrowRight size={20} />
                        </button>
                        <button className="btn-secondary hover-scale" onClick={() => navigate('/community')} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            探索内容社区
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h2 className="title-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>探索定制分类</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>总有一种载体，能完美呈现你的奇思妙想</p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {categories.map((cat, idx) => (
                        <div key={idx} className="glass-card" style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'var(--accent-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent)'
                            }}>
                                <cat.icon size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{cat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
