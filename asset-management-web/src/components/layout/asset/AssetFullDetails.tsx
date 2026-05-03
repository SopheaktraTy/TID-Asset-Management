import React, { useState, useEffect } from "react";
import { HardDrive, Package, History } from "lucide-react";
import { getAssetAssignmentsApi } from "../../../services/assignment.service";
import type { AssignmentResponse } from "../../../types/assignment.types";
import { getSafeImageUrl } from "../../../utils/image";
import type { AssetDto } from "../../../types/asset.types";

import AssignAssetModal from "./AssignAssetModal";
import ReturnAssetModal from "./ReturnAssetModal";
import EditAssetModal from "./EditAssetModal";
import AssetDetailsTab from "./tabs/AssetDetailsTab";
import AssetAssignmentTab from "./tabs/AssetAssignmentTab";
import AssetProcurementTab from "./tabs/AssetProcurementTab";
import EditAssignmentModal from "./EditAssignmentModal";
import DeleteAssignmentModal from "./DeleteAssignmentModal";
import ManageProcurementModal from "./ManageProcurementModal";
import DeleteProcurementModal from "./DeleteProcurementModal";
import { getAssetProcurementApi, deleteAssetProcurementApi } from "../../../services/procurement.service";
import { ShoppingBag, Construction } from "lucide-react";
import { getAssetIssuesApi } from "../../../services/issue.service";
import type { IssueResponse } from "../../../types/issue.types";
import type { ProcurementResponse } from "../../../types/procurement.types";
import AssetIssueTab from "./tabs/AssetIssueTab";
import ReportIssueModal from "./ReportIssueModal";
import EditIssueModal from "./EditIssueModal";
import DeleteIssueModal from "./DeleteIssueModal";
import UpdateIssueStatusModal from "./UpdateIssueStatusModal";

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
  const [activeTab, setActiveTab] = useState<"details" | "assignment" | "procurement" | "issue">("details");
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [procurement, setProcurement] = useState<ProcurementResponse | null>(null);
  const [issues, setIssues] = useState<IssueResponse[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingProcurement, setLoadingProcurement] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [deletingProcurement, setDeletingProcurement] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState<number | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);
  const [isDeleteAssignmentModalOpen, setIsDeleteAssignmentModalOpen] = useState(false);
  const [isStatusEditModalOpen, setIsStatusEditModalOpen] = useState(false);
  const [isManageProcurementModalOpen, setIsManageProcurementModalOpen] = useState(false);
  const [isDeleteProcurementModalOpen, setIsDeleteProcurementModalOpen] = useState(false);
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const [isEditIssueModalOpen, setIsEditIssueModalOpen] = useState(false);
  const [isDeleteIssueModalOpen, setIsDeleteIssueModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentResponse | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueResponse | null>(null);

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

  const fetchProcurement = async () => {
    try {
      setLoadingProcurement(true);
      const data = await getAssetProcurementApi(asset.id);
      setProcurement(data);
    } catch (error) {
      console.error("Failed to fetch procurement:", error);
      setProcurement(null);
    } finally {
      setLoadingProcurement(false);
    }
  };

  const fetchIssues = async () => {
    try {
      setLoadingIssues(true);
      const data = await getAssetIssuesApi(asset.id);
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    if (activeTab === "assignment") {
      fetchAssignments();
    } else if (activeTab === "procurement") {
      fetchProcurement();
    } else if (activeTab === "issue") {
      fetchIssues();
    }
  }, [activeTab, asset.id]);

  const handleAssignmentSuccess = (_newAssignment: AssignmentResponse) => {
    fetchAssignments();
    if (onAssetUpdate) {
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

  const handleAssignmentUpdateSuccess = (_updatedAssignment: AssignmentResponse) => {
    fetchAssignments();
  };

  const handleAssignmentDeleteSuccess = (_assignmentId: number) => {
    fetchAssignments();
  };

  const handleProcurementSuccess = (data: ProcurementResponse) => {
    setProcurement(data);
  };

  const handleIssueSuccess = (_issue: IssueResponse) => {
    fetchIssues();
  };

  const handleIssueDeleteSuccess = (_issueId: number) => {
    fetchIssues();
  };



  const handleConfirmDeleteProcurement = async () => {
    try {
      setDeletingProcurement(true);
      await deleteAssetProcurementApi(asset.id);
      setProcurement(null);
      setIsDeleteProcurementModalOpen(false);
    } catch (error) {
      console.error("Failed to delete procurement:", error);
    } finally {
      setDeletingProcurement(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-[#10b981]/15 text-[#10b981]";
      case "IN_USE":
        return "bg-[#3b82f6]/15 text-[#3b82f6]";
      case "DAMAGED":
        return "bg-red-500/15 text-red-500";
      case "UNDER_REPAIR":
        return "bg-amber-500/15 text-amber-500";
      case "LOST":
        return "bg-red-600/15 text-red-600";
      case "MALFUNCTION":
        return "bg-orange-500/15 text-orange-500";
      case "MAINTENANCE":
        return "bg-purple-500/15 text-purple-500";
      default:
        return "bg-[var(--text-muted)]/15 text-[var(--text-muted)]";
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Asset Header ── */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
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

        <div className="flex flex-col flex-1 min-w-0 w-full">
          <div className="flex justify-between items-center gap-8 w-full">
            <div className="flex flex-col flex-1 min-w-0 gap-0.5 items-center sm:items-start text-center sm:text-left w-full">
              <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] truncate opacity-80 w-full">
                {asset.assetTag}
              </span>
              <h2 className="text-2xl font-black text-[var(--text-main)] truncate leading-tight tracking-tight uppercase w-full">
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
            ? "border-[var(--color-growth-green)] text-[var(--color-growth-green)]"
            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
        >
          <Package size={16} />
          Asset Specifications
        </button>
        <button
          onClick={() => setActiveTab("assignment")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all font-medium text-xs ${activeTab === "assignment"
            ? "border-[var(--color-growth-green)] text-[var(--color-growth-green)]"
            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
        >
          <History size={16} />
          Usage & Returns
        </button>
        <button
          onClick={() => setActiveTab("procurement")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all font-medium text-xs ${activeTab === "procurement"
            ? "border-[var(--color-growth-green)] text-[var(--color-growth-green)]"
            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
        >
          <ShoppingBag size={16} />
          Procurement & Warranty
        </button>
        <button
          onClick={() => setActiveTab("issue")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all font-medium text-xs ${activeTab === "issue"
            ? "border-[var(--color-growth-green)] text-[var(--color-growth-green)]"
            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
        >
          <Construction size={16} />
          Issues & Reports
        </button>
      </div>

      {activeTab === "details" ? (
        <AssetDetailsTab
          asset={asset}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          getStatusStyle={getStatusStyle}
        />
      ) : activeTab === "assignment" ? (
        <AssetAssignmentTab
          asset={asset}
          assignments={assignments}
          loadingAssignments={loadingAssignments}
          expandedAssignment={expandedAssignment}
          setExpandedAssignment={setExpandedAssignment}
          setIsAssignModalOpen={setIsAssignModalOpen}
          setIsStatusEditModalOpen={setIsStatusEditModalOpen}
          setIsReturnModalOpen={setIsReturnModalOpen}
          setIsEditAssignmentModalOpen={setIsEditAssignmentModalOpen}
          setIsDeleteAssignmentModalOpen={setIsDeleteAssignmentModalOpen}
          setSelectedAssignment={setSelectedAssignment}
        />
      ) : activeTab === "procurement" ? (
        <AssetProcurementTab
          asset={asset}
          procurement={procurement}
          loading={loadingProcurement}
          onAdd={() => setIsManageProcurementModalOpen(true)}
          onEdit={() => setIsManageProcurementModalOpen(true)}
          onDelete={() => setIsDeleteProcurementModalOpen(true)}
        />
      ) : (
        <AssetIssueTab
          asset={asset}
          issues={issues}
          loadingIssues={loadingIssues}
          expandedIssue={expandedIssue}
          setExpandedIssue={setExpandedIssue}
          setIsReportModalOpen={setIsReportIssueModalOpen}
          setIsEditModalOpen={setIsEditIssueModalOpen}
          setIsDeleteModalOpen={setIsDeleteIssueModalOpen}
          setSelectedIssue={setSelectedIssue}
          onUpdateStatus={(issue) => {
            setSelectedIssue(issue);
            setIsUpdateStatusModalOpen(true);
          }}
        />
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

      <EditAssignmentModal
        isOpen={isEditAssignmentModalOpen}
        assignment={selectedAssignment}
        onClose={() => setIsEditAssignmentModalOpen(false)}
        onSuccess={handleAssignmentUpdateSuccess}
      />

      <DeleteAssignmentModal
        isOpen={isDeleteAssignmentModalOpen}
        assignment={selectedAssignment}
        onClose={() => setIsDeleteAssignmentModalOpen(false)}
        onDeleted={handleAssignmentDeleteSuccess}
      />

      <EditAssetModal
        isOpen={isStatusEditModalOpen}
        asset={asset}
        onClose={() => setIsStatusEditModalOpen(false)}
        onUpdated={(updated) => {
          setIsStatusEditModalOpen(false);
          onAssetUpdate?.(updated);
        }}
      />

      <ManageProcurementModal
        isOpen={isManageProcurementModalOpen}
        onClose={() => setIsManageProcurementModalOpen(false)}
        onSuccess={handleProcurementSuccess}
        assetId={asset.id}
        initialData={procurement}
      />

      <DeleteProcurementModal
        isOpen={isDeleteProcurementModalOpen}
        onClose={() => setIsDeleteProcurementModalOpen(false)}
        onConfirm={handleConfirmDeleteProcurement}
        loading={deletingProcurement}
        assetTag={asset.assetTag}
        vendor={procurement?.purchaseVendor}
        cost={procurement?.purchaseCost}
      />

      <ReportIssueModal
        isOpen={isReportIssueModalOpen}
        asset={asset}
        onClose={() => setIsReportIssueModalOpen(false)}
        onSuccess={handleIssueSuccess}
      />

      <EditIssueModal
        isOpen={isEditIssueModalOpen}
        issue={selectedIssue}
        onClose={() => setIsEditIssueModalOpen(false)}
        onSuccess={handleIssueSuccess}
      />

      <DeleteIssueModal
        isOpen={isDeleteIssueModalOpen}
        issue={selectedIssue}
        onClose={() => setIsDeleteIssueModalOpen(false)}
        onDeleted={handleIssueDeleteSuccess}
      />

      <UpdateIssueStatusModal
        isOpen={isUpdateStatusModalOpen}
        issue={selectedIssue}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        onSuccess={handleIssueSuccess}
      />
    </div>
  );
};
