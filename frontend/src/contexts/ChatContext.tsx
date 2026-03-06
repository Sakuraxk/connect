/* @refresh reload */
import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of a single chat message
export interface ChatMessage {
    id: string;
    sender: string;
    text?: string;
    isImage?: boolean;
    imgUrl?: string;
    time: string;
    isMe: boolean;
    recalled?: boolean;
    isCombined?: boolean;
    combinedTitle?: string;
    combinedSummary?: string;
    combinedMessages?: ChatMessage[];
    type?: string;
}

// Map thread ID to its array of messages
export type ChatHistory = Record<string, ChatMessage[]>;

interface ChatContextType {
    chatHistory: ChatHistory;
    addMessage: (threadId: string, message: ChatMessage) => void;
    recallMessage: (threadId: string, messageId: string) => void;
    deleteMessage: (threadId: string, messageId: string) => void;
    clearHistory: (threadId: string) => void;
    closedThreads: string[];
    toggleThreadClosed: (threadId: string, closed: boolean) => void;
    openedThreads: string[];
    registerThread: (threadId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [chatHistory, setChatHistory] = useState<ChatHistory>({});

    const addMessage = (threadId: string, message: ChatMessage) => {
        setChatHistory(prev => {
            const currentMessages = prev[threadId] || [];
            return {
                ...prev,
                [threadId]: [...currentMessages, message]
            };
        });
    };

    const recallMessage = (threadId: string, messageId: string) => {
        setChatHistory(prev => {
            const currentMessages = prev[threadId] || [];
            return {
                ...prev,
                [threadId]: currentMessages.map(m =>
                    m.id === messageId ? { ...m, recalled: true, isImage: false, text: '' } : m
                )
            };
        });
    };

    const deleteMessage = (threadId: string, messageId: string) => {
        setChatHistory(prev => {
            const currentMessages = prev[threadId] || [];
            return {
                ...prev,
                [threadId]: currentMessages.filter(m => m.id !== messageId)
            };
        });
    };

    const clearHistory = (threadId: string) => {
        setChatHistory(prev => ({
            ...prev,
            [threadId]: []
        }));
    };

    const [closedThreads, setClosedThreads] = useState<string[]>([]);
    const [openedThreads, setOpenedThreads] = useState<string[]>([]);

    const toggleThreadClosed = (threadId: string, closed: boolean) => {
        setClosedThreads(prev =>
            closed ? [...new Set([...prev, threadId])] : prev.filter(id => id !== threadId)
        );
    };

    const registerThread = (threadId: string) => {
        if (!threadId) return;
        setOpenedThreads(prev => prev.includes(threadId) ? prev : [...prev, threadId]);
    };

    return (
        <ChatContext.Provider value={{ chatHistory, addMessage, recallMessage, deleteMessage, clearHistory, closedThreads, toggleThreadClosed, openedThreads, registerThread }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
