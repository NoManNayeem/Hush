// Storage abstraction layer for Hush platform
// Default implementation uses localStorage, with hooks for future remote sync

export interface Bookmark {
  storyId: string;
  title: string;
  slug: string;
  cover: string;
  dateAdded: string;
}

export interface Reaction {
  liked: boolean;
  reactions: Record<string, number>;
}

export interface ReadingProgress {
  storyId: string;
  blockIndex: number;
  scroll: number;
  timestamp: string;
}

// Storage keys
const STORAGE_KEYS = {
  BOOKMARKS: 'hush:bookmarks',
  REACTIONS: 'hush:reactions',
  READING_PROGRESS: 'hush:lastSeen',
  ONBOARDING: 'hush:seenOnboarding',
} as const;

// Bookmark functions
export async function getBookmarks(): Promise<Bookmark[]> {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
}

export async function addBookmark(story: {
  id: string;
  title: string;
  coverImage: string;
}): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const bookmarks = await getBookmarks();
    const newBookmark: Bookmark = {
      storyId: story.id,
      title: story.title,
      slug: story.id,
      cover: story.coverImage,
      dateAdded: new Date().toISOString(),
    };
    
    // Check if already bookmarked
    const exists = bookmarks.some(b => b.storyId === story.id);
    if (!exists) {
      bookmarks.push(newBookmark);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
  }
}

export async function removeBookmark(storyId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const bookmarks = await getBookmarks();
    const filtered = bookmarks.filter(b => b.storyId !== storyId);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing bookmark:', error);
  }
}

export async function isBookmarked(storyId: string): Promise<boolean> {
  const bookmarks = await getBookmarks();
  return bookmarks.some(b => b.storyId === storyId);
}

// Reaction functions
export async function getReactionsFor(storyId: string): Promise<Reaction> {
  if (typeof window === 'undefined') return { liked: false, reactions: {} };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REACTIONS);
    const allReactions = stored ? JSON.parse(stored) : {};
    return allReactions[storyId] || { liked: false, reactions: {} };
  } catch (error) {
    console.error('Error loading reactions:', error);
    return { liked: false, reactions: {} };
  }
}

export async function setReaction(storyId: string, reaction: Reaction): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REACTIONS);
    const allReactions = stored ? JSON.parse(stored) : {};
    allReactions[storyId] = reaction;
    localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(allReactions));
  } catch (error) {
    console.error('Error saving reaction:', error);
  }
}

export async function addReaction(storyId: string, emoji: string): Promise<void> {
  const current = await getReactionsFor(storyId);
  const newReactions = { ...current.reactions };
  newReactions[emoji] = (newReactions[emoji] || 0) + 1;
  
  await setReaction(storyId, {
    ...current,
    reactions: newReactions,
  });
}

export async function toggleLike(storyId: string): Promise<boolean> {
  const current = await getReactionsFor(storyId);
  const newLiked = !current.liked;
  
  await setReaction(storyId, {
    ...current,
    liked: newLiked,
  });
  
  return newLiked;
}

// Reading progress functions
export async function saveReadingProgress(progress: ReadingProgress): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving reading progress:', error);
  }
}

export async function loadReadingProgress(storyId: string): Promise<ReadingProgress | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
    if (!stored) return null;
    
    const progress: ReadingProgress = JSON.parse(stored);
    return progress.storyId === storyId ? progress : null;
  } catch (error) {
    console.error('Error loading reading progress:', error);
    return null;
  }
}

// Onboarding functions
export async function checkOnboardingStatus(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
    return stored === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
}

// Utility function to clear all data (for testing)
export async function clearAllData(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
