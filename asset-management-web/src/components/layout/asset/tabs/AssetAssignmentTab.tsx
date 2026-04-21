import React from "react";
import { UserPlus, History, User, Calendar, AlertTriangle, Wrench, AlertOctagon, AlertCircle, Settings, HelpCircle, ChevronRight, ChevronDown, Info } from "lucide-react";
import type { AssetDto } from "../../../../types/asset.types";
import type { AssignmentResponse } from "../../../../types/assignment.types";
import { formatDate, getInitials, getAvatarColor } from "../../../../utils/format";

interface AssetAssignmentTabProps {
  asset: AssetDto;
  assignments: AssignmentResponse[];
  loadingAssignments: boolean;
  expandedAssignment: number | null;
  setExpandedAssignment: (id: number | null) => void;
  setIsAssignModalOpen: (open: boolean) => void;
  setIsStatusEditModalOpen: (open: boolean) => void;
  setIsReturnModalOpen: (open: boolean) => void;
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
  setSelectedAssignment,
}) => {

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
              className="px-4 py-2 bg-[var(--color-growth-green)] hover:brightness-110 text-[var(--btn-primary-text)] rounded-lg transition-all font-bold text-xs shadow-lg shadow-[var(--btn-primary-shadow)] active:scale-95 flex items-center gap-2"
            >
              <UserPlus size={14} />
              Assign Asset
            </button>
          ),
        };
      case "IN_USE":
        return {
          icon: <User size={20} />,
          iconClass: "bg-[#3b82f6]/10 text-[#3b82f6]",
          description: "Asset is currently assigned. Confirm a return below, or update the status.",
          action: (
            <button
              onClick={() => {
                const activeId = assignments.find(a => !a.returnedDate)?.id;
                if (activeId) setExpandedAssignment(activeId === expandedAssignment ? null : activeId);
              }}
              className="text-[11px] font-black px-4 py-2 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 uppercase tracking-wider cursor-pointer hover:bg-[#3b82f6]/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
              In Use
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
              className={`text-[10px] font-black px-4 py-2 rounded-lg ${cfg.bg} ${cfg.text} border ${cfg.border} uppercase tracking-widest hover:brightness-110 transition-all active:scale-95`}
            >
              Update Status
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
              className="text-[10px] font-black px-4 py-2 rounded-lg bg-[var(--text-muted)]/10 text-[var(--text-muted)] border border-[var(--border-color)] uppercase tracking-wider hover:bg-[var(--surface-hover)] transition-all active:scale-95"
            >
              Update
            </button>
          ),
        };
    }
  };

  const headerCfg = getAssignmentHeaderConfig(asset.status);

  return (
    <div className="space-y-6">
      {/* Dynamic Header Case */}
      <div className="flex justify-between items-center bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${headerCfg.iconClass}`}>
            {headerCfg.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">Assignment Management</h3>
            <p className="text-[11px] text-[var(--text-muted)]">{headerCfg.description}</p>
          </div>
        </div>
        {headerCfg.action}
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        {loadingAssignments ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs text-[var(--text-muted)] font-medium">Fetching history...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-[var(--bg)] border border-dashed border-[var(--border-color)] rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-4 text-[var(--text-muted)]">
              <History size={32} />
            </div>
            <h4 className="text-[var(--text-main)] font-bold text-sm mb-1">No Assignment History</h4>
            <p className="text-[var(--text-muted)] text-xs max-w-xs">This asset hasn't been assigned to anyone yet.</p>
          </div>
        ) : (
          <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border-color)]/40">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="relative mb-6 last:mb-0">
                <div className={`absolute -left-[27px] top-7 w-4 h-4 rounded-full border-2 ${assignment.returnedDate ? "bg-[var(--bg)] border-[var(--border-color)]" : "bg-[var(--color-growth-green)] border-[var(--color-growth-green)]/40 ring-4 ring-[var(--color-growth-green)]/10"}`} />

                <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div
                    className="p-4 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedAssignment(expandedAssignment === assignment.id ? null : assignment.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden text-[10px] font-bold ${getAvatarColor(assignment.employee?.username || 'Unknown')}`}>
                        {getInitials(assignment.employee?.username || 'Unknown')}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[var(--text-main)]">{assignment.employee?.username || 'Unknown'}</span>
                          <span className="text-[var(--border-color)] text-[10px]">|</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-medium">
                            {formatDate(assignment.assignedDate)}
                          </span>
                          {!assignment.returnedDate && (
                            <>
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[var(--color-growth-green)]/10 text-[var(--color-growth-green)] border border-[var(--color-growth-green)]/20 uppercase tracking-tighter shadow-sm shadow-[var(--color-growth-green)]/5">Current</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                          <span className="font-medium text-[var(--text-main)]">{assignment.employee?.jobTitle || 'N/A'}</span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                          <span className="text-[var(--text-muted)]">{assignment.employee?.department?.replace(/_/g, " ") || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {assignment.returnedDate && (
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Returned {formatDate(assignment.returnedDate)}
                        </span>
                      )}
                      {expandedAssignment === assignment.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>

                  {expandedAssignment === assignment.id && (
                    <div className="p-4 border-t border-[var(--border-color)] bg-[var(--surface-hover)]/30 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] font-bold ${getAvatarColor(assignment.assignedBy)}`}>
                              {getInitials(assignment.assignedByUser?.username || "System")}
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
                          {assignment.returnedDate ? (
                            <>
                              {assignment.confirmReturnBy && (
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] font-bold ${getAvatarColor(assignment.confirmReturnBy)}`}>
                                    {getInitials(assignment.confirmReturnByUser?.username || "System")}
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
                          ) : (
                            <div className="flex h-full items-end pb-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAssignment(assignment);
                                  setIsReturnModalOpen(true);
                                }}
                                className="w-full mt-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"
                              >
                                Confirm Return
                              </button>
                            </div>
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
        )}
      </div>
    </div>
  );
};

export default AssetAssignmentTab;
