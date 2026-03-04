import { useState, useEffect, useRef, useMemo } from 'react';
import { Settings, Share2, Grid, Clock, Star, Heart, MessageSquare, Camera, Check, X, ChevronRight, Info, Package, Hammer, Sparkles, CheckCircle2 } from 'lucide-react';

import { useOrders } from '../contexts/OrderContext';
import { useStars } from '../contexts/StarContext';

interface UserProfile {
    username: string;
    avatar: string;
    uid: string;
    level: string;
    bio: string;
    stats: {
        posts: number;
        following: number;
        fans: number;
        likes: number;
    };
}

// Ensure Profile Order structure matches Context Order structure
interface OrderStep {
    name: string;
    status: 'completed' | 'current' | 'pending';
    time: string;
}

interface Order {
    id: string;
    name: string;
    status: string;
    date: string;
    image: string;
    description?: string;
    steps?: OrderStep[];
    result_images?: string[];
}

interface Post {
    id: number;
    author: string;
    avatar: string;
    content: string;
    image?: string;
    likes: number;
    time: string;
}

export default function Profile() {
    const { orders: globalOrders } = useOrders();
    const { starredPosts } = useStars();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState<'posts' | 'orders' | 'stars'>('posts');
    const [isLoading, setIsLoading] = useState(true);

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', bio: '', avatar: '' });
    const [isSaving, setIsSaving] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Order Detail state
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, postsRes] = await Promise.all([
                fetch('http://localhost:8000/api/user/profile'),
                fetch('http://localhost:8000/api/user/posts')
            ]);

            const [profileData, postsData] = await Promise.all([
                profileRes.json(),
                postsRes.json()
            ]);

            setProfile(profileData);
            setEditForm({
                username: profileData.username,
                bio: profileData.bio,
                avatar: profileData.avatar
            });
            setPosts(postsData);
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm({ ...editForm, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:8000/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate progress percentage for orders
    const orderProgress = useMemo(() => {
        if (!selectedOrder || !selectedOrder.steps) return 0;
        const total = selectedOrder.steps.length;
        const completed = selectedOrder.steps.filter(s => s.status === 'completed').length;
        const current = selectedOrder.steps.filter(s => s.status === 'current').length;
        return Math.min(100, Math.round(((completed + (current ? 0.5 : 0)) / total) * 100));
    }, [selectedOrder]);

    if (isLoading || !profile) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                加载中...
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            {/* Profile Header */}
            <div className="glass-card animate-fade-in" style={{ padding: '3rem', borderRadius: '32px', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '3rem', alignItems: 'center' }}>

                    {/* Avatar with Glow Control */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            inset: '-8px',
                            background: 'var(--accent-gradient)',
                            borderRadius: '50%',
                            opacity: 0.3,
                            filter: 'blur(12px)',
                            zIndex: 0
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <img
                                src={isEditing ? editForm.avatar : profile.avatar}
                                alt={profile.username}
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    borderRadius: '50%',
                                    border: '4px solid white',
                                    background: 'white',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                            {isEditing && (
                                <div
                                    onClick={() => avatarInputRef.current?.click()}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.3)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    className="hover-scale"
                                >
                                    <Camera size={24} />
                                </div>
                            )}
                            <input
                                type="file"
                                hidden
                                ref={avatarInputRef}
                                accept="image/*"
                                onChange={handleAvatarUpload}
                            />
                        </div>
                    </div>

                    {/* User Info & Editing Logic */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.8rem' }}>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    style={{
                                        fontSize: '2.4rem',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        background: 'rgba(0,0,0,0.05)',
                                        border: '1px solid var(--accent)',
                                        borderRadius: '8px',
                                        padding: '0.2rem 0.5rem',
                                        width: '100%',
                                        maxWidth: '400px',
                                        outline: 'none'
                                    }}
                                />
                            ) : (
                                <h1 style={{ fontSize: '2.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{profile.username}</h1>
                            )}

                            <span style={{
                                background: 'var(--accent-gradient)',
                                color: 'white',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(255,107,156,0.2)',
                                zIndex: 2
                            }}>
                                {profile.level}
                            </span>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.2rem', letterSpacing: '0.5px' }}>UID: {profile.uid}</p>

                        {isEditing ? (
                            <textarea
                                value={editForm.bio}
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                style={{
                                    fontSize: '1.1rem',
                                    color: 'var(--text-primary)',
                                    marginBottom: '1.8rem',
                                    lineHeight: 1.6,
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.05)',
                                    border: '1px solid var(--accent)',
                                    borderRadius: '8px',
                                    padding: '0.5rem',
                                    height: '80px',
                                    resize: 'none',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        ) : (
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.8rem', lineHeight: 1.6 }}>{profile.bio}</p>
                        )}

                        {/* Stats Bar */}
                        <div style={{ display: 'flex', gap: '3.5rem' }}>
                            {[
                                { label: '动态', value: profile.stats.posts },
                                { label: '关注', value: profile.stats.following },
                                { label: '粉丝', value: profile.stats.fans },
                                { label: '获赞', value: profile.stats.likes }
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="btn-primary"
                                    style={{ padding: '0.8rem 1.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                                >
                                    <Check size={18} />
                                    {isSaving ? '保存中...' : '保存更改'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditForm({
                                            username: profile.username,
                                            bio: profile.bio,
                                            avatar: profile.avatar
                                        });
                                    }}
                                    className="glass-card"
                                    style={{ padding: '0.8rem 1.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid var(--glass-border)' }}
                                >
                                    <X size={18} />
                                    取消
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-primary"
                                    style={{ padding: '0.8rem 1.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                                >
                                    <Settings size={18} />
                                    编辑资料
                                </button>
                                <button className="glass-card" style={{ padding: '0.8rem 1.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid var(--glass-border)' }}>
                                    <Share2 size={18} />
                                    分享主页
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div style={{ display: 'flex', gap: '3rem', borderBottom: '1px solid var(--glass-border)', padding: '0 1rem', marginBottom: '2rem' }}>
                {[
                    { id: 'posts', label: '我的动态', icon: Grid },
                    { id: 'orders', label: '定制进度', icon: Clock },
                    { id: 'stars', label: '我的收藏', icon: Star }
                ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                paddingBottom: '1.2rem',
                                borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                fontSize: '1.1rem',
                                fontWeight: isActive ? 600 : 500,
                                background: 'transparent',
                                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Icon size={20} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'posts' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {posts.map(post => (
                            <div key={post.id} className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1rem' }}>{post.content}</p>
                                {post.image && (
                                    <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <img src={post.image} style={{ width: '100%', display: 'block' }} alt="Post" />
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Heart size={16} /> {post.likes}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MessageSquare size={16} /> 评论</span>
                                    <span style={{ marginLeft: 'auto' }}>{post.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '1.5rem' }}>
                        {globalOrders.map(order => (
                            <div
                                key={order.id}
                                className="glass-card"
                                onClick={() => setSelectedOrder({
                                    id: order.id,
                                    name: order.name,
                                    status: order.status === 'processing' ? '制作中' : '已完成',
                                    date: order.date,
                                    image: order.img || '',
                                    // Map Context Status to Profile Status
                                    steps: order.steps.map(s => ({
                                        name: s.label,
                                        time: s.date,
                                        status: s.status === 'active' ? 'current' : s.status
                                    }))
                                })}
                                style={{
                                    display: 'flex',
                                    gap: '2rem',
                                    padding: '1.8rem',
                                    borderRadius: '24px',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ width: '110px', height: '110px', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                                    <img src={order.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={order.name} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{order.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>订单号: {order.id}</p>

                                    {/* Simple Mini Progress Indicator */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }}>
                                            <div style={{
                                                width: order.status === 'delivered' ? '100%' : '60%',
                                                height: '100%',
                                                background: order.status === 'delivered' ? '#10b981' : 'var(--accent)',
                                                borderRadius: '2px'
                                            }} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: order.status === 'delivered' ? '#10b981' : 'var(--accent)'
                                        }}>
                                            {order.status === 'processing' ? '制作中' : '已完成'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ padding: '0.5rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
                                    <ChevronRight size={24} color="var(--accent)" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'stars' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {starredPosts.length > 0 ? (
                            starredPosts.map(post => (
                                <div key={post.id} className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                                        <img
                                            src={post.avatar}
                                            alt={post.author}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{post.author}</h4>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{post.time}</span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1rem' }}>{post.content}</p>
                                    {post.image && (
                                        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <img src={post.image} style={{ width: '100%', display: 'block' }} alt="Post" />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)' }}><Star size={16} fill="var(--accent)" /> 已收藏</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Heart size={16} /> {post.likes}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                                <Star size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                                <div>暂无收藏内容</div>
                                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>去社区逛逛吧</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Redesigned Order Detail Modal Overlay */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }} onClick={() => setSelectedOrder(null)}>
                    <div
                        className="glass-card animate-fade-in"
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            padding: '3.5rem',
                            borderRadius: '40px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.2)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: 'var(--accent-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)'
                                }}>
                                    <Package size={32} />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.4rem 0', letterSpacing: '-0.5px' }}>{selectedOrder.name}</h1>
                                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>订单编号: {selectedOrder.id}</span>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>下单时间: {selectedOrder.date}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="hover-scale"
                                style={{ background: '#f1f5f9', padding: '0.8rem', borderRadius: '50%', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.05)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Overall Progress Section */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '24px',
                            padding: '2rem',
                            marginBottom: '3rem',
                            border: '1px solid rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Hammer size={20} color="var(--accent)" />
                                    <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>总体进程</span>
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' }}>{orderProgress}%</span>
                            </div>
                            <div style={{ height: '10px', background: 'rgba(0,0,0,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${orderProgress}%`,
                                    height: '100%',
                                    background: 'var(--accent-gradient)',
                                    borderRadius: '5px',
                                    transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3.5rem' }}>
                            {/* Left: Progress Timeline Cards */}
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <CheckCircle2 size={24} className="title-gradient" />
                                    工期明细
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {selectedOrder.steps?.map((step, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            gap: '1.5rem',
                                            padding: '1.2rem 1.5rem',
                                            borderRadius: '20px',
                                            background: step.status === 'completed' ? 'rgba(16,185,129,0.04)' : step.status === 'current' ? 'rgba(217,70,239,0.04)' : 'transparent',
                                            border: `1px solid ${step.status === 'current' ? 'var(--accent)' : 'rgba(0,0,0,0.05)'}`,
                                            opacity: step.status === 'pending' ? 0.5 : 1,
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                background: step.status === 'completed' ? '#10b981' : step.status === 'current' ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                flexShrink: 0,
                                                marginTop: '0.2rem'
                                            }}>
                                                {step.status === 'completed' ? <Check size={16} /> : <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{idx + 1}</span>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{step.name}</span>
                                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{step.time}</span>
                                                </div>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    color: step.status === 'completed' ? '#10b981' : step.status === 'current' ? 'var(--accent)' : 'var(--text-muted)'
                                                }}>
                                                    {step.status === 'completed' ? '已达成' : step.status === 'current' ? '正在加速生产...' : '待启动'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Info & Gallery */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <Info size={24} className="title-gradient" />
                                        制作说明
                                    </h3>
                                    <div style={{
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        background: '#f8fafc',
                                        fontSize: '1rem',
                                        lineHeight: 1.7,
                                        color: '#475569',
                                        border: '1px solid rgba(0,0,0,0.03)'
                                    }}>
                                        {selectedOrder.description || "暂无相关详细说明。"}
                                    </div>
                                </div>

                                {selectedOrder.result_images && (
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <Sparkles size={24} className="title-gradient" />
                                            成果画廊
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                            {selectedOrder.result_images.map((img, idx) => (
                                                <div key={idx} className="hover-scale" style={{
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: 'var(--shadow-sm)',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    cursor: 'zoom-in'
                                                }}>
                                                    <img src={img} style={{ width: '100%', height: '140px', objectFit: 'cover' }} alt="Gallery" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem' }}>
                            <button
                                className="glass-card"
                                style={{ flex: 1, padding: '1.2rem', borderRadius: '20px', fontWeight: 700, fontSize: '1.1rem' }}
                            >
                                下载工单报告
                            </button>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="btn-primary"
                                style={{ flex: 2, padding: '1.2rem', borderRadius: '20px', fontWeight: 700, fontSize: '1.1rem' }}
                            >
                                确认并关闭
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
