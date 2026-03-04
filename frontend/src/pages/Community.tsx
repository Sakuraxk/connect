import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Heart, Share2, Image as ImageIcon, Send, X, Star } from 'lucide-react';
import { useStars } from '../contexts/StarContext';

interface Post {
    id: number;
    author: string;
    avatar: string;
    content: string;
    image?: string;
    likes: number;
    time: string;
}

export default function Community() {
    const { starredPosts, toggleStar, isStarred } = useStars();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim() && !selectedImage) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newPostContent,
                    image: selectedImage || undefined
                }),
            });

            if (response.ok) {
                setNewPostContent('');
                setSelectedImage(null);
                fetchPosts();
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'var(--bg-gradient)',
            overflow: 'hidden'
        }}>
            {/* Scrollable Content Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 0 100px', // Padding for bottom input
                WebkitOverflowScrolling: 'touch'
            }}>
                {/* Page Header - Now Scrolls */}
                <div style={{ padding: '3rem 3rem 1.5rem' }}>
                    <h1 className="title-gradient" style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>内容社区</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>探索各类神仙 OC、结交优秀创作者，分享你的创意瞬间。</p>
                </div>

                {/* Posts Feed - Grid with uniform sizing */}
                <div style={{
                    padding: '0 3rem 2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2rem',
                    alignContent: 'start'
                }}>
                    {posts.map((post) => (
                        <div key={post.id} className="glass-card animate-fade-in" style={{
                            padding: '1.5rem',
                            minHeight: '320px', // Reduced height base
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '20px'
                        }}>
                            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                                <img
                                    src={post.avatar}
                                    alt={post.author}
                                    style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--bg-card)', objectFit: 'cover' }}
                                    onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + post.author)}
                                />
                                <div>
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{post.author}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{post.time}</span>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '1rem',
                                lineHeight: 1.5,
                                color: 'var(--text-primary)',
                                marginBottom: '1.2rem',
                                flex: post.image ? '0 0 auto' : '1'
                            }}>
                                {post.content}
                            </p>

                            {post.image && (
                                <div style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    marginBottom: '1.2rem',
                                    border: '1px solid var(--glass-border)',
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img
                                        src={post.image}
                                        alt="Post content"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: 'auto' }}>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }} className="hover-accent">
                                    <Heart size={18} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{post.likes}</span>
                                </button>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer'
                                }} className="hover-accent">
                                    <MessageSquare size={18} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>评论</span>
                                </button>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer'
                                }} className="hover-accent">
                                    <Share2 size={18} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>分享</span>
                                </button>
                                <button
                                    onClick={() => toggleStar(post)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: isStarred(post.id) ? 'var(--accent)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        marginLeft: 'auto',
                                        transition: 'all 0.2s'
                                    }}
                                    className="hover-scale"
                                >
                                    <Star size={18} fill={isStarred(post.id) ? 'var(--accent)' : 'transparent'} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                        {isStarred(post.id) ? '已收藏' : '收藏'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* WeChat-style Bottom Input Bar - Opaque & Full Width */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'var(--bg-color)', // Solid opaque background
                borderTop: '1px solid var(--glass-border)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                padding: '0.8rem 2rem 1.5rem', // Extra space for mobile/bottom area
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            {/* Attachment Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="hover-scale"
                                title="上传图片"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--accent-light)',
                                    color: 'var(--accent)',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    marginBottom: '2px'
                                }}
                            >
                                <ImageIcon size={22} />
                            </button>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            {/* Text Input area */}
                            <div style={{ flex: 1, position: 'relative' }}>
                                <textarea
                                    placeholder="写下你的想法..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    style={{
                                        width: '100%',
                                        minHeight: '44px',
                                        maxHeight: '150px',
                                        background: 'rgba(0,0,0,0.03)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '22px',
                                        padding: '0.75rem 1.2rem',
                                        color: 'var(--text-primary)',
                                        fontSize: '1.05rem',
                                        resize: 'none',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        lineHeight: '1.4'
                                    }}
                                />
                            </div>

                            {/* Send Button */}
                            <button
                                type="submit"
                                disabled={isLoading || (!newPostContent.trim() && !selectedImage)}
                                className="btn-primary"
                                style={{
                                    height: '44px',
                                    width: '44px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    opacity: (isLoading || (!newPostContent.trim() && !selectedImage)) ? 0.6 : 1,
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    marginBottom: '2px'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </div>

                        {/* Image Preview Overlay */}
                        {selectedImage && (
                            <div style={{ position: 'relative', width: 'fit-content', marginLeft: '54px' }}>
                                <div style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '2px solid var(--accent)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        style={{ height: '70px', display: 'block' }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(null)}
                                    style={{
                                        position: 'absolute',
                                        top: '-0.5rem',
                                        right: '-0.5rem',
                                        background: 'var(--accent)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '22px',
                                        height: '22px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        zIndex: 10
                                    }}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
