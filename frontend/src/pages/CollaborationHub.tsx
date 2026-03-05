import { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Smile, MoreHorizontal, Users, X, Bell, BellOff, LogOut, Settings, RotateCcw, CheckSquare, Share, Square } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { useChat, type ChatMessage } from '../contexts/ChatContext';
import EmojiPicker from 'emoji-picker-react';

export default function CollaborationHub() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const dmCreator = searchParams.get('dmCreator');
    const { orders } = useOrders();
    const { chatHistory, addMessage, recallMessage, deleteMessage, clearHistory } = useChat();
    const navigate = useNavigate();

    // UI state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
    const [viewingCombinedRecord, setViewingCombinedRecord] = useState<ChatMessage | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // The user identity stays static for the mock view
    const currentUser = { id: 'u1', name: '我 (买家)', avatar: 'bg-blue-200' };

    const groupThreads = orders.map(order => {
        const activeMakers = order.steps
            .filter(s => s.maker && (s.status === 'active' || s.status === 'completed'))
            .map(s => s.maker);

        return {
            id: `c-${order.id}`,
            type: 'group',
            name: `${order.name} 交付协作群`,
            members: ['我 (买家)', ...Array.from(new Set(activeMakers))],
            lastMessage: '暂无新消息，可以开始跟神仙太太们沟通啦～',
            time: '',
            orderId: order.id
        };
    });

    const existingDMs = Object.keys(chatHistory)
        .filter(key => key.startsWith('dm-') && chatHistory[key].length > 0)
        .map(key => {
            const creatorName = key.replace('dm-', '');
            return {
                id: key,
                type: 'dm',
                name: creatorName,
                members: ['我 (买家)', creatorName],
                lastMessage: '查看历史消息',
                time: '',
                orderId: null
            };
        });

    let allThreads = [...existingDMs, ...groupThreads];

    if (dmCreator && !existingDMs.find(t => t.id === `dm-${dmCreator}`)) {
        allThreads.unshift({
            id: `dm-${dmCreator}`,
            type: 'dm',
            name: dmCreator,
            members: ['我 (买家)', dmCreator],
            lastMessage: `您已与 ${dmCreator} 建立私聊，请开始沟通。`,
            time: '刚刚',
            orderId: null
        });
    }

    const defaultActiveThreadId = dmCreator ? `dm-${dmCreator}` : (orderId ? `c-${orderId}` : (allThreads[0]?.id || ''));
    const [activeThreadId, setActiveThreadId] = useState(defaultActiveThreadId);

    const activeThread = allThreads.find(t => t.id === activeThreadId);
    const activeMessages = activeThreadId && chatHistory[activeThreadId] ? chatHistory[activeThreadId] : [];

    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (!inputText.trim() || !activeThreadId) return;

        const newMsg: ChatMessage = {
            id: `m-${Date.now()}`,
            sender: currentUser.name,
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        addMessage(activeThreadId, newMsg);
        setInputText('');
        setShowEmojiPicker(false);
    };

    const handleEmojiClick = (emojiObj: any) => {
        setInputText(prev => prev + emojiObj.emoji);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeThreadId) return;

        // Create a local blob URL for the image
        const imgUrl = URL.createObjectURL(file);

        const newMsg: ChatMessage = {
            id: `img-${Date.now()}`,
            sender: currentUser.name,
            text: '[图片]',
            isImage: true,
            imgUrl: imgUrl,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        addMessage(activeThreadId, newMsg);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleForwardMessages = (targetThreadId: string, mode: 'batch' | 'combine') => {
        if (selectedMessageIds.length === 0) return;

        const messagesToForward = activeMessages.filter(m => selectedMessageIds.includes(m.id));

        if (mode === 'batch') {
            messagesToForward.forEach(m => {
                const forwardedMsg: ChatMessage = {
                    ...m,
                    id: `fwd-${Date.now()}-${Math.random()}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: true,
                    text: m.text // Removed forwarding prefix
                };
                addMessage(targetThreadId, forwardedMsg);
            });
        } else {
            // Combined Forwarding
            const summary = messagesToForward.slice(0, 3).map(m => `${m.sender}: ${m.isImage ? '[图片]' : m.text}`).join('\n') + (messagesToForward.length > 3 ? '\n...' : '');
            const combinedMsg: ChatMessage = {
                id: `comb-${Date.now()}`,
                sender: currentUser.name,
                isCombined: true,
                combinedTitle: `${activeThread?.name || '群聊'}的聊天记录`,
                combinedSummary: summary,
                combinedMessages: messagesToForward, // Store original messages
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true,
                text: '[聊天记录]'
            };
            addMessage(targetThreadId, combinedMsg);
        }

        setIsSelectionMode(false);
        setSelectedMessageIds([]);
        setShowForwardModal(false);
    };

    const toggleMessageSelection = (id: string) => {
        setSelectedMessageIds(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    if (!activeThread) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h2>暂无关联的协作订单</h2>
                <p>只有当您拥有正在制作中的订单时，专属的协作群才会开启。</p>
            </div>
        );
    }

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
                        {allThreads.map(thread => {
                            const isActive = thread.id === activeThreadId;
                            const threadHistory = chatHistory[thread.id] || [];
                            const displayLastMessage = threadHistory.length > 0 ? threadHistory[threadHistory.length - 1].text : thread.lastMessage;

                            return (
                                <div key={thread.id}
                                    onClick={() => {
                                        setActiveThreadId(thread.id);
                                        setShowSettings(false);
                                    }}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--glass-border)',
                                        cursor: 'pointer',
                                        background: isActive ? 'var(--accent-light)' : 'transparent',
                                        borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h4 style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {thread.type === 'group' && <Users size={16} color="var(--accent)" />}
                                            {thread.name}
                                        </h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{thread.time}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {displayLastMessage}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Middle Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', position: 'relative' }}>
                    {/* Chat Header */}
                    <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                {activeThread.name}
                                {isMuted && <BellOff size={14} color="var(--text-secondary)" style={{ marginLeft: '0.5rem', display: 'inline-block' }} />}
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {activeThread.type === 'group' && (
                                    <span style={{ cursor: 'pointer' }} onClick={() => setShowSettings(!showSettings)}>
                                        {activeThread.members.length} 位成员
                                    </span>
                                )}
                                {activeThread.type === 'dm' && '一对一沟通中'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={() => {
                                setIsSelectionMode(!isSelectionMode);
                                setSelectedMessageIds([]);
                            }}>
                                <CheckSquare size={20} color={isSelectionMode ? 'var(--accent)' : 'var(--text-secondary)'} />
                            </button>
                            {activeThread.orderId && (
                                <button className="btn-secondary" onClick={() => navigate('/tracking')}>回到订单</button>
                            )}
                            <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setShowSettings(!showSettings)}>
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {activeThread.type === 'group' ? '—— 订单已建群，各方已加入会话 ——' : `—— 您已发起与 ${activeThread.name} 的私聊 ——`}
                        </div>

                        {activeMessages.map((msg: ChatMessage) => (
                            <div key={msg.id} className="chat-msg-container" style={{ display: 'flex', flexDirection: msg.isMe ? 'row-reverse' : 'row', gap: '1rem', position: 'relative', justifyContent: msg.recalled ? 'center' : 'flex-start', alignItems: 'flex-start' }}>
                                {isSelectionMode && !msg.recalled && (
                                    <div
                                        onClick={() => toggleMessageSelection(msg.id)}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            display: 'flex',
                                            alignSelf: 'center',
                                            color: selectedMessageIds.includes(msg.id) ? 'var(--accent)' : 'var(--text-secondary)'
                                        }}
                                    >
                                        {selectedMessageIds.includes(msg.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </div>
                                )}

                                {msg.recalled ? (
                                    <div style={{ padding: '0.25rem 1rem', background: 'var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.8rem', borderRadius: '12px', margin: '0.5rem 0' }}>
                                        {msg.isMe ? '您撤回了一条消息' : `${msg.sender} 撤回了一条消息`}
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ minWidth: '40px', width: '40px', height: '40px', borderRadius: '50%', background: msg.isMe ? 'var(--accent)' : 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.isMe ? 'white' : 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                            {msg.sender.substring(0, 1)}
                                        </div>
                                        <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start', position: 'relative' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', marginLeft: msg.isMe ? 0 : '0.5rem', marginRight: msg.isMe ? '0.5rem' : 0 }}>
                                                {msg.sender} • {msg.time}
                                            </span>

                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                {msg.recalled ? null : msg.isImage ? (
                                                    <img src={msg.imgUrl} alt="attachment" style={{ borderRadius: '12px', border: '2px solid var(--glass-border)', maxWidth: '250px', cursor: 'pointer' }} />
                                                ) : msg.isCombined ? (
                                                    <div
                                                        onClick={() => setViewingCombinedRecord(msg)}
                                                        style={{
                                                            padding: '1rem',
                                                            borderRadius: '8px',
                                                            background: 'var(--glass-bg)',
                                                            border: '1px solid var(--glass-border)',
                                                            width: '240px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                                                    >
                                                        <h5 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>{msg.combinedTitle}</h5>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                            {msg.combinedSummary}
                                                        </p>
                                                        <div style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '0.5rem' }}>聊天记录</div>
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        padding: '0.75rem 1.25rem',
                                                        borderRadius: '16px',
                                                        background: msg.isMe ? 'var(--accent)' : 'var(--glass-bg)',
                                                        color: msg.isMe ? 'white' : 'var(--text-primary)',
                                                        border: msg.isMe ? 'none' : '1px solid var(--glass-border)',
                                                        borderTopLeftRadius: msg.isMe ? '16px' : '4px',
                                                        borderTopRightRadius: msg.isMe ? '4px' : '16px',
                                                        wordBreak: 'break-word',
                                                        whiteSpace: 'pre-wrap'
                                                    }}>
                                                        {msg.text}
                                                    </div>
                                                )}

                                                {/* Action Buttons Container */}
                                                <div className="msg-actions" style={{
                                                    display: 'flex',
                                                    gap: '4px',
                                                    marginLeft: msg.isMe ? 0 : '0.5rem',
                                                    marginRight: msg.isMe ? '0.5rem' : 0,
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                    order: msg.isMe ? -1 : 1
                                                }}>
                                                    {msg.isMe && (
                                                        <button
                                                            onClick={() => recallMessage(activeThreadId, msg.id)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
                                                            title="撤回消息"
                                                        >
                                                            <RotateCcw size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteMessage(activeThreadId, msg.id)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
                                                        title="删除消息"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <style>{`
                                    .chat-msg-container:hover .msg-actions { opacity: 0.6 !important; }
                                    .msg-actions button:hover { opacity: 1 !important; color: #ef4444 !important; }
                                    .msg-actions button[title="撤回消息"]:hover { color: var(--accent) !important; }
                                `}</style>
                            </div>
                        ))}
                    </div>

                    {/* Message Selection Action Bar */}
                    {isSelectionMode && selectedMessageIds.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '0.75rem 2rem',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2rem',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            zIndex: 40
                        }}>
                            <span>已选择 {selectedMessageIds.length} 条消息</span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setShowForwardModal(true)}
                                    style={{ background: 'white', color: 'var(--accent)', border: 'none', padding: '0.4rem 1rem', borderRadius: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Share size={16} /> 转发
                                </button>
                                <button
                                    onClick={() => {
                                        selectedMessageIds.forEach(id => deleteMessage(activeThreadId, id));
                                        setSelectedMessageIds([]);
                                        setIsSelectionMode(false);
                                    }}
                                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '15px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    批量删除
                                </button>
                                <button
                                    onClick={() => {
                                        setIsSelectionMode(false);
                                        setSelectedMessageIds([]);
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Chat Input */}
                    <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', background: 'var(--glass-bg)', position: 'relative' }}>

                        {/* Emoji Picker Popup */}
                        {showEmojiPicker && (
                            <div style={{ position: 'absolute', bottom: '100%', right: '2rem', zIndex: 50, marginBottom: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '0.5rem 1rem' }}>
                            {/* Hidden Image Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <ImageIcon size={20} />
                            </button>

                            <input
                                type="text"
                                placeholder="输入消息（支持发送图纸、OC设定）..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSendMessage();
                                }}
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', padding: '0.5rem' }}
                            />

                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: showEmojiPicker ? 'var(--accent)' : 'var(--text-secondary)' }}
                            >
                                <Smile size={20} />
                            </button>

                            <button
                                onClick={handleSendMessage}
                                className="btn-primary"
                                style={{ padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                发送 <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Chat Settings (Slide out) */}
                {showSettings && (
                    <div style={{ width: '300px', borderLeft: '1px solid var(--glass-border)', background: 'var(--glass-bg)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>聊天设置</h3>
                            <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '2rem', fontWeight: 600, margin: '0 auto 1rem auto' }}>
                                    {activeThread.type === 'group' ? <Users size={40} /> : activeThread.name.substring(0, 1)}
                                </div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{activeThread.name}</h4>
                            </div>

                            {activeThread.type === 'group' && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h5 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                        会话成员 <span>{activeThread.members.length}</span>
                                    </h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {activeThread.members.map((member, i) => {
                                            if (!member) return null;
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                        {member.substring(0, 1)}
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{member}</span>
                                                    {i === 0 && <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '4px', marginLeft: 'auto' }}>群主</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button className="hover-bg-glass" onClick={() => setIsMuted(!isMuted)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Bell size={18} color="var(--text-secondary)" /> 消息免打扰
                                    </div>
                                    <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: isMuted ? 'var(--accent)' : 'var(--glass-border)', position: 'relative', transition: 'all 0.2s ease' }}>
                                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: isMuted ? '18px' : '2px', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                    </div>
                                </button>

                                <button className="hover-bg-glass" onClick={() => { clearHistory(activeThreadId); setShowSettings(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left' }}>
                                    <Settings size={18} color="var(--text-secondary)" /> 清空聊天记录
                                </button>

                                <button className="hover-bg-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', textAlign: 'left', marginTop: '1rem' }}>
                                    <LogOut size={18} color="#ef4444" /> 退出会话
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Forward Selection Modal */}
            {showForwardModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'var(--bg-color)',
                        width: '400px',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>选择转发目标</h3>
                            <button onClick={() => setShowForwardModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                            {allThreads.filter(t => t.id !== activeThreadId).map(thread => (
                                <div
                                    key={thread.id}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--glass-bg)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {thread.type === 'group' ? <Users size={16} color="var(--accent)" /> : thread.name.substring(0, 1)}
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{thread.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleForwardMessages(thread.id, 'combine')}
                                            className="btn-primary"
                                            style={{ flex: 1, padding: '0.55rem', borderRadius: '8px', fontSize: '0.85rem' }}
                                        >
                                            合并转发
                                        </button>
                                        <button
                                            onClick={() => handleForwardMessages(thread.id, 'batch')}
                                            className="btn-secondary"
                                            style={{ flex: 1, padding: '0.55rem', borderRadius: '8px', fontSize: '0.85rem' }}
                                        >
                                            逐条转发
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Combined Detail Modal */}
            {viewingCombinedRecord && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 110,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'var(--bg-color)',
                        width: '500px',
                        height: '70vh',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexShrink: 0 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{viewingCombinedRecord.combinedTitle}</h3>
                            <button onClick={() => setViewingCombinedRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                            {viewingCombinedRecord.combinedMessages?.map((msg, i) => (
                                <div key={i} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.sender}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{msg.time}</span>
                                    </div>
                                    <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {msg.isImage ? <img src={msg.imgUrl} alt="fwd" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '0.5rem', display: 'block' }} /> : msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
