import { useState, useEffect } from "react";
import { Loader2, HardDrive, Cpu, Monitor, FileText } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../ui/Button";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { DropdownList } from "../../ui/DropdownList";
import { ToggleSwitch } from "../../ui/ToggleSwitch";

import {
  editAssetSchema,
  type EditAssetFormValues,
  type AssetDto,
} from "../../../types/asset.types";
import { updateAssetApi } from "../../../services/asset.service";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "IN_USE", label: "In Use" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "UNDER_REPAIR", label: "Under Repair" },
  { value: "LOST", label: "Lost" },
  { value: "MALFUNCTION", label: "Malfunction" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OTHER", label: "Other" },
];

const DISK_TYPE_OPTIONS = [
  { value: "", label: "— None —" },
  { value: "SSD", label: "SSD" },
  { value: "HDD", label: "HDD" },
  { value: "NVMe", label: "NVMe" },
  { value: "eMMC", label: "eMMC" },
];

import { DeviceTypeGridSelector } from "./DeviceTypeGridSelector";

// ── Shared styles ─────────────────────────────────────────────────────────────
const fieldCls =
  "w-full px-3 py-2 text-xs bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-lg text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-growth-green)] transition-colors";
const labelCls = "block text-xs font-bold text-[var(--text-main)] mb-2 ml-1";
const errorCls = "mt-1 text-[10px] text-red-500 ml-1";

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="pt-2 px-1">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[var(--color-growth-green)]" />
        <h3 className="text-sm font-bold text-[var(--text-main)]">{title}</h3>
      </div>
      <div className="h-px bg-[var(--border-color)] w-full opacity-50 mb-4" />
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface EditAssetModalProps {
  isOpen: boolean;
  asset: AssetDto | null;
  onClose: () => void;
  onUpdated: (updated: AssetDto) => void;
}

