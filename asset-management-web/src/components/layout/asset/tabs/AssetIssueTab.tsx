import React from "react";
import {
  AlertCircle,
  Settings,
  Activity,
  History,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  ArrowDownUp,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  Construction,
  Check
} from "lucide-react";
import Pagination from "../../../ui/Pagination";
import type { AssetDto } from "../../../../types/asset.types";
import type { IssueResponse } from "../../../../types/issue.types";
import { formatDateTime, toPascalCase } from "../../../../utils/format";

interface AssetIssueTabProps {
  asset: AssetDto;
  issues: IssueResponse[];
  loadingIssues: boolean;
  expandedIssue: number | null;
  setExpandedIssue: (id: number | null) => void;
  setIsReportModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setSelectedIssue: (issue: IssueResponse | null) => void;
  onUpdateStatus?: (issue: IssueResponse) => void;
}

const AssetIssueTab: React.FC<AssetIssueTabProps> = ({
  asset,
  issues,
  loadingIssues,
  expandedIssue,
  setExpandedIssue,
  setIsReportModalOpen,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setSelectedIssue,
  onUpdateStatus,
}) => {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc");

  const sortedIssues = React.useMemo(() => {
    return [...issues].sort((a, b) => {
      const dateA = new Date(a.reportedAt).getTime();
      const dateB = new Date(b.reportedAt).getTime();
      let diff = dateB - dateA;

      if (Number.isNaN(diff) || diff === 0) {
        diff = b.id - a.id;
      }

      return sortOrder === "desc" ? diff : -diff;
    });
  }, [issues, sortOrder]);

  const totalPages = Math.ceil(sortedIssues.length / pageSize);
  const currentIssues = sortedIssues.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "OPEN":
        return { icon: <AlertCircle size={14} />, color: "text-red-500", bg: "bg-red-500/10" };
      case "IN_PROGRESS":
        return { icon: <Clock size={14} />, color: "text-amber-500", bg: "bg-amber-500/10" };
      case "RESOLVED":
        return { icon: <CheckCircle2 size={14} />, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "CANT_RESOLVED":
        return { icon: <XCircle size={14} />, color: "text-gray-500", bg: "bg-gray-500/10" };
      default:
        return { icon: <Info size={14} />, color: "text-blue-500", bg: "bg-blue-500/10" };
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
      {/* Issues Timeline Frame */}
      <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col transition-colors duration-300 shadow-sm order-2 xl:order-1">
        <div className="px-6 py-4 border-b border-[var(--border-color)]/50 bg-[var(--bg)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Construction size={16} className="text-[var(--color-growth-green)]" />
              Maintenance Logs
            </h3>
            {!loadingIssues && issues.length > 0 && (
              <span className="text-[9px] font-black text-[var(--text-main)] bg-[var(--bg)] px-2.5 py-1 rounded-sm border border-[var(--border-color)]/40 uppercase tracking-widest">
                {issues.length} {issues.length === 1 ? 'Report' : 'Reports'}
              </span>
            )}
          </div>

          {!loadingIssues && issues.length > 1 && (
            <button
              onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-main)] bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)] transition-all active:scale-95"
            >
              <ArrowDownUp size={12} className="text-[var(--text-muted)]" />
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </button>
          )}
        </div>

        <div className="flex-1 px-6 pt-4 bg-gradient-to-b from-transparent to-[var(--surface-hover)]/5">
          {loadingIssues ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-10 h-10 border-[3px] border-[var(--color-growth-green)]/10 border-t-[var(--color-growth-green)] rounded-full animate-spin" />
              <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest animate-pulse">Loading logs...</span>
            </div>
          ) : issues.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-4 text-[var(--text-muted)]/40 border border-dashed border-[var(--border-color)]">
                <History size={32} />
              </div>
              <h4 className="text-[var(--text-main)] font-bold text-sm mb-1">Clear History</h4>
              <p className="text-[var(--text-muted)] text-[11px] max-w-[220px] leading-relaxed">No maintenance issues or concerns have been reported for this asset.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 mb-6">
              <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border-color)]/40">
                {currentIssues.map((issue) => {
                  const statusCfg = getStatusConfig(issue.issueStatus);
                  return (
                    <div key={issue.id} className="relative mb-6 last:mb-0">
                      <div className={`absolute -left-[27px] top-7 w-4 h-4 rounded-full border-2 bg-[var(--bg)] ${statusCfg.color === "text-emerald-500" ? "border-emerald-500" : "border-[var(--border-color)]"}`} />

                      <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--color-growth-green)]/30 group/item">
                        <div
                          className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${statusCfg.bg} ${statusCfg.color}`}>
                              {statusCfg.icon}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-[var(--text-main)] group-hover/item:text-[var(--color-growth-green)] transition-colors whitespace-nowrap truncate">{toPascalCase(issue.issueTitle)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] mt-0.5 text-[var(--text-muted)] whitespace-nowrap overflow-hidden">
                                <span className={`font-bold ${statusCfg.color}`}>
                                  {toPascalCase(issue.issueStatus)}
                                </span>
                                <span className="text-[var(--border-color)] text-[10px] shrink-0">|</span>
                                <span className="font-medium">
                                  Reported {formatDateTime(issue.reportedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-[var(--border-color)]/30">
                            <div className="flex items-center gap-1.5 ml-2">
                              {(issue.issueStatus === "RESOLVED" || issue.issueStatus === "CANT_RESOLVED") ? (
                                <>
                                  <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 border ${issue.issueStatus === "RESOLVED"
                                    ? "bg-emerald-500/10 border-emerald-500/20"
                                    : "bg-gray-500/10 border-gray-500/20"
                                    }`}>
                                    <span className={`text-[8px] font-bold whitespace-nowrap ${issue.issueStatus === "RESOLVED" ? "text-emerald-500" : "text-gray-500"
                                      }`}>
                                      {issue.issueStatus === "RESOLVED" ? "Resolved" : "Cannot Resolved"} {formatDateTime(issue.resolvedAt || issue.updatedAt)}
                                    </span>
                                  </div>
                                  <span className="w-px h-4 bg-[var(--border-color)]/60 mx-1" />
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUpdateStatus?.(issue);
                                    }}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                    title="Update Progress"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <span className="w-px h-4 bg-[var(--border-color)]/60 mx-1" />
                                </>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedIssue(issue);
                                  setIsEditModalOpen(true);
                                }}
                                className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                title="Update Status"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedIssue(issue);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete Report"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="ml-1 text-[var(--text-muted)]">
                              {expandedIssue === issue.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                          </div>
                        </div>

                        {expandedIssue === issue.id && (
                          <div className="p-4 px-6 relative before:absolute before:content-[''] before:top-0 before:left-4 before:right-4 before:h-px before:bg-[var(--border-color)] bg-[var(--bg)] animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col gap-2">
                              <span className="text-[12px] font-bold text-[var(--text-muted)] tracking-wider">Remark / History</span>
                              <div className="p-3 border border-dashed border-[var(--border-color)]/60 rounded-lg bg-[var(--surface-hover)]/20 mt-1">
                                <p className="text-xs text-[var(--text-main)] leading-relaxed whitespace-pre-wrap">
                                  {issue.remark || "No additional remarks provided."}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination
                page={page}
                pageSize={pageSize}
                totalElements={issues.length}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(0);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Container */}
      <div className="flex flex-col gap-6 order-1 xl:order-2">
        <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col gap-6 transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <span className="text-[var(--color-growth-green)]">
                <AlertCircle size={14} />
              </span>
              Issue Management
            </h3>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed -mt-4">
            Report concerns, track repairs, and manage the health of this asset.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full px-4 py-2 bg-[var(--color-growth-green)] hover:brightness-110 text-[var(--btn-primary-text)] rounded-lg transition-all font-bold text-xs shadow-lg shadow-[var(--btn-primary-shadow)] active:scale-95 flex items-center justify-center gap-2"
            >
              <AlertCircle size={14} />
              Report New Issue
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all duration-300 shadow-sm flex flex-col">
          <div className="px-6 pt-6">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 tracking-tight">
              <Settings size={14} className="text-[var(--color-growth-green)]" />
              Asset Health
            </h3>
          </div>

          <div className="pt-6 pb-8 px-8 space-y-5">
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                  Operational Status
                </span>
                <div className={`flex items-center gap-4 p-4 rounded-xl border border-dashed border-[var(--border-color)]/60 shadow-sm`}>
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm ${asset.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                    <Activity size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[var(--text-main)] truncate">
                      {toPascalCase(asset.status)}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {asset.status === "AVAILABLE" ? "Ready for deployment" : "Requires attention"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)]/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">Unresolved Issues</span>
                  <span className="text-[10px] font-bold text-red-500">{issues.filter(i => i.issueStatus !== "RESOLVED" && i.issueStatus !== "CANT_RESOLVED").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">Total History</span>
                  <span className="text-[10px] font-bold text-[var(--text-main)]">{issues.length} Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetIssueTab;
