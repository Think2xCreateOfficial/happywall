"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTabs, AdminTab } from "@/components/admin/AdminTabs";
import { CategoryList } from "@/components/admin/categories/CategoryList";
import { CategoryModal } from "@/components/admin/categories/CategoryModal";
import { PosterTable } from "@/components/admin/posters/PosterTable";
import { PosterDrawer } from "@/components/admin/posters/PosterDrawer";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ToastContainer, ToastMessage } from "@/components/admin/Toast";
import { CategoryRow, PosterWithCategory } from "@/types/database.types";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryInput,
} from "@/services/category.service";
import {
  getPosters,
  createPoster,
  updatePoster,
  deletePoster,
  PosterInput,
} from "@/services/poster.service";
import { getAdminSession } from "@/services/auth.service";
import { parseAppError } from "@/lib/errorHandler";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("posters");
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Categories state
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);

  // Posters state
  const [posters, setPosters] = useState<PosterWithCategory[]>([]);
  const [isPostersLoading, setIsPostersLoading] = useState(true);
  const [isPosterDrawerOpen, setIsPosterDrawerOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState<PosterWithCategory | null>(null);

  // Search & Filter state for Posters Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });
  const [isDialogLoading, setIsDialogLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data
  const loadData = useCallback(async () => {
    setIsCategoriesLoading(true);
    setIsPostersLoading(true);

    try {
      const [catResult, postResult, sessionResult] = await Promise.all([
        getCategories(true),
        getPosters({ includeInactive: true }),
        getAdminSession(),
      ]);

      if (sessionResult.user?.email) {
        setAdminEmail(sessionResult.user.email);
      }

      // If user is authenticated but not an admin, redirect out
      if (sessionResult.user && !sessionResult.isAdmin) {
        router.push("/admin/login?error=unauthorized");
        return;
      }

      if (catResult.error) {
        addToast(`Category notice: ${catResult.error}`, "info");
      }
      if (postResult.error) {
        addToast(`Poster notice: ${postResult.error}`, "info");
      }

      setCategories(catResult.data);
      setPosters(postResult.data);
    } catch (err: unknown) {
      addToast(parseAppError(err, "Failed to load dashboard data. Please refresh."), "error");
    } finally {
      setIsCategoriesLoading(false);
      setIsPostersLoading(false);
    }
  }, [addToast, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute live poster counts per category
  const posterCounts = useMemo(() => {
    const map: Record<string, number> = {};
    posters.forEach((p) => {
      map[p.category_id] = (map[p.category_id] || 0) + 1;
    });
    return map;
  }, [posters]);

  // Filter posters by search query and category
  const filteredPosters = useMemo(() => {
    return posters.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category_id === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (p.category?.name &&
          p.category.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchesCategory && matchesSearch;
    });
  }, [posters, selectedCategory, searchQuery]);

  // --- Category CRUD Handlers ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: CategoryRow) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (input: CategoryInput): Promise<boolean> => {
    if (editingCategory) {
      const result = await updateCategory(editingCategory.id, input);
      if (result.error) {
        addToast(result.error, "error");
        return false;
      }
      addToast(`Category "${input.name}" updated successfully.`);
    } else {
      const result = await createCategory(input);
      if (result.error) {
        addToast(result.error, "error");
        return false;
      }
      addToast(`Category "${input.name}" created successfully.`);
    }
    loadData();
    return true;
  };

  const handleDeleteCategory = (category: CategoryRow) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete category "${category.name}"?`,
      description:
        "This will permanently remove this category. Make sure no active posters are assigned to it before deleting.",
      onConfirm: async () => {
        setIsDialogLoading(true);
        const result = await deleteCategory(category.id);
        setIsDialogLoading(false);

        if (!result.success) {
          addToast(result.error || "Failed to delete category", "error");
        } else {
          addToast(`Category "${category.name}" deleted.`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          loadData();
        }
      },
    });
  };

  // --- Poster CRUD Handlers ---
  const handleOpenAddPoster = () => {
    setEditingPoster(null);
    setIsPosterDrawerOpen(true);
  };

  const handleOpenEditPoster = (poster: PosterWithCategory) => {
    setEditingPoster(poster);
    setIsPosterDrawerOpen(true);
  };

  const handleSavePoster = async (input: PosterInput): Promise<boolean> => {
    if (editingPoster) {
      const result = await updatePoster(editingPoster.id, input);
      if (result.error) {
        addToast(result.error, "error");
        return false;
      }
      addToast(`Poster "${input.title}" updated.`);
    } else {
      const result = await createPoster(input);
      if (result.error) {
        addToast(result.error, "error");
        return false;
      }
      addToast(`Poster "${input.title}" added to catalog.`);
    }
    loadData();
    return true;
  };

  const handleDeletePoster = (poster: PosterWithCategory) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete poster "${poster.title}"?`,
      description:
        "Are you sure you want to permanently delete this poster? This action cannot be undone.",
      onConfirm: async () => {
        setIsDialogLoading(true);
        const result = await deletePoster(poster.id, true);
        setIsDialogLoading(false);

        if (!result.success) {
          addToast(result.error || "Failed to delete poster", "error");
        } else {
          addToast(`Poster "${poster.title}" deleted.`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          loadData();
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-gray-900 selection:bg-[#F5B700] selection:text-gray-900 flex flex-col font-inter overflow-x-hidden">
      {/* Top Navigation Header */}
      <AdminHeader adminEmail={adminEmail} />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Dynamic Page Title & Subtitle per Tab */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight font-manrope">
            {activeTab === "posters" ? "Poster management" : "Category management"}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {activeTab === "posters"
              ? "Keep your collections up to date."
              : "Organize and curate your collection categories."}
          </p>
        </div>

        {/* Navigation Tabs */}
        <AdminTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content - Strict Separation */}
        <div className="mt-6 sm:mt-8">
          {activeTab === "posters" ? (
            /* Posters Tab: ONLY Poster Table with search and category filter. No Category Table. */
            <PosterTable
              posters={filteredPosters}
              totalCount={filteredPosters.length}
              categories={categories}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              isLoading={isPostersLoading}
              onAddPoster={handleOpenAddPoster}
              onEditPoster={handleOpenEditPoster}
              onDeletePoster={handleDeletePoster}
            />
          ) : (
            /* Categories Tab: ONLY Category List with display order and poster count. No Poster Table. */
            <CategoryList
              categories={categories}
              posterCounts={posterCounts}
              isLoading={isCategoriesLoading}
              onAddCategory={handleOpenAddCategory}
              onEditCategory={handleOpenEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}
        </div>
      </main>

      {/* Add / Edit Poster Drawer */}
      <PosterDrawer
        isOpen={isPosterDrawerOpen}
        poster={editingPoster}
        categories={categories}
        onClose={() => setIsPosterDrawerOpen(false)}
        onSave={handleSavePoster}
      />

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        isLoading={isDialogLoading}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
