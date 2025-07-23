import { create } from "zustand";

interface NavigationState {
  isMobileMenuOpen: boolean;
  isUserMenuOpen: boolean;
  expandedItems: string[];
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  setUserMenuOpen: (isOpen: boolean) => void;
  toggleUserMenu: () => void;
  toggleExpandedItem: (itemId: string) => void;
  isItemExpanded: (itemId: string) => boolean;
  closeAllMenus: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  isMobileMenuOpen: false,
  isUserMenuOpen: false,
  expandedItems: ["data-analytics"], // Default expanded items

  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  toggleMobileMenu: () =>
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
      isUserMenuOpen: false, // Close user menu when toggling mobile menu
    })),

  setUserMenuOpen: (isOpen) => set({ isUserMenuOpen: isOpen }),

  toggleUserMenu: () =>
    set((state) => ({
      isUserMenuOpen: !state.isUserMenuOpen,
      isMobileMenuOpen: false, // Close mobile menu when toggling user menu
    })),

  toggleExpandedItem: (itemId) =>
    set((state) => {
      const isCurrentlyExpanded = state.expandedItems.includes(itemId);
      return {
        expandedItems: isCurrentlyExpanded
          ? state.expandedItems.filter((id) => id !== itemId)
          : [...state.expandedItems, itemId],
      };
    }),

  isItemExpanded: (itemId) => get().expandedItems.includes(itemId),

  closeAllMenus: () =>
    set({
      isMobileMenuOpen: false,
      isUserMenuOpen: false,
    }),
}));
