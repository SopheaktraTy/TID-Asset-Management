import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HardDrive, ChevronRight as ArrowRight } from "lucide-react";
import AssetToolbar from "../components/layout/asset/AssetToolbar";
import AssetTable, { ASSET_TABLE_COLUMN_OPTIONS } from "../components/layout/asset/AssetTable";
import AddAssetModal from "../components/layout/asset/AddAssetModal";
import EditAssetModal from "../components/layout/asset/EditAssetModal";
import DeleteAssetModal from "../components/layout/asset/DeleteAssetModal";
import Pagination from "../components/ui/Pagination";
import { useAssetManagement } from "../hooks/useAssetManagement";

export default function AssetManagementPage() {
  const navigate = useNavigate();
  const [deleteAsset, setDeleteAsset] = useState<any>(null);
  const {
    assets,
    setAssets,
    loading,
    search,
    statusFilter,
    setStatusFilter,
    deviceTypeFilter,
    setDeviceTypeFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    sortDir,
    totalElements,
    totalPages,
    addOpen,
    setAddOpen,
    editAsset,
    setEditAsset,
    handleSort,
    handleSearch,
    hiddenCols,
    setHiddenCols,
    handleToggleColumn,
  } = useAssetManagement();

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* ── Page Title ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Assets</h1>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <HardDrive size={13} />
              <span>Assets</span>
              <ArrowRight size={12} />
              <span className="text-[var(--text-main)] font-medium">Asset Management</span>
            </div>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-[var(--bg)] rounded-xl border border-[var(--border-color)] shadow-xl overflow-hidden transition-colors duration-300">
          <AssetToolbar
            search={search}
            onSearchChange={handleSearch}
            statusFilter={statusFilter}
            onStatusChange={(val) => { setStatusFilter(val as any); setPage(0); }}
            deviceTypeFilter={deviceTypeFilter}
            onDeviceTypeChange={(val) => { setDeviceTypeFilter(val as any); setPage(0); }}
            onAddClick={() => setAddOpen(true)}
            hiddenCols={hiddenCols}
            onToggleColumn={handleToggleColumn}
            onSetHiddenCols={setHiddenCols}
            columnOptions={ASSET_TABLE_COLUMN_OPTIONS}
          />

          <AssetTable
            assets={assets}
            loading={loading}
            pageSize={pageSize}
            sortBy={sortBy}
            sortDir={sortDir}
            hiddenCols={hiddenCols}
            onSort={handleSort}
            onRowClick={(asset) => navigate(`/asset-detail/${asset.id}`)}
            onEdit={setEditAsset}
            onDelete={setDeleteAsset}
            menuClassName="bg-[var(--bg)]"
          />

          <Pagination
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size: number) => { setPageSize(size); setPage(0); }}
            panelClassName="bg-[var(--bg)]"
          />
        </div>
      </main>

      {/* ── Modals ── */}
      <AddAssetModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={(newAsset) => {
          setAddOpen(false);
          setAssets((prev) => [newAsset, ...prev]);
        }}
      />

      <EditAssetModal
        isOpen={!!editAsset}
        asset={editAsset}
        onClose={() => setEditAsset(null)}
        onUpdated={(updated) => {
          setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          setEditAsset(null);
        }}
      />

      <DeleteAssetModal
        isOpen={!!deleteAsset}
        asset={deleteAsset}
        onClose={() => setDeleteAsset(null)}
        onDeleted={(assetId) => {
          setAssets((prev) => prev.filter((a) => a.id !== assetId));
          setDeleteAsset(null);
        }}
      />
    </div>
  );
}
