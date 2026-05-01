import React from "react";
import { HardDrive, Monitor, Cpu, Terminal, Calendar, Clock, Info } from "lucide-react";
import type { AssetDto } from "../../../../types/asset.types";
import { formatDateTime } from "../../../../utils/format";

interface AssetDetailsTabProps {
  asset: AssetDto;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  getStatusStyle: (status: string) => string;
}

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
  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start py-2 border-b border-[var(--border-color)]/40 last:border-0 gap-y-1 sm:gap-y-0">
    <span className="text-[var(--text-muted)] text-[10px] sm:text-[11px] font-bold sm:font-medium sm:pt-0.5 uppercase sm:normal-case tracking-wider sm:tracking-normal">
      {label}
    </span>
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
    emerald: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
    blue: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
    purple: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
    orange: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
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

/** A premium visual representing a monitor with a diagonal size arrow */
const ScreenSizeGraphic = ({ size }: { size: string | number }) => (
  <div className="relative shrink-0 flex flex-col items-center py-2 group/monitor">
    <div className="relative w-32 h-20 bg-[#1e1f29] border-[3px] border-[#3f4050] rounded-[4px] shadow-2xl flex items-center justify-center p-[2px]">
      <div className="relative w-full h-full bg-[#0a0b10] overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full p-1" viewBox="0 0 100 60" preserveAspectRatio="none">
            <line x1="0" y1="60" x2="100" y2="0" stroke="var(--color-growth-green)" strokeWidth="3" opacity="0.9" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-[#0a0b10] px-2 py-0.5 rotate-[-31deg]">
              <span className="text-[10px] font-black text-[var(--color-growth-green)] whitespace-nowrap uppercase tracking-widest leading-none">
                {size} Inch
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-20 pointer-events-none" />
      </div>
    </div>
    <div className="w-4 h-4 bg-[#3f4050] -mt-px shadow-sm" />
    <div className="w-20 h-1.5 bg-[#2d2e3a] rounded-t-xl shadow-inner relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
    </div>
  </div>
);

const AssetDetailsTab: React.FC<AssetDetailsTabProps> = ({
  asset,
  onEdit,
  onDelete,
  isDeleting,
  getStatusStyle,
}) => {
  const isComputer = asset.deviceType === "LAPTOP" || asset.deviceType === "DESKTOP";
  const isMonitor =
    asset.deviceType === "PORTABLE_MONITOR" || asset.deviceType === "STAND_MONITOR";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ════ Main column ════ */}
      <div className="lg:col-span-2 space-y-6">
        {/* General Information */}
        <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300">
          <h3 className="text-sm font-bold mb-5 text-[var(--text-main)] flex items-center gap-2">
            <Terminal size={16} className="text-[var(--color-growth-green)]" />
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

        {/* Console / SPEC for Computer */}
        {isComputer && (
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300">
              <h3 className="text-sm font-bold mb-6 text-[var(--text-main)] flex items-center gap-2">
                <Cpu size={16} className="text-[var(--color-growth-green)]" />
                Hardware Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SpecTile icon={<Cpu size={15} />} label="Processor" value={asset.cpu || "N/A"} accent="emerald" />
                <SpecTile icon={<Terminal size={15} />} label="RAM" value={asset.ramGb ? `${asset.ramGb} GB` : "N/A"} accent="blue" />
                <SpecTile icon={<HardDrive size={15} />} label="Storage Size" value={asset.storageSizeGb ? `${asset.storageSizeGb} GB` : "N/A"} accent="purple" />
                <SpecTile icon={<HardDrive size={15} />} label="Disk Type" value={asset.diskType || "N/A"} accent="orange" />
                {asset.diskModel && <SpecTile icon={<HardDrive size={15} />} label="Disk Model" value={asset.diskModel} accent="emerald" />}
                {asset.screenSizeInch && <SpecTile icon={<Monitor size={15} />} label="Display" value={`${asset.screenSizeInch}"`} accent="blue" />}
              </div>
            </div>

            <div className="flex-1 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300">
              <h3 className="text-sm font-bold mb-5 text-[var(--text-main)] flex items-center gap-2">
                <Monitor size={16} className="text-[var(--color-growth-green)]" />
                Operating System & Security
              </h3>
              <div className="flex flex-col">
                <InfoRow label="Operating System" value={asset.operatingSystem} />
                <InfoRow label="OS Version" value={asset.osVersion} />
                <InfoRow label="Domain Joined" value={asset.domainJoined == null ? "N/A" : asset.domainJoined ? <span className="text-emerald-500 font-bold">Yes</span> : <span className="text-red-400 font-bold">No</span>} />
                <InfoRow label="Security Check" value={asset.lastSecurityCheck ? formatDateTime(asset.lastSecurityCheck) : "N/A"} />
              </div>
            </div>
          </div>
        )}

        {/* Monitor Specs */}
        {isMonitor && (
          <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 transition-colors duration-300">
            <h3 className="text-sm font-bold mb-6 text-[var(--text-main)] flex items-center gap-2">
              <Monitor size={16} className="text-[var(--color-growth-green)]" />
              Display Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[var(--border-color)] rounded-xl transition-colors duration-300">
                <span className="text-xs font-medium text-[var(--text-muted)] mb-1">Screen Size</span>
                <ScreenSizeGraphic size={asset.screenSizeInch || "??"} />
              </div>
              <div className="flex flex-col self-center">
                <InfoRow label="Category" value={asset.deviceType === "PORTABLE_MONITOR" ? "Portable" : "Stand"} />
                <InfoRow label="Manufacturer" value={asset.manufacturer} />
                <InfoRow label="Model" value={asset.model} />
                <InfoRow label="Condition" value={asset.condition} />
              </div>
            </div>
          </div>
        )}

        {/* Usage Summary & Remark Row */}
        {(asset.latestUsed || asset.previousUsed || asset.remark) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Summary */}
            {(asset.latestUsed || asset.previousUsed) && (
              <div className={`bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300 ${!asset.remark ? "lg:col-span-2" : ""}`}>
                <h3 className="text-sm font-bold mb-5 text-[var(--text-main)] flex items-center gap-2">
                  <Clock size={16} className="text-[var(--color-growth-green)]" />
                  Usage Summary
                </h3>
                <div className={`grid grid-cols-1 ${!asset.remark ? "md:grid-cols-2" : "2xl:grid-cols-2"} gap-x-10`}>
                  <InfoRow label="Latest Used By" value={asset.latestUsed} />
                  <InfoRow label="Previously Used By" value={asset.previousUsed} />
                </div>
              </div>
            )}

            {/* Remark Notes */}
            {asset.remark && (
              <div className={`bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors duration-300 ${(!asset.latestUsed && !asset.previousUsed) ? "lg:col-span-2" : ""}`}>
                <h3 className="text-sm font-bold mb-5 text-[var(--text-main)] flex items-center gap-2">
                  <Terminal size={16} className="text-[var(--color-growth-green)]" />
                  Remark
                </h3>
                <p className="text-[var(--text-main)] leading-relaxed whitespace-pre-wrap">{asset.remark}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ════ Sidebar ════ */}
      <div className="flex flex-col gap-4">
        <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs transition-colors relative group/meta">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Terminal size={14} className="text-[var(--color-growth-green)]" />
              Modify the Asset
            </h3>
            <div className="relative group/tooltip">
              <div className="p-1 rounded-md hover:bg-[var(--surface-hover)] text-[var(--text-muted)] cursor-help transition-colors">
                <Info size={12} />
              </div>
              <div className="absolute right-0 top-full mt-2 w-56 p-4 bg-[var(--bg)] border border-[var(--border-color)] rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 transform translate-y-1 group-hover/tooltip:translate-y-0">
                <h4 className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-wider mb-2 border-b border-[var(--border-color)]/30 pb-1">Metadata</h4>
                <div className="space-y-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Created At</span>
                    <span className="text-[10px] text-[var(--text-main)] font-bold flex items-center gap-1.5"><Calendar size={12} className="text-emerald-500" />{formatDateTime(asset.createdAt)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Last Update</span>
                    <span className="text-[10px] text-[var(--text-main)] font-bold flex items-center gap-1.5"><Clock size={12} className="text-[var(--color-aqua)]" />{formatDateTime(asset.updatedAt || asset.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mb-4">Modify specifications or maintenance status.</p>
          <button onClick={onEdit} className="w-full px-4 py-2 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-lg hover:bg-[var(--surface-hover)] transition-all font-bold text-[10px] uppercase tracking-wider active:scale-95">Edit Asset Details</button>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 transition-colors duration-300">
          <h3 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h3>
          <p className="text-[11px] text-[var(--text-muted)] mb-4">Permanently removing this asset cannot be undone.</p>
          <button onClick={onDelete} disabled={isDeleting} className="w-full px-4 py-2 bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider disabled:opacity-50 active:scale-95">{isDeleting ? "Processing..." : "Delete Asset"}</button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsTab;
