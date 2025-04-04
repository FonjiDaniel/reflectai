import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Library } from "@/types";
import { getDiaries } from "@/lib/actions/library";

interface SidebarState {
  isCollapsed: boolean;
  diaryEntries: Library[];
  activeEntryId: string | null;
  toggleSidebar: () => void;
  setActiveEntry: (id: string) => void;
  fetchDiaryEntries: (token: string) => Promise<void>;
  loadingDiaries: boolean;
  setDiaries: (Diary: Library) => void;
  updateDiariesOnDelete: (Diary: Library) => void;
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

      fetchDiaryEntries: async (token) => {
        try {
          if (token) {
            set({ loadingDiaries: true });
            try {
              const diary = await getDiaries(token);
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
      setDiaries: (diary: Library) =>
        set((state) => ({ diaryEntries: [diary, ...state.diaryEntries] })),
      updateDiariesOnDelete: (diaryToDelete: Library) =>
        set((state) => ({
          diaryEntries: state.diaryEntries.filter(
            (diary) => diary.id !== diaryToDelete.id
          ),
        })),
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
