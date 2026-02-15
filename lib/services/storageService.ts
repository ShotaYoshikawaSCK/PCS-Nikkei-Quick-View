import { database } from '../firebase';
import { ref, set, get, onValue, off } from 'firebase/database';
import { Comment } from '../types';

// Type definitions
export interface LikeData {
  count: number;
  liked: boolean;
}

export type LikesRecord = Record<string, LikeData>;
export type CommentsRecord = Record<string, Comment[]>;

/**
 * Storage service that provides a unified interface for storing likes and comments
 * Uses Firebase Realtime Database with localStorage fallback
 */
class StorageService {
  private useFirebase: boolean = true;

  constructor() {
    // Check if Firebase is properly configured
    try {
      if (typeof window !== 'undefined') {
        this.useFirebase = !!database;
      }
    } catch (error) {
      console.warn('Firebase not available, falling back to localStorage:', error);
      this.useFirebase = false;
    }
  }

  /**
   * Get likes from storage
   */
  async getLikes(): Promise<LikesRecord> {
    if (this.useFirebase) {
      try {
        const likesRef = ref(database, 'likes');
        const snapshot = await get(likesRef);
        return snapshot.val() || {};
      } catch (error) {
        console.error('Error fetching likes from Firebase:', error);
        // Fallback to localStorage
        return this.getLikesFromLocalStorage();
      }
    }
    return this.getLikesFromLocalStorage();
  }

  /**
   * Set likes in storage
   */
  async setLikes(likes: LikesRecord): Promise<void> {
    if (this.useFirebase) {
      try {
        const likesRef = ref(database, 'likes');
        await set(likesRef, likes);
        // Also save to localStorage as backup
        this.setLikesToLocalStorage(likes);
      } catch (error) {
        console.error('Error saving likes to Firebase:', error);
        // Fallback to localStorage
        this.setLikesToLocalStorage(likes);
      }
    } else {
      this.setLikesToLocalStorage(likes);
    }
  }

  /**
   * Subscribe to likes changes
   */
  subscribeLikes(callback: (likes: LikesRecord) => void): () => void {
    if (this.useFirebase) {
      try {
        const likesRef = ref(database, 'likes');
        const unsubscribe = onValue(likesRef, (snapshot) => {
          const likes = snapshot.val() || {};
          callback(likes);
        });
        return () => off(likesRef, 'value', unsubscribe);
      } catch (error) {
        console.error('Error subscribing to likes:', error);
      }
    }
    // No-op for localStorage
    return () => {};
  }

  /**
   * Get comments from storage
   */
  async getComments(): Promise<CommentsRecord> {
    if (this.useFirebase) {
      try {
        const commentsRef = ref(database, 'comments');
        const snapshot = await get(commentsRef);
        return snapshot.val() || {};
      } catch (error) {
        console.error('Error fetching comments from Firebase:', error);
        return this.getCommentsFromLocalStorage();
      }
    }
    return this.getCommentsFromLocalStorage();
  }

  /**
   * Set comments in storage
   */
  async setComments(comments: CommentsRecord): Promise<void> {
    if (this.useFirebase) {
      try {
        const commentsRef = ref(database, 'comments');
        await set(commentsRef, comments);
        // Also save to localStorage as backup
        this.setCommentsToLocalStorage(comments);
      } catch (error) {
        console.error('Error saving comments to Firebase:', error);
        this.setCommentsToLocalStorage(comments);
      }
    } else {
      this.setCommentsToLocalStorage(comments);
    }
  }

  /**
   * Subscribe to comments changes
   */
  subscribeComments(callback: (comments: CommentsRecord) => void): () => void {
    if (this.useFirebase) {
      try {
        const commentsRef = ref(database, 'comments');
        const unsubscribe = onValue(commentsRef, (snapshot) => {
          const comments = snapshot.val() || {};
          callback(comments);
        });
        return () => off(commentsRef, 'value', unsubscribe);
      } catch (error) {
        console.error('Error subscribing to comments:', error);
      }
    }
    return () => {};
  }

  /**
   * Get user name from localStorage
   */
  getUserName(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userName') || '匿名ユーザー';
    }
    return '匿名ユーザー';
  }

  /**
   * Set user name in localStorage
   */
  setUserName(userName: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', userName);
    }
  }

  // Private helper methods for localStorage
  private getLikesFromLocalStorage(): LikesRecord {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stockLikes');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  }

  private setLikesToLocalStorage(likes: LikesRecord): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockLikes', JSON.stringify(likes));
    }
  }

  private getCommentsFromLocalStorage(): CommentsRecord {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stockComments');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  }

  private setCommentsToLocalStorage(comments: CommentsRecord): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockComments', JSON.stringify(comments));
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
