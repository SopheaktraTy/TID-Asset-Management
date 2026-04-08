import { useState, useEffect, useCallback } from "react";
import { getAssetsApi } from "../services/asset.service";
import type { AssetDto } from "../types/asset.types";
import type { AssetStatus, DeviceType } from "../types/asset.types";

export function useAssetManagement() {
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "">("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceType | "">("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<AssetDto | null>(null);

  // Table columns
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());

  const handleToggleColumn = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ── Auto-hide columns based on screen width on mount ──────────────────────
  useEffect(() => {
    const width = window.innerWidth;
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (width < 768) {
        ["manufacturer", "specs", "createdAt", "updatedAt"].forEach((k) =>
          next.add(k)
        );
      } else if (width < 1024) {
        ["specs", "createdAt", "updatedAt"].forEach((k) => next.add(k));
      }
      return next;
    });
  }, []);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAssetsApi({
        page,
        size: pageSize,
        search: search || undefined,
        status: statusFilter || undefined,
        deviceType: deviceTypeFilter || undefined,
        sortBy,
        sortDir,
      });
      setAssets(result.content || []);
      setTotalElements(result.totalElements || 0);
      setTotalPages(result.totalPages || 1);
    } catch {
      setAssets([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, deviceTypeFilter, sortBy, sortDir]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSort = (field: string, dir?: "asc" | "desc") => {
    if (dir) {
      setSortBy(field);
      setSortDir(dir);
    } else if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  return {
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
  };
}
