import { useState } from 'react';
import { Send, Image as ImageIcon, Smile, MoreHorizontal, Users, Paperclip } from 'lucide-react';

export default function CollaborationHub() {
    // Mock user & chat data
    const currentUser = { id: 'u1', name: '我 (买家)', avatar: 'bg-blue-200' };

    const chatThreads = [
        {
            id: 'c1',
            type: 'group',
            name: '订单 #TRK-9824X 交付协作群',
            members: ['我 (买家)', 'Kiki (妆娘)', 'Lumina (娃衣)'],
            lastMessage: 'Kiki (妆娘): 头部消光已经喷好了，确认下细节图...',
            time: '14:30',
            active: true
        },
        {
            id: 'c2',
            type: 'dm',
            name: 'ResinWorks Official (素体店)',
            members: ['我 (买家)', '客服'],
            lastMessage: '您的素体已发出，请注意查收丰巢。',
            time: '昨天',
            active: false
        }
    ];

    const messages = [
        { id: 'm1', sender: 'Lumina (娃衣)', text: '太太，确认一下这块蕾丝布料的花纹可以吗？', time: '10:00', isMe: false },
        { id: 'm2', sender: 'Lumina (娃衣)', isImage: true, imgUrl: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=200&h=200', time: '10:01', isMe: false },
        { id: 'm3', sender: currentUser.name, text: '可以的！很仙气。Kiki太那边的妆面进度怎么样啦？', time: '10:15', isMe: true },
        { id: 'm4', sender: 'Kiki (妆娘)', text: '刚上完底色，晚上拍给您看哦！', time: '10:20', isMe: false },
        { id: 'm5', sender: 'Kiki (妆娘)', text: '不过我觉得眼线的颜色可以稍微加深一点，配这个蕾丝裙会更有哥特风。', time: '10:21', isMe: false },
        { id: 'm6', sender: currentUser.name, text: '好呀！听你的，麻烦两位神仙太太了～', time: '10:25', isMe: true },
    ];

    const [inputText, setInputText] = useState('');

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 0, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)' }}>
                {/* Left Sidebar - Thread List */}
                <div style={{ width: '320px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <input
                            type="text"
                            placeholder="搜索订单、创作者或聊天记录"
                            style={{
                                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {chatThreads.map(thread => (
                            <div key={thread.id} style={{
                                padding: '1rem',
                                borderBottom: '1px solid var(--glass-border)',
                                cursor: 'pointer',
                                background: thread.active ? 'var(--accent-light)' : 'transparent',
                                borderLeft: thread.active ? '4px solid var(--accent)' : '4px solid transparent'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <h4 style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {thread.type === 'group' && <Users size={16} color="var(--accent)" />}
                                        {thread.name}
                                    </h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{thread.time}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {thread.lastMessage}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Area - Active Chat */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
                    {/* Chat Header */}
                    <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>订单 #TRK-9824X 交付协作群</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                成员: {chatThreads[0].members.join(' • ')}
                            </p>
                        </div>
                        <button className="btn-secondary" style={{ padding: '0.5rem' }}><MoreHorizontal size={20} /></button>
                    </div>

                    {/* Chat Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            —— 订单已建群，各方已加入会话 ——
                        </div>

                        {messages.map(msg => (
                            <div key={msg.id} style={{ display: 'flex', flexDirection: msg.isMe ? 'row-reverse' : 'row', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: msg.isMe ? 'var(--accent)' : 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.isMe ? 'white' : 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                    {msg.sender.substring(0, 1)}
                                </div>
                                <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', marginLeft: msg.isMe ? 0 : '0.5rem', marginRight: msg.isMe ? '0.5rem' : 0 }}>
                                        {msg.sender} • {msg.time}
                                    </span>

                                    {msg.isImage ? (
                                        <img src={msg.imgUrl} alt="attachment" style={{ borderRadius: '12px', border: '2px solid var(--glass-border)', maxWidth: '250px' }} />
                                    ) : (
                                        <div style={{
                                            padding: '0.75rem 1.25rem',
                                            borderRadius: '16px',
                                            background: msg.isMe ? 'var(--accent)' : 'var(--glass-bg)',
                                            color: msg.isMe ? 'white' : 'var(--text-primary)',
                                            border: msg.isMe ? 'none' : '1px solid var(--glass-border)',
                                            borderTopLeftRadius: msg.isMe ? '16px' : '4px',
                                            borderTopRightRadius: msg.isMe ? '4px' : '16px'
                                        }}>
                                            {msg.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '0.5rem 1rem' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Paperclip size={20} /></button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><ImageIcon size={20} /></button>
                            <input
                                type="text"
                                placeholder="输入消息（支持发送图纸、OC设定）..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', padding: '0.5rem' }}
                            />
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Smile size={20} /></button>
                            <button
                                className="btn-primary"
                                style={{ padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                发送 <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
