import { ArrowRight, Sparkles, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const categories = [
        { id: 'bjd', name: 'BJD 娃娃', desc: '树脂球体关节精美人偶', icon: Sparkles, image: '/images/hero_bjd.png' },
        { id: 'cotton', name: '棉花娃娃', desc: '软萌可爱毛绒填棉玩偶', icon: Heart, image: '/images/cotton_doll.png' },
        { id: '3d-dolls', name: '3D 娃娃/模型', desc: '精准 3D 打印工业级部件', icon: Star, image: '/images/category_3d_doll.png' },
        { id: 'clay', name: '黏土人/手办', desc: '纯手工捏制独一无二 OC', icon: Star, image: '/images/category_clay.png' },
        { id: 'accessories', name: '周边配件', desc: '吧唧、色纸、痛包等小件', icon: Sparkles, image: '/images/category_accessories.png' },
        { id: 'crochet', name: '钩织手作', desc: '毛线钩织温暖衣物与配饰', icon: Heart, image: '/images/category_crochet.png' },
        { id: 'twisted-stick', name: '扭扭棒工艺', desc: '毛茸茸的魔法造型艺术', icon: Sparkles, image: '/images/category_twisted_stick.png' },
        { id: 'others', name: '其他种类', desc: '更多末分类的神仙定制脑洞', icon: Star, image: '/images/preview_base.png' },
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
                    backgroundImage: 'url(/images/hero_montage.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, var(--bg-color) 80%, transparent 100%)',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', marginLeft: '4rem' }}>
                    <h1 className="title-gradient" style={{ fontSize: '4.4rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                        让你的创意 <br />触手可及地来到现实。
                    </h1>
                    <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        ArtChain 是最懂手作生态的一站式定制平台。从 BJD、棉花娃娃到各式 3D 打印、黏土人、手工钩织周边。
                        这里连接顶尖创作者，全链路进度透明可见，将你的热爱化为实物，将你的梦想精准送达。
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary hover-scale" onClick={() => navigate('/studio')} style={{ fontSize: '1.1rem', padding: '1rem 2.4rem' }}>
                            立即开始定制 <ArrowRight size={20} />
                        </button>
                        <button className="btn-secondary hover-scale" onClick={() => navigate('/community')} style={{ fontSize: '1.1rem', padding: '1rem 2.4rem' }}>
                            探索灵感社区
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h2 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>覆盖全品类的定制分类</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>总有一种形式，能承载你的奇思妙想</p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {categories.map((cat, idx) => (
                        <div key={idx} className="glass-card hover-lift" style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: 'var(--accent-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent)',
                                flexShrink: 0
                            }}>
                                <cat.icon size={28} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{cat.name}</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{cat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
