import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Library } from "@/types";
import { getLibraries } from "@/lib/actions/library";

interface SidebarState {
  isCollapsed: boolean;
  diaryEntries: Library[];
  activeEntryId: string | null;
  toggleSidebar: () => void;
  setActiveEntry: (id: string) => void;
  fetchDiaryEntries: (id: string, token: string) => Promise<void>;
  loadingDiaries: boolean;
  setdiaries: (Diary: Library) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      diaryEntries: [],
      activeEntryId: null,

      toggleSidebar: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setActiveEntry: (id: string) => set({ activeEntryId: id }),
      loadingDiaries: false,

      fetchDiaryEntries: async (id, token) => {
        try {
          if (id && token) {
            console.log("Starting to fetch diary entries");
            set({ loadingDiaries: true });
            try {
              const diary = await getLibraries(id, token);
              set({ diaryEntries: diary });
            } catch (err) {
              console.error("Error in fetchDiaryEntries:", err);
            } finally {
              set({ loadingDiaries: false });
            }
          } else {
            console.log("Missing token or user ID for fetching diaries");
          }

          const { activeEntryId } = get();
          if (!activeEntryId && typeof window !== "undefined") {
            const pathname = window.location.pathname;
            const match = pathname.match(/\/([^:]+)/);
            if (match && match[1]) {
              set({ activeEntryId: match[1] });
            }
          }
        } catch (error) {
          console.error("Error fetching library entries:", error);
        }
      },
      setdiaries: (diary: Library) =>
        set((state) => ({ diaryEntries: [diary, ...state.diaryEntries] })),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        activeEntryId: state.activeEntryId,
      }),
    }
  )
);
