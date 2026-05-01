import React from "react";
import { 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  ShieldAlert, 
  Store,
  Plus,
  AlertCircle
} from "lucide-react";
import type { AssetDto } from "../../../../types/asset.types";
import type { ProcurementResponse } from "../../../../types/procurement.types";
import { formatDate } from "../../../../utils/format";

interface AssetProcurementTabProps {
  asset: AssetDto;
  procurement: ProcurementResponse | null;
  loading: boolean;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const InfoCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  accent = "blue" 
}: { 
  icon: any, 
  label: string, 
  value: string, 
  subValue?: string,
  accent?: "emerald" | "blue" | "purple" | "orange" | "red"
}) => {
  const accentMap = {
    emerald: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
    blue: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
    purple: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
    orange: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
    red: "group-hover:bg-[var(--color-growth-green)]/10 group-hover:text-[var(--color-growth-green)]",
  };

  return (
    <div className="flex items-center gap-4 group border border-dashed border-[var(--border-color)] rounded-xl p-4 transition-all duration-300 hover:border-[var(--color-growth-green)]/30 hover:bg-[var(--surface-hover)]/5">
      <div className={`w-10 h-10 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center shrink-0 transition-colors shadow-sm ${accentMap[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider mb-0.5">
          {label}
        </span>
        <span className="text-sm font-bold text-[var(--text-main)] truncate tracking-tight">{value}</span>
        {subValue && (
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5 opacity-70">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

const AssetProcurementTab: React.FC<AssetProcurementTabProps> = ({
  asset,
  procurement,
  loading,
  onAdd,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-[3px] border-[var(--color-growth-green)]/10 border-t-[var(--color-growth-green)] rounded-full animate-spin" />
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] animate-pulse">Syncing Procurement...</span>
      </div>
    );
  }

  const isWarrantyActive = procurement?.warrantyExpiryDate 
    ? new Date(procurement.warrantyExpiryDate) > new Date() 
    : false;

  const daysUntilExpiry = procurement?.warrantyExpiryDate
    ? Math.ceil((new Date(procurement.warrantyExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="animate-in fade-in duration-500">
      {!procurement ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-[var(--surface-hover)]/10 border border-dashed border-[var(--border-color)] rounded-2xl text-center">
          <div className="w-16 h-16 bg-[var(--bg)] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[var(--border-color)] text-[var(--text-muted)]/30">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">No Procurement Record</h3>
          <p className="text-[11px] text-[var(--text-muted)] max-w-[280px] leading-relaxed mb-6 opacity-70">
            Track purchase costs and warranty health for this asset.
          </p>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-growth-green)] text-black rounded-lg font-bold text-xs shadow-lg shadow-[var(--color-growth-green)]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={16} />
            Add Procurement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm transition-colors duration-300">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 mb-6">
                <ShoppingBag size={16} className="text-[var(--color-growth-green)]" />
                Purchase & Warranty Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard 
                  icon={Calendar} 
                  label="Purchase Date" 
                  value={formatDate(procurement.purchaseDate)} 
                  subValue="Initial deployment"
                  accent="emerald"
                />
                <InfoCard 
                  icon={Store} 
                  label="Vendor" 
                  value={procurement.purchaseVendor} 
                  subValue="Authorized supplier"
                  accent="blue"
                />
                <InfoCard 
                  icon={CreditCard} 
                  label="Purchase Cost" 
                  value={`$${procurement.purchaseCost.toLocaleString()}`} 
                  subValue="Total valuation"
                  accent="purple"
                />
                <InfoCard 
                  icon={isWarrantyActive ? ShieldCheck : ShieldAlert} 
                  label="Warranty Expiry" 
                  value={formatDate(procurement.warrantyExpiryDate)} 
                  subValue={isWarrantyActive ? `${daysUntilExpiry} days remaining` : "Warranty expired"}
                  accent={isWarrantyActive ? "emerald" : "red"}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border-color)]/40 flex gap-4">
                <div className="w-10 h-10 bg-blue-500/5 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-tight">Financial Note</h4>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    This procurement record is unique to <strong>{asset.assetTag}</strong>. 
                    Financial records should be tracked using the vendor information above.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 mb-2">
                <ShoppingBag size={14} className="text-[var(--color-growth-green)]" />
                Modify Record
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mb-6 leading-relaxed">
                Update the purchase details or correct warranty information for this asset.
              </p>
              <button
                onClick={onEdit}
                className="w-full px-4 py-2 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-lg hover:bg-[var(--surface-hover)] transition-all font-bold text-[10px] uppercase tracking-wider active:scale-95"
              >
                Edit Procurement Record
              </button>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 transition-colors duration-300">
              <h3 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h3>
              <p className="text-[11px] text-[var(--text-muted)] mb-4 leading-relaxed">
                Permanently removing this procurement record cannot be undone.
              </p>
              <button
                onClick={onDelete}
                className="w-full px-4 py-2 bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider active:scale-95"
              >
                Delete Procurement Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetProcurementTab;
