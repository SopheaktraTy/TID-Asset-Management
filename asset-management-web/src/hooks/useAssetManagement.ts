import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { getAssetsApi } from "../services/asset.service";
import type { AssetDto } from "../types/asset.types";
import type { AssetStatus, DeviceType } from "../types/asset.types";

export function useAssetManagement() {
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
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

  // ── Auto-hide columns based on screen width ────────────────────────────────
  useEffect(() => {
    let timeoutId: any;

    const handleResize = () => {
      const width = window.innerWidth;
      setHiddenCols((prev) => {
        const next = new Set(prev);
        // Columns we manage automatically
        const autoCols = [
          "image",
          "serialNumber",
          "manufacturer",
          "deviceType",
          "specs",
          "latestUsed",
          "createdAt",
          "updatedAt",
        ];
        autoCols.forEach((k) => next.delete(k));

        if (width < 640) {
          // Extra small: hide almost everything
          [
            "image",
            "serialNumber",
            "manufacturer",
            "deviceType",
            "specs",
            "latestUsed",
            "createdAt",
            "updatedAt",
          ].forEach((k) => next.add(k));
        } else if (width < 768) {
          // Mobile: keep basic asset info & status
          [
            "serialNumber",
            "manufacturer",
            "deviceType",
            "specs",
            "latestUsed",
            "createdAt",
            "updatedAt",
          ].forEach((k) => next.add(k));
        } else if (width < 1024) {
          // Tablet: hide secondary hardware info
          ["serialNumber", "specs", "latestUsed", "createdAt", "updatedAt"].forEach((k) =>
            next.add(k)
          );
        } else if (width < 1280) {
          // Small laptop: hide timestamps & history
          ["latestUsed", "createdAt", "updatedAt"].forEach((k) => next.add(k));
        } else if (width < 1536) {
          // Regular desktop: hide timestamps
          ["createdAt", "updatedAt"].forEach((k) => next.add(k));
        }
        return next;
      });
    };

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    handleResize();
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAssetsApi({
        page,
        size: pageSize,
        search: debouncedSearch || undefined,
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
  }, [page, pageSize, debouncedSearch, statusFilter, deviceTypeFilter, sortBy, sortDir]);

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
