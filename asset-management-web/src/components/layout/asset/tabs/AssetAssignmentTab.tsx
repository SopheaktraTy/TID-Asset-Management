import React from "react";
import { UserPlus, History, User, Calendar, AlertTriangle, Wrench, AlertOctagon, AlertCircle, Settings, HelpCircle, ChevronRight, ChevronDown, Info, Edit, Trash2, Activity } from "lucide-react";
import Pagination from "../../../ui/Pagination";
import type { AssetDto } from "../../../../types/asset.types";
import type { AssignmentResponse } from "../../../../types/assignment.types";
import { formatDate, getInitials, getAvatarColor, toPascalCase } from "../../../../utils/format";
import { getSafeImageUrl } from "../../../../utils/image";

interface AssetAssignmentTabProps {
  asset: AssetDto;
  assignments: AssignmentResponse[];
  loadingAssignments: boolean;
  expandedAssignment: number | null;
  setExpandedAssignment: (id: number | null) => void;
  setIsAssignModalOpen: (open: boolean) => void;
  setIsStatusEditModalOpen: (open: boolean) => void;
  setIsReturnModalOpen: (open: boolean) => void;
  setIsEditAssignmentModalOpen: (open: boolean) => void;
  setIsDeleteAssignmentModalOpen: (open: boolean) => void;
  setSelectedAssignment: (assignment: AssignmentResponse | null) => void;
}

