// stores/sidebarStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LibraryEntry } from '@/types';

interface SidebarState {
  isCollapsed: boolean;
  isLoading: boolean;
  libraryEntries: LibraryEntry[];
  activeEntryId: string | null;
  toggleSidebar: () => void;
  setActiveEntry: (id: string) => void;
  fetchLibraryEntries: () => Promise<void>;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      isLoading: true,
      libraryEntries: [],
      activeEntryId: null,
      
      toggleSidebar: () => set(state => ({ isCollapsed: !state.isCollapsed })),
      
      setActiveEntry: (id: string) => set({ activeEntryId: id }),
      
      fetchLibraryEntries: async () => {
        set({ isLoading: true });
        
        try {
          // Simulate API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock data - replace with your actual API call
          const entries: LibraryEntry[] = [
            { id: '1', title: 'Fiction Books', icon: null },
            { id: '2', title: 'Non-Fiction Collection', icon: null },
            { id: '3', title: 'Research Papers', icon: null },
            { id: '4', title: 'Textbooks', icon: null },
            { id: '5', title: 'Magazines', icon: null },
          ];
          
          set({ libraryEntries: entries, isLoading: false });
          
          // Set active entry from URL if none is selected
          const { activeEntryId } = get();
          if (!activeEntryId && typeof window !== 'undefined') {
            const pathname = window.location.pathname;
            const match = pathname.match(/\/([^:]+)/);
            if (match && match[1]) {
              set({ activeEntryId: match[1] });
            }
          }
        } catch (error) {
          console.error('Error fetching library entries:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'sidebar-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        isCollapsed: state.isCollapsed, 
        activeEntryId: state.activeEntryId 
      }), // only persist these fields
    }
  )
);