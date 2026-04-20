import React, { useState, useEffect } from "react";
import { HardDrive, Monitor, Cpu, Terminal, Package, Calendar, Clock, Info, UserPlus, History, ChevronRight, ChevronDown, User, MapPin, ClipboardCheck } from "lucide-react";
import { getAssetAssignmentsApi } from "../../../services/assignment.service";
import type { AssignmentResponse } from "../../../types/assignment.types";
import { formatDateTime, getInitials, getAvatarColor } from "../../../utils/format";
import { getSafeImageUrl } from "../../../utils/image";
import type { AssetDto } from "../../../types/asset.types";
import AssignAssetModal from "./AssignAssetModal";
import ReturnAssetModal from "./ReturnAssetModal";

interface AssetFullDetailsProps {
  asset: AssetDto;
  onEdit: () => void;
  onDelete: () => void;
  onAssetUpdate?: (updated: AssetDto) => void;
  isDeleting?: boolean;
}

export const AssetFullDetails: React.FC<AssetFullDetailsProps> = ({
  asset,
  onEdit,
  onDelete,
  onAssetUpdate,
  isDeleting = false,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "assignment">("details");
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState<number | null>(null);

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentResponse | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const data = await getAssetAssignmentsApi(asset.id);
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    if (activeTab === "assignment") {
      fetchAssignments();
    }
  }, [activeTab, asset.id]);

  const handleAssignmentSuccess = (_newAssignment: AssignmentResponse) => {
    fetchAssignments();
    // We should ideally update the asset status too. 
    // Since we don't have the full updated asset here, we call the parent's update handler.
    if (onAssetUpdate) {
      // Fallback: manually update status if parent doesn't handle everything
      const updatedAsset = { ...asset, status: "IN_USE" as const };
      onAssetUpdate(updatedAsset);
    }
  };

  const handleReturnSuccess = (_updatedAssignment: AssignmentResponse) => {
    fetchAssignments();
    if (onAssetUpdate) {
      const updatedAsset = { ...asset, status: "AVAILABLE" as const };
      onAssetUpdate(updatedAsset);
    }
  };

  const isComputer = asset.deviceType === "LAPTOP" || asset.deviceType === "DESKTOP";
  const isMonitor =
    asset.deviceType === "PORTABLE_MONITOR" || asset.deviceType === "STAND_MONITOR";

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-500/10 text-emerald-600";
      case "IN_USE":
        return "bg-blue-500/10 text-blue-600";
      case "MAINTENANCE":
      case "UNDER_REPAIR":
        return "bg-orange-500/10 text-orange-600";
      case "DAMAGED":
      case "MALFUNCTION":
      case "LOST":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  /** A premium visual representing a monitor with a diagonal size arrow */
  const ScreenSizeGraphic = ({ size }: { size: string | number }) => (
    <div className="relative shrink-0 flex flex-col items-center py-2 group/monitor">
      {/* Monitor Outer Frame */}
      <div className="relative w-32 h-20 bg-[#1e1f29] border-[3px] border-[#3f4050] rounded-[4px] shadow-2xl flex items-center justify-center p-[2px]">
        {/* Inner Screen */}
        <div className="relative w-full h-full bg-[#0a0b10] overflow-hidden">
          {/* Diagonal Measurement Visual - Precision corner-to-corner line */}
          <div className="absolute inset-0">
            <svg className="w-full h-full p-1" viewBox="0 0 100 60" preserveAspectRatio="none">
              <line x1="0" y1="60" x2="100" y2="0" stroke="#ef4444" strokeWidth="3" opacity="0.9" />
            </svg>

            {/* Centered label along the line - background box masks the line for better legibility */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-[#0a0b10] px-2 py-0.5 rotate-[-31deg]">
                <span className="text-[10px] font-black text-red-500 whitespace-nowrap uppercase tracking-widest leading-none">
                  {size} Inch
                </span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-20 pointer-events-none" />
        </div>
      </div>

      {/* Stand Neck */}
      <div className="w-4 h-4 bg-[#3f4050] -mt-px shadow-sm" />
      {/* Curved Base */}
      <div className="w-20 h-1.5 bg-[#2d2e3a] rounded-t-xl shadow-inner relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      </div>
    </div>
  );

  /** Labelled row with subtle divider */
  const InfoRow = ({
    label,
    value,
    mono = false,
  }: {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
  }) => (
    <div className="grid grid-cols-[150px_1fr] items-start py-2 border-b border-[var(--border-color)]/40 last:border-0">
      <span className="text-[var(--text-muted)] text-[11px] font-medium pt-0.5">{label}</span>
      <span className={`text-[var(--text-main)] text-[11px] font-semibold ${mono ? "font-mono" : ""}`}>
        {value ?? "N/A"}
      </span>
    </div>
  );

  /** Icon + label + value tile used in hardware specs */
  const SpecTile = ({
    icon,
    label,
    value,
    accent = "emerald",
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent?: "emerald" | "blue" | "purple" | "orange";
  }) => {
    const accentMap = {
      emerald: "group-hover:bg-emerald-500/10 group-hover:text-emerald-500",
      blue: "group-hover:bg-blue-500/10 group-hover:text-blue-500",
      purple: "group-hover:bg-purple-500/10 group-hover:text-purple-500",
      orange: "group-hover:bg-orange-500/10 group-hover:text-orange-500",
    };
    return (
      <div className="flex items-center gap-3 group border border-dashed border-[var(--border-color)] rounded-xl p-3">
        <div
          className={`w-7 h-7 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center shrink-0 transition-colors shadow-sm ${accentMap[accent]}`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-tighter">
            {label}
          </span>
          <span className="text-xs font-semibold text-[var(--text-main)]">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Asset Header ── */}
      <div className="flex items-center gap-6">
        <div
          className={`rounded-2xl bg-[#1a1b23] flex items-center justify-center overflow-hidden shrink-0 shadow-lg border border-[var(--border-color)] ${asset.image ? "w-48 h-32" : "w-24 h-24"
            }`}
        >
          {asset.image ? (
            <img
              src={getSafeImageUrl(asset.image)}
              alt={asset.deviceName}
              className="w-full h-full object-cover"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
          ) : (
            <HardDrive size={32} className="text-[var(--text-muted)]" />
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center gap-8">
            {/* Identity */}
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] truncate opacity-80">
                {asset.assetTag}
              </span>
              <h2 className="text-2xl font-black text-[var(--text-main)] truncate leading-tight tracking-tight uppercase">
                {asset.deviceName}
              </h2>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 opacity-90">
                  <span className="text-[11px] font-black text-[var(--color-growth-green)]">#</span>
                  <p className="text-[14px] font-mono font-bold text-[var(--text-main)] tracking-tight">
                    {asset.serialNumber || "NO SERIAL"}
                  </p>
                </div>
                <span className="text-[var(--text-muted)] opacity-30">•</span>
                <span
                  className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-[0.1em] shadow-sm ${getStatusStyle(asset.status)}`}
                >
                  {asset.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-6 border-b border-[var(--border-color)]">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all font-medium text-xs ${activeTab === "details"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
        >
          <Package size={16} />
          Details &amp; Specifications
        </button>
        <button
          onClick={() => setActiveTab("assignment")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all font-medium text-xs ${activeTab === "assignment"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
        >
          <History size={16} />
          Assignment &amp; History
        </button>
      </div>

      {activeTab === "details" ? (
        <>
          {/* ── Details Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ════ Main column ════ */}
            <div className="lg:col-span-2 space-y-6">

              {/* General Information — all device types */}
              <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300">
                <h3 className="text-sm font-bold mb-5 text-[var(--text-main)] flex items-center gap-2">
                  <Terminal size={16} className="text-blue-500" />
                  General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                  <div>
                    <InfoRow label="Asset Tag" value={asset.assetTag} mono />
                    <InfoRow label="Serial Number" value={asset.serialNumber} mono />
                    <InfoRow label="Device Type" value={asset.deviceType.replace(/_/g, " ")} />
                    <InfoRow label="Manufacturer" value={asset.manufacturer} />
                  </div>
                  <div>
                    <InfoRow label="Model" value={asset.model} />
                    <InfoRow
                      label="Status"
                      value={
                        <span
                          className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-[0.1em] ${getStatusStyle(asset.status)}`}
                        >
                          {asset.status.replace(/_/g, " ")}
                        </span>
                      }
                    />
                    <InfoRow label="Condition" value={asset.condition} />
                  </div>
                </div>
              </div>

              {/* ── LAPTOP / DESKTOP: Hardware & OS Specifications ── */}
              {isComputer && (
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Hardware Specifications */}
                  <div className="flex-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300">
                    <h3 className="text-sm font-bold mb-6 text-[var(--text-main)] flex items-center gap-2">
                      <Cpu size={16} className="text-emerald-500" />
                      Hardware Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <SpecTile
                        icon={<Cpu size={15} className="transition-colors" />}
                        label="Processor"
                        value={asset.cpu || "N/A"}
                        accent="emerald"
                      />
                      <SpecTile
                        icon={<Terminal size={15} className="transition-colors" />}
                        label="RAM"
                        value={asset.ramGb ? `${asset.ramGb} GB` : "N/A"}
                        accent="blue"
                      />
                      <SpecTile
                        icon={<HardDrive size={15} className="transition-colors" />}
                        label="Storage Size"
                        value={asset.storageSizeGb ? `${asset.storageSizeGb} GB` : "N/A"}
                        accent="purple"
                      />
                      <SpecTile
                        icon={<HardDrive size={15} className="transition-colors" />}
                        label="Disk Type"
                        value={asset.diskType || "N/A"}
                        accent="orange"
                      />
                      {asset.diskModel && (
                        <SpecTile
                          icon={<HardDrive size={15} className="transition-colors" />}
                          label="Disk Model"
                          value={asset.diskModel}
                          accent="emerald"
                        />
                      )}
                      {asset.screenSizeInch && (
                        <SpecTile
                          icon={<Monitor size={15} className="transition-colors" />}
                          label="Built-in Display"
                          value={`${asset.screenSizeInch}" Screen`}
                          accent="blue"
                        />
                      )}
                    </div>
                  </div>

                  {/* Operating System & Security */}
                  <div className="flex-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300">
                    <h3 className="text-sm font-bold mb-5 text-[var(--text-main)] flex items-center gap-2">
                      <Monitor size={16} className="text-purple-500" />
                      Operating System &amp; Security
                    </h3>
                    <div className="flex flex-col gap-0">
                      <InfoRow label="Operating System" value={asset.operatingSystem} />
                      <InfoRow label="OS Version" value={asset.osVersion} />
                      <InfoRow
                        label="Domain Joined"
                        value={
                          asset.domainJoined == null ? (
                            "N/A"
                          ) : asset.domainJoined ? (
                            <span className="text-emerald-500 font-bold">Yes</span>
                          ) : (
                            <span className="text-red-400 font-bold">No</span>
                          )
                        }
                      />
                      <InfoRow
                        label="Last Security Check"
                        value={
                          asset.lastSecurityCheck
                            ? formatDateTime(asset.lastSecurityCheck)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── PORTABLE_MONITOR / STAND_MONITOR: Display Specifications ── */}
              {isMonitor && (
                <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 transition-colors duration-300">
                  <h3 className="text-sm font-bold mb-6 text-[var(--text-main)] flex items-center gap-2">
                    <Monitor size={16} className="text-blue-500" />
                    Display Specifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Refined Visual Heading */}
                    <div className="flex flex-col items-center justify-center relative min-h-[200px] border border-dashed border-[var(--border-color)] rounded-xl p-8 transition-colors duration-300">
                      <span className="text-xs font-medium text-[var(--text-muted)] mb-1">
                        Screen Size
                      </span>


                      <div className="relative transform scale-90 -mt-2">
                        <ScreenSizeGraphic size={asset.screenSizeInch || "??"} />
                      </div>
                    </div>

                    {/* Rest of the fields stay as simple list rows */}
                    <div className="flex flex-col gap-0 self-center">
                      <InfoRow
                        label="Monitor Category"
                        value={asset.deviceType === "PORTABLE_MONITOR" ? "Portable Monitor" : "Stand Monitor"}
                      />
                      <InfoRow label="Manufacturer" value={asset.manufacturer} />
                      <InfoRow label="Model" value={asset.model} />
                      <InfoRow label="Condition" value={asset.condition} />
                    </div>
                  </div>

                  {/* Portable vs Stand note */}
                  <div className="mt-5 p-3 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-color)]/60">
                    {asset.deviceType === "PORTABLE_MONITOR" ? (
                      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                        <span className="font-bold text-blue-500">Portable Monitor</span> — lightweight,
                        travel-friendly display. Typically USB-C or HDMI powered.
                      </p>
                    ) : (
                      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                        <span className="font-bold text-blue-500">Stand Monitor</span> — desktop display
                        on a fixed stand. Typically powered via mains with HDMI / DisplayPort.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Usage History — shown only when data exists */}
              {(asset.latestUsed || asset.previousUsed) && (
                <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300">
                  <h3 className="text-sm font-bold mb-5 text-[var(--text-main)] flex items-center gap-2">
                    <Clock size={16} className="text-orange-400" />
                    Usage History
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                    <div>
                      <InfoRow label="Latest Used By" value={asset.latestUsed} />
                    </div>
                    <div>
                      <InfoRow label="Previously Used By" value={asset.previousUsed} />
                    </div>
                  </div>
                </div>
              )}

              {/* Issue / Notes — shown only when data exists */}
              {asset.issueDescription && (
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6 text-xs">
                  <h3 className="text-sm font-bold mb-3 text-orange-400 flex items-center gap-2">
                    <Terminal size={16} />
                    Issue Description
                  </h3>
                  <p className="text-[var(--text-main)] leading-relaxed whitespace-pre-wrap">
                    {asset.issueDescription}
                  </p>
                </div>
              )}
            </div>

            {/* ════ Sidebar ════ */}
            <div className="flex flex-col gap-4">

              {/* Management */}
              <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300 relative group/meta">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Terminal size={14} className="text-blue-500" />
                    Modify the Asset
                  </h3>

                  {/* Mini Info Icon for Tooltip */}
                  <div className="relative group/tooltip">
                    <div className="p-1 rounded-md hover:bg-[var(--surface-hover)] text-[var(--text-muted)] cursor-help transition-colors">
                      <Info size={12} />
                    </div>

                    {/* Tooltip Content */}
                    <div className="absolute right-0 top-full mt-2 w-56 p-4 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 transform group-hover/tooltip:translate-y-0 translate-y-1">
                      <h4 className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-wider mb-2 border-b border-[var(--border-color)]/30 pb-1">System Metadata</h4>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Created At</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-main)] font-bold">
                            <Calendar size={12} className="text-emerald-500" />
                            {formatDateTime(asset.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Last Update</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-main)] font-bold">
                            <Clock size={12} className="text-blue-500" />
                            {formatDateTime(asset.updatedAt || asset.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] mb-4">
                  Modify asset specifications or maintenance status.
                </p>
                <button
                  onClick={onEdit}
                  className="w-full px-4 py-2 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-lg hover:bg-[var(--surface-hover)] transition-all font-bold text-[10px] uppercase tracking-wider active:scale-95"
                >
                  Edit Asset Details
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h3>
                <p className="text-[11px] text-[var(--text-muted)] mb-4">
                  Permanently removing this asset cannot be undone.
                </p>
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider disabled:opacity-50 active:scale-95"
                >
                  {isDeleting ? "Processing..." : "Delete Asset"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ── Assignment & History Tab ── */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Assignment Management</h3>
                <p className="text-[11px] text-[var(--text-muted)]">Track who is currently using this asset and its assignment history.</p>
              </div>
            </div>
            {asset.status === "AVAILABLE" && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
              >
                <UserPlus size={14} />
                Assign Asset
              </button>
            )}
          </div>

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
                    <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 ${assignment.returnedDate ? "bg-[var(--bg)] border-[var(--border-color)]" : "bg-blue-500 border-blue-200"}`} />

                    <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <div
                        className="p-4 cursor-pointer flex items-center justify-between pointer-events-auto"
                        onClick={() => setExpandedAssignment(expandedAssignment === assignment.id ? null : assignment.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden text-[10px] font-bold ${getAvatarColor(assignment.assignedTo)}`}>
                            {getInitials(assignment.assignedTo)}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[var(--text-main)]">{assignment.assignedTo}</span>
                              {!assignment.returnedDate && (
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 uppercase tracking-tighter">Current</span>
                              )}
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] font-medium">
                              {formatDateTime(assignment.assignedDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {assignment.returnedDate && (
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Returned {formatDateTime(assignment.returnedDate)}
                            </span>
                          )}
                          {expandedAssignment === assignment.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      </div>

                      {expandedAssignment === assignment.id && (
                        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--surface-hover)]/30 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <User size={14} className="text-blue-500" />
                                <div className="flex flex-col">
                                  <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Assigned To</span>
                                  <span className="text-[11px] font-semibold text-[var(--text-main)]">{assignment.assignedTo} ({assignment.jobTitle})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <MapPin size={14} className="text-emerald-500" />
                                <div className="flex flex-col">
                                  <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Department</span>
                                  <span className="text-[11px] font-semibold text-[var(--text-main)]">{assignment.department.replace(/_/g, " ")}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <UserPlus size={14} className="text-orange-500" />
                                <div className="flex flex-col">
                                  <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Assigned By</span>
                                  <span className="text-[11px] font-semibold text-[var(--text-main)]">{assignment.assignedBy || "System"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Calendar size={14} className="text-purple-500" />
                                <div className="flex flex-col">
                                  <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Assignment Date</span>
                                  <span className="text-[11px] font-semibold text-[var(--text-main)]">{formatDateTime(assignment.assignedDate)}</span>
                                </div>
                              </div>
                              {assignment.returnedDate ? (
                                <>
                                  <div className="flex items-center gap-3">
                                    <Calendar size={14} className="text-rose-500" />
                                    <div className="flex flex-col">
                                      <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Return Date</span>
                                      <span className="text-[11px] font-semibold text-[var(--text-main)]">{formatDateTime(assignment.returnedDate)}</span>
                                    </div>
                                  </div>
                                  {assignment.confirmReturnBy && (
                                    <div className="flex items-center gap-3">
                                      <ClipboardCheck size={14} className="text-emerald-600" />
                                      <div className="flex flex-col">
                                        <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Return Confirmed By</span>
                                        <span className="text-[11px] font-semibold text-[var(--text-main)]">{assignment.confirmReturnBy}</span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
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
      )}

      {/* Modals */}
      <AssignAssetModal
        isOpen={isAssignModalOpen}
        asset={asset}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={handleAssignmentSuccess}
      />

      <ReturnAssetModal
        isOpen={isReturnModalOpen}
        asset={asset}
        assignment={selectedAssignment}
        onClose={() => setIsReturnModalOpen(false)}
        onSuccess={handleReturnSuccess}
      />
    </div>
  );
};