const AssetAssignmentTab: React.FC<AssetAssignmentTabProps> = ({
  asset,
  assignments,
  loadingAssignments,
  expandedAssignment,
  setExpandedAssignment,
  setIsAssignModalOpen,
  setIsStatusEditModalOpen,
  setIsReturnModalOpen,
  setIsEditAssignmentModalOpen,
  setIsDeleteAssignmentModalOpen,
  setSelectedAssignment,
}) => {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);

  const totalPages = Math.ceil(assignments.length / pageSize);
  const currentAssignments = assignments.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  // Reset page when search/filter might change length
  React.useEffect(() => {
    if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1);
    }
  }, [assignments.length, totalPages, page]);

  const getAssignmentHeaderConfig = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return {
          icon: <UserPlus size={20} />,
          iconClass: "bg-[#10b981]/10 text-[#10b981]",
          description: "This asset is available. You can assign it to a team member.",
          action: (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="w-full px-4 py-2 bg-[var(--color-growth-green)] hover:brightness-110 text-[var(--btn-primary-text)] rounded-lg transition-all font-bold text-xs shadow-lg shadow-[var(--btn-primary-shadow)] active:scale-95 flex items-center justify-center gap-2"
            >
              <UserPlus size={14} />
              Assign Asset
            </button>
          ),
        };
      case "IN_USE":
        const activeAssignment = assignments.find((a) => !a.returnedDate);
        return {
          icon: <User size={20} />,
          iconClass: "bg-[#3b82f6]/10 text-[#3b82f6]",
          description: "Asset is currently assigned. You can confirm the return directly here.",
          action: (
            <button
              onClick={() => {
                if (activeAssignment) {
                  setSelectedAssignment(activeAssignment);
                  setIsReturnModalOpen(true);
                }
              }}
              className="w-full px-4 py-2 bg-[var(--color-growth-green)] hover:brightness-110 text-[var(--btn-primary-text)] rounded-lg transition-all font-bold text-xs shadow-lg shadow-[var(--btn-primary-shadow)] active:scale-95 flex items-center justify-center gap-2"
            >
              Confirm Return
            </button>
          ),
        };
      case "DAMAGED":
      case "UNDER_REPAIR":
      case "LOST":
      case "MALFUNCTION":
      case "MAINTENANCE":
        const colorConfig: Record<string, { icon: any, bg: string, text: string, border: string }> = {
          DAMAGED: { icon: <AlertTriangle size={20} />, bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
          UNDER_REPAIR: { icon: <Wrench size={20} />, bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
          LOST: { icon: <AlertOctagon size={20} />, bg: "bg-red-600/10", text: "text-red-600", border: "border-red-600/20" },
          MALFUNCTION: { icon: <AlertCircle size={20} />, bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
          MAINTENANCE: { icon: <Settings size={20} />, bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
        };
        const cfg = colorConfig[status] || { icon: <Info size={20} />, bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" };
        return {
          icon: cfg.icon,
          iconClass: `${cfg.bg} ${cfg.text}`,
          description: `Asset is currently marked as ${status.replace(/_/g, " ").toLowerCase()}. Assignment is unavailable.`,
          action: (
            <button
              onClick={() => setIsStatusEditModalOpen(true)}
              className={`w-full text-[10px] font-black px-4 py-2 rounded-lg ${cfg.bg} ${cfg.text} border ${cfg.border} uppercase tracking-widest hover:brightness-110 transition-all active:scale-95`}
            >
              Update Status ({toPascalCase(status)})
            </button>
          ),
        };
      default:
        return {
          icon: <HelpCircle size={20} />,
          iconClass: "bg-[var(--text-muted)]/10 text-[var(--text-muted)]",
          description: "Track assignment history and management details.",
          action: (
            <button
              onClick={() => setIsStatusEditModalOpen(true)}
              className="w-full text-[10px] font-black px-4 py-2 rounded-lg bg-[var(--text-muted)]/10 text-[var(--text-muted)] border border-[var(--border-color)] uppercase tracking-wider hover:bg-[var(--surface-hover)] transition-all active:scale-95"
            >
              Update Status ({toPascalCase(asset.status)})
            </button>
          ),
        };
    }
  };

  const headerCfg = getAssignmentHeaderConfig(asset.status);
  const latestAssignment = assignments.length > 0 ? assignments[0] : null;

  const getDeptShortcut = (dept: string | undefined) => {
    if (!dept) return "N/A";
    const cleanDept = dept.toUpperCase().replace(/[\s_]+/g, '_');
    const shortcuts: Record<string, string> = {
      INFORMATION_TECHNOLOGY: "IT",
      HUMAN_RESOURCES: "HR",
      SOFTWARE_DEVELOPMENT: "Dev",
      ADMINISTRATION: "Admin",
      FINANCE: "Fin",
      MARKETING: "Mkt",
      OPERATIONS: "Ops",
      SALES: "Sales",
      MANAGEMENT: "Mgmt",
      PRODUCTION: "Prod",
      LOGISTICS: "Log",
      MAINTENANCE: "Maint",
      ACCOUNTING: "Acc",
      CUSTOMER_SERVICE: "CS",
      QUALITY_ASSURANCE: "QA",
      RESEARCH_AND_DEVELOPMENT: "R&D",
      ENGINEERING: "Eng",
      PURCHASING: "Pur",
      INVENTORY: "Inv",
      WAREHOUSE: "Whse",
      DESIGN: "Des",
      SECURITY: "Sec",
    };
    
    if (shortcuts[cleanDept]) return shortcuts[cleanDept];
    
    // Auto-abbreviate multi-word departments if not in the map
    const words = dept.split(/[_\s]/).filter(w => w.length > 0);
    if (words.length > 1) {
      return words.map(w => w[0]).join('').toUpperCase();
    }
    
    return toPascalCase(dept);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 items-start">
      {/* Sidebar Container */}
      <div className="flex flex-col gap-6">
        {/* Dynamic Management Side Card */}
        <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col gap-6 transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <span className="text-[var(--color-growth-green)]">
                {React.cloneElement(headerCfg.icon as any, { size: 14 })}
              </span>
              Assignment Management
            </h3>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed -mt-4">
            {headerCfg.description}
          </p>

          <div className="space-y-4">
            {headerCfg.action}
          </div>
        </div>

        {/* Assignment Summary Card */}
        <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all duration-300 shadow-sm flex flex-col">
          <div className="px-6 pt-6">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 tracking-tight">
              <Activity size={14} className="text-[var(--color-growth-green)]" />
              Asset Insights
            </h3>
          </div>

          <div className="pt-6  pb-10 px-10 space-y-5">
            {latestAssignment ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">
                    {latestAssignment.returnedDate ? "Last possessed by" : "Currently held by"}
                  </span>
                  <div className="flex items-center gap-4 p-4 bg-[var(--bg)] border border-dashed border-[var(--border-color)]/60 rounded-xl shadow-sm">
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm overflow-hidden ${!latestAssignment.employee?.image ? getAvatarColor(latestAssignment.employee?.username || 'Unknown') : ''}`}>
                      {latestAssignment.employee?.image ? (
                        <img src={getSafeImageUrl(latestAssignment.employee.image)} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(latestAssignment.employee?.username || 'Unknown')
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[var(--text-main)] truncate">
                        {latestAssignment.employee?.username || 'Unknown'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-[var(--text-muted)] truncate">
                          {latestAssignment.employee?.jobTitle || 'Team Member'}
                        </span>
                        {latestAssignment.employee?.department && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[var(--border-color)] shrink-0" />
                            <span className="text-[10px] text-[var(--text-muted)] font-bold truncate">
                              {getDeptShortcut(latestAssignment.employee.department)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 px-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>Assigned date</span>
                    </div>
                    <span className="text-[11px] font-bold text-[var(--text-main)]">
                      {formatDate(latestAssignment.assignedDate)}
                    </span>
                  </div>

                  {latestAssignment.returnedDate ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Returned date</span>
                      </div>
                      <span className="text-[11px] font-bold text-[var(--text-main)]">
                        {formatDate(latestAssignment.returnedDate)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>Active possession</span>
                      </div>
                      <span className="text-[10px] font-black text-blue-500 tracking-wider">Not yet returned</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center bg-[var(--surface-hover)]/10 rounded-xl border border-dashed border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] font-bold">No assignment history</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Timeline Frame */}
      <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col transition-colors duration-300 shadow-sm">
        {/* Header for the Frame */}
        <div className="px-6 py-4 border-b border-[var(--border-color)]/50 bg-[var(--bg)] flex items-center justify-between shrink-0">
          <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Activity size={16} className="text-[var(--color-growth-green)]" />
            Assignment History
          </h3>
          {!loadingAssignments && assignments.length > 0 && (
            <span className="text-[9px] font-black text-[var(--text-main)] bg-[var(--surface-hover)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]/40 uppercase tracking-widest">
              {assignments.length} {assignments.length === 1 ? 'Record' : 'Records'}
            </span>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 px-6 pt-4 bg-gradient-to-b from-transparent to-[var(--surface-hover)]/5">
          {loadingAssignments ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative">
                <div className="w-10 h-10 border-[3px] border-[var(--color-growth-green)]/10 border-t-[var(--color-growth-green)] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[var(--color-growth-green)] rounded-full animate-pulse" />
                </div>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest animate-pulse">Syncing History...</span>
            </div>
          ) : assignments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-4 text-[var(--text-muted)]/40 border border-dashed border-[var(--border-color)]">
                <History size={32} />
              </div>
              <h4 className="text-[var(--text-main)] font-bold text-sm mb-1">No Activity Logs</h4>
              <p className="text-[var(--text-muted)] text-[11px] max-w-[220px] leading-relaxed">This asset hasn't been assigned or modified yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border-color)]/40">
                {currentAssignments.map((assignment) => (
                <div key={assignment.id} className="relative mb-6 last:mb-0">
                  <div className={`absolute -left-[27px] top-7 w-4 h-4 rounded-full border-2 ${assignment.returnedDate ? "bg-[var(--bg)] border-[var(--border-color)]" : "bg-[var(--color-growth-green)] border-[var(--color-growth-green)]/40 ring-4 ring-[var(--color-growth-green)]/10"}`} />

                  <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--color-growth-green)]/30 group/item">
                    <div
                      className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      onClick={() => setExpandedAssignment(expandedAssignment === assignment.id ? null : assignment.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] font-bold ${!assignment.employee?.image ? getAvatarColor(assignment.employee?.username || 'Unknown') : ''}`}>
                          {assignment.employee?.image ? (
                            <img src={getSafeImageUrl(assignment.employee.image)} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            getInitials(assignment.employee?.username || 'Unknown')
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-main)] group-hover/item:text-[var(--color-growth-green)] transition-colors whitespace-nowrap truncate">{assignment.employee?.username || 'Unknown'}</span>
                            <span className="text-[var(--border-color)] text-[10px] shrink-0">|</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-medium whitespace-nowrap shrink-0">
                              {formatDate(assignment.assignedDate)}
                            </span>
                            {!assignment.returnedDate && (
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[var(--color-growth-green)]/10 text-[var(--color-growth-green)] border border-[var(--color-growth-green)]/20 uppercase tracking-tighter shadow-sm shrink-0">Current</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] mt-0.5 text-[var(--text-muted)] whitespace-nowrap overflow-hidden">
                            <span className="font-medium text-[var(--text-main)] truncate">{assignment.employee?.jobTitle || 'N/A'}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--border-color)] shrink-0" />
                            <span className="truncate">{assignment.employee?.department?.replace(/_/g, " ") || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-[var(--border-color)]/30">
                        {assignment.returnedDate && (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                            Returned {formatDate(assignment.returnedDate)}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 ml-2 border-l border-[var(--border-color)] pl-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAssignment(assignment);
                              setIsEditAssignmentModalOpen(true);
                            }}
                            className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Edit Record"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAssignment(assignment);
                              setIsDeleteAssignmentModalOpen(true);
                            }}
                            className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="ml-1 text-[var(--text-muted)]">
                          {expandedAssignment === assignment.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      </div>
                    </div>

                    {expandedAssignment === assignment.id && (
                      <div className="p-4 relative before:absolute before:content-[''] before:top-0 before:left-4 before:right-4 before:h-px before:bg-[var(--border-color)] bg-[var(--bg)] animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] font-bold ${!assignment.assignedByUser?.image ? getAvatarColor(assignment.assignedByUser?.username || "System") : ''}`}>
                                {assignment.assignedByUser?.image ? (
                                  <img src={getSafeImageUrl(assignment.assignedByUser.image)} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  getInitials(assignment.assignedByUser?.username || "System")
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Assigned By</span>
                                <span className="text-[11px] font-semibold text-[var(--text-main)]">{assignment.assignedByUser?.username || "System"}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 pl-[4px]">
                              <Calendar size={14} className="text-purple-500" />
                              <div className="flex flex-col pl-[3px]">
                                <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Assignment Date</span>
                                <span className="text-[11px] font-semibold text-[var(--text-main)]">{formatDate(assignment.assignedDate)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {assignment.returnedDate && (
                              <>
                                {assignment.confirmReturnByUser && (
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] font-bold ${!assignment.confirmReturnByUser?.image ? getAvatarColor(assignment.confirmReturnByUser?.username || "System") : ''}`}>
                                      {assignment.confirmReturnByUser?.image ? (
                                        <img src={getSafeImageUrl(assignment.confirmReturnByUser.image)} alt="Avatar" className="w-full h-full object-cover" />
                                      ) : (
                                        getInitials(assignment.confirmReturnByUser?.username || "System")
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Confirmed By</span>
                                      <span className="text-[11px] font-semibold text-[var(--text-main)]">{assignment.confirmReturnByUser?.username || "System"}</span>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center gap-3 pl-[4px]">
                                  <Calendar size={14} className="text-rose-500" />
                                  <div className="flex flex-col pl-[3px]">
                                    <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Return Date</span>
                                    <span className="text-[11px] font-semibold text-[var(--text-main)]">{formatDate(assignment.returnedDate)}</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {assignment.returnCondition && (
                          <div className="mt-4 p-3 bg-[var(--bg)] border border-[var(--border-color)] rounded-lg">
                            <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter block mb-1">Return Condition</span>
                            <p className="text-[11px] text-[var(--text-main)]">{assignment.returnCondition}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className=" ">
              <Pagination
                page={page}
                pageSize={pageSize}
                totalElements={assignments.length}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(0);
                }}
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AssetAssignmentTab;
