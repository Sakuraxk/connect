import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Using the identical structure from the Community page
export interface Post {
    id: number;
    author: string;
    avatar: string;
    content: string;
    image?: string;
    likes: number;
    time: string;
}

type StarContextType = {
    starredPosts: Post[];
    toggleStar: (post: Post) => void;
    isStarred: (postId: number) => boolean;
};

const StarContext = createContext<StarContextType | undefined>(undefined);

export function StarProvider({ children }: { children: ReactNode }) {
    const [starredPosts, setStarredPosts] = useState<Post[]>([]);

    const toggleStar = (post: Post) => {
        setStarredPosts(prev => {
            const exists = prev.find(p => p.id === post.id);
            if (exists) {
                // Remove if already starred
                return prev.filter(p => p.id !== post.id);
            } else {
                // Add to start of array
                return [post, ...prev];
            }
        });
    };

    const isStarred = (postId: number) => {
        return starredPosts.some(p => p.id === postId);
    };

    return (
        <StarContext.Provider value={{ starredPosts, toggleStar, isStarred }}>
            {children}
        </StarContext.Provider>
    );
}

export function useStars() {
    const context = useContext(StarContext);
    if (context === undefined) {
        throw new Error('useStars must be used within a StarProvider');
    }
    return context;
}
