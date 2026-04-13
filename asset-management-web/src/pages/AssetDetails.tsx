import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/layout/Header";
import EditAssetModal from "../components/layout/asset/EditAssetModal";
import DeleteAssetModal from "../components/layout/asset/DeleteAssetModal";
import { useAssetDetails } from "../hooks/useAssetDetails";
import { AssetFullDetails } from "../components/layout/asset/AssetFullDetails";

export default function AssetDetailsPage() {
  const navigate = useNavigate();

  const {
    asset,
    loading,
    errorDetails,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    handleBack,
    handleDeleteSuccess,
    handleUpdateSuccess,
  } = useAssetDetails();

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm font-medium text-[var(--text-muted)] animate-pulse">Retrieving asset data...</span>
      </div>
    </div>
  );

  if (errorDetails || !asset) return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center text-[var(--text-main)] gap-4">
      <h2 className="text-2xl font-black text-red-500 tracking-tighter">ERROR 404</h2>
      <p className="text-[var(--text-muted)] font-medium max-w-md text-center">{errorDetails || "We couldn't locate the asset you're looking for."}</p>
      <button
        onClick={handleBack}
        className="mt-4 px-6 py-2 bg-[var(--surface-hover)] rounded-full hover:brightness-110 transition-all font-bold text-xs uppercase tracking-widest shadow-lg"
      >
        Return to Inventory
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Header & Breadcrumbs */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Asset</h1>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span onClick={() => navigate("/")} className="hover:text-[var(--text-main)] cursor-pointer transition-colors">Home</span>
              <span>›</span>
              <span onClick={() => navigate("/assets-management")} className="hover:text-[var(--text-main)] cursor-pointer transition-colors">Asset Management</span>
              <span>›</span>
              <span className="text-[var(--text-main)]">Asset details</span>
            </div>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-[var(--border-color)] text-sm text-[var(--text-main)] rounded-md hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Inventory
          </button>
        </div>

        <AssetFullDetails
          asset={asset}
          onEdit={() => setIsEditModalOpen(true)}
          onDelete={() => setIsDeleteModalOpen(true)}
          isDeleting={isDeleting}
        />

      </main>

      <EditAssetModal
        isOpen={isEditModalOpen}
        asset={asset}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={handleUpdateSuccess}
      />

      <DeleteAssetModal
        isOpen={isDeleteModalOpen}
        asset={asset}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleDeleteSuccess}
      />
    </div>
  );
}