export default function EditAssetModal({
  isOpen,
  asset,
  onClose,
  onUpdated,
}: EditAssetModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm<EditAssetFormValues>({
    resolver: zodResolver(editAssetSchema) as any,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // Pre-fill form whenever the asset changes
  useEffect(() => {
    if (asset) {
      reset({
        assetTag: asset.assetTag ?? "",
        serialNumber: asset.serialNumber ?? "",
        deviceName: asset.deviceName ?? "",
        deviceType: asset.deviceType,
        manufacturer: asset.manufacturer ?? "",
        model: asset.model ?? "",
        status: asset.status,
        cpu: asset.cpu ?? "",
        ramGb: asset.ramGb ?? undefined,
        diskType: asset.diskType ?? "",
        diskModel: asset.diskModel ?? "",
        storageSizeGb: asset.storageSizeGb ?? undefined,
        screenSizeInch: asset.screenSizeInch ?? undefined,
        operatingSystem: asset.operatingSystem ?? "",
        osVersion: asset.osVersion ?? "",
        domainJoined: asset.domainJoined ?? false,
        condition: asset.condition ?? "",
        issueDescription: asset.issueDescription ?? "",
        image: asset.image ?? "",
      });
    }
  }, [asset, reset]);

  const handleClose = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  const onSubmit = async (data: EditAssetFormValues) => {
    if (!asset) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const updated = await updateAssetApi(asset.id, data);
      setSuccessMsg("Asset updated successfully!");
      setTimeout(() => {
        onUpdated(updated);
        handleClose();
      }, 800);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update asset.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !asset) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[700px]">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="w-full flex flex-col items-center mb-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
            <HardDrive size={22} className="text-blue-500" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black tracking-tight text-[var(--text-main)]">
              Edit Asset
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-wider font-mono">
              {asset.assetTag}
            </p>
          </div>
        </div>

        <div className="h-px bg-[var(--border-color)] w-full opacity-30 mb-2" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-left max-h-[75vh] overflow-y-auto pr-2 px-1 custom-scrollbar"
        >
          {/* ── Device Identity ── */}
          <SectionHeader icon={HardDrive} title="Device Identity" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className={labelCls}>Asset Tag *</label>
              <input className={fieldCls} {...register("assetTag")} />
              {errors.assetTag && <p className={errorCls}>{errors.assetTag.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Serial Number</label>
              <input className={fieldCls} {...register("serialNumber")} />
            </div>

            <div className="col-span-2">
              <label className={labelCls}>Device Name *</label>
              <input className={fieldCls} {...register("deviceName")} />
              {errors.deviceName && <p className={errorCls}>{errors.deviceName.message}</p>}
            </div>

            <div className="col-span-2">
              <label className={labelCls}>Device Type *</label>
              <Controller
                name="deviceType"
                control={control}
                render={({ field }) => (
                  <DeviceTypeGridSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.deviceType && <p className={errorCls}>{errors.deviceType.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Status *</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <DropdownList
                    options={STATUS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    panelClassName="bg-[var(--bg)]"
                  />
                )}
              />
              {errors.status && <p className={errorCls}>{errors.status.message}</p>}
            </div>
            <div />

            <div>
              <label className={labelCls}>Manufacturer</label>
              <input className={fieldCls} {...register("manufacturer")} />
            </div>
            <div>
              <label className={labelCls}>Model</label>
              <input className={fieldCls} {...register("model")} />
            </div>
          </div>


          {/* ── Hardware Specs ── */}
          <SectionHeader icon={Cpu} title="Hardware Specs" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <label className={labelCls}>CPU</label>
              <input className={fieldCls} {...register("cpu")} />
            </div>

            <div className="grid grid-cols-3 col-span-2 gap-4">
              <div>
                <label className={labelCls}>RAM (GB)</label>
                <input type="number" min={0} className={fieldCls} {...register("ramGb")} />
                {errors.ramGb && <p className={errorCls}>{errors.ramGb.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Storage (GB)</label>
                <input type="number" min={0} className={fieldCls} {...register("storageSizeGb")} />
                {errors.storageSizeGb && <p className={errorCls}>{errors.storageSizeGb.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Screen (inch)</label>
                <input type="number" min={0} step="0.1" className={fieldCls} {...register("screenSizeInch")} />
                {errors.screenSizeInch && <p className={errorCls}>{errors.screenSizeInch.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Disk Type</label>
              <Controller
                name="diskType"
                control={control}
                render={({ field }) => (
                  <DropdownList
                    options={DISK_TYPE_OPTIONS}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    className="w-full"
                    panelClassName="bg-[var(--bg)]"
                  />
                )}
              />
            </div>
            <div>
              <label className={labelCls}>Disk Model</label>
              <input className={fieldCls} {...register("diskModel")} />
            </div>
          </div>

          {/* ── Software & OS ── */}
          <SectionHeader icon={Monitor} title="Software & OS" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className={labelCls}>Operating System</label>
              <input className={fieldCls} {...register("operatingSystem")} />
            </div>
            <div>
              <label className={labelCls}>OS Version</label>
              <input className={fieldCls} {...register("osVersion")} />
            </div>

            <div className="col-span-2 px-1">
              <Controller
                name="domainJoined"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    label="Domain Joined"
                    description="Device is joined to the company domain."
                    checked={!!field.value}
                    onChange={field.onChange}
                    size="sm"
                    className="!py-2"
                  />
                )}
              />
            </div>
          </div>

          {/* ── Notes ── */}
          <SectionHeader icon={FileText} title="Notes & Condition" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-1">
              <label className={labelCls}>Condition</label>
              <input className={fieldCls} {...register("condition")} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Issue Description</label>
              <textarea
                rows={3}
                className={`${fieldCls} resize-none`}
                {...register("issueDescription")}
              />
            </div>
          </div>

          {/* Messages */}
          {errorMsg && <Message variant="error">{errorMsg}</Message>}
          {successMsg && <Message variant="success">{successMsg}</Message>}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 translate-y-1 sticky bottom-0 bg-[var(--surface)] pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-8 h-11 text-xs font-bold transition-all border-opacity-30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-auto min-w-[160px] h-11 gap-2 px-8 py-2 text-xs font-bold bg-[var(--color-growth-green)] text-[var(--btn-primary-text)] border-0 transition-all rounded-full shadow-[0_2px_8px_var(--btn-primary-shadow)] hover:shadow-[0_4px_14px_var(--btn-primary-shadow)] hover:brightness-110 transform active:scale-95"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
