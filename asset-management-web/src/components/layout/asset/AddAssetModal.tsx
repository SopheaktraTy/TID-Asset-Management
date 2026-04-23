import { Loader2, Tag, Cpu, ClipboardList, MonitorSmartphone, ImagePlus, UploadCloud, Trash2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { DropdownReverseList } from "../../ui/DropdownReverseList";
import { ToggleSwitch } from "../../ui/ToggleSwitch";
import { DeviceTypeCard } from "./DeviceTypeCard";
import { SuggestionInput } from "../../ui/SuggestionInput";
import { ImageCropper } from "../../ui/ImageCropper";
import {
  MANUFACTURER_SUGGESTIONS,
  CPU_SUGGESTIONS,
  DISK_TYPE_SUGGESTIONS,
  DISK_MODEL_SUGGESTIONS,
  OS_SUGGESTIONS,
  OS_VERSION_SUGGESTIONS,
  CONDITION_SUGGESTIONS
} from "../../../constants/suggestions";

import { useUserForm } from "../../../hooks/useUserForm";
import type { CreateAssetFormValues, AssetDto } from "../../../types/asset.types";
import { createAssetSchema } from "../../../types/asset.types";
import { createAssetApi } from "../../../services/asset.service";
import { useTheme } from "../../../hooks/useTheme";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { getSafeImageUrl } from "../../../utils/image";


// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";


const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "Available", value: "AVAILABLE" },
  { label: "In Use", value: "IN_USE" },
  { label: "Damaged", value: "DAMAGED" },
  { label: "Under Repair", value: "UNDER_REPAIR" },
  { label: "Lost", value: "LOST" },
  { label: "Malfunction", value: "MALFUNCTION" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Other", value: "OTHER" },
];

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (asset: AssetDto) => void;
}

export default function AddAssetModal({ isOpen, onClose, onSuccess }: AddAssetModalProps) {
  const { theme } = useTheme();


  const {
    register,
    control,
    watch,
    formState: { errors },
    loading,
    errorMsg,
    successMsg,
    handleClose: baseHandleClose,
    handleSubmit,
  } = useUserForm<CreateAssetFormValues>({
    schema: createAssetSchema,
    defaultValues: {
      assetTag: "",
      deviceName: "",
      deviceType: null as any,
      status: "AVAILABLE",
      serialNumber: "",
      manufacturer: "",
      model: "",
      cpu: "",
      ramGb: null,
      diskType: "",
      diskModel: "",
      storageSizeGb: null,
      screenSizeInch: null,
      operatingSystem: "",
      osVersion: "",
      domainJoined: false,
      condition: "",
      issueDescription: "",
    },
    onSubmit: (data) => createAssetApi(data, selectedFile as File),
    onSuccess,
    onClose,
    successMessage: "Asset created successfully!",
  });

  const {
    tempImage: imagePreview,
    selectedFile,
    pendingCropImage,
    setPendingCropImage,
    fileInputRef,
    handleImageUpload,
    handleCropComplete,
    handleRemoveImage,
    resetImage,
    isDragging,
    dragProps,
  } = useImageUpload({ aspect: 4 / 3 });

  const handleClose = () => {
    resetImage();
    baseHandleClose();
  };

  const deviceType = watch("deviceType");

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[700px]"
    >
      <div className="flex flex-col gap-2">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center mb-2 pt-1">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Add New Asset</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              asset registration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* ── Asset Identity ── */}
          <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
            <div className="px-1 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-[var(--color-growth-green)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Asset Identity</h3>
            </div>
            <div className="px-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Device Category *</label>
                <Controller
                  name="deviceType"
                  control={control}
                  render={({ field }) => (
                    <DeviceTypeCard
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.deviceType}
                    />
                  )}
                />
                {errors.deviceType && <p className="mt-2 text-[10px] text-red-500 ml-1 font-bold">{errors.deviceType.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-[10px]">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Asset Tag *</label>
                  <Input
                    placeholder="e.g. BT-LP-001"
                    className="bg-[var(--bg)] border-[var(--border-color)]/50"
                    {...register("assetTag")}
                  />
                  {errors.assetTag && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.assetTag.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Device Name *</label>
                  <Input
                    placeholder="e.g. BT-LP-001"
                    className="bg-[var(--bg)] border-[var(--border-color)]/50"
                    {...register("deviceName")}
                  />
                  {errors.deviceName && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.deviceName.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Serial Number</label>
                  <Input
                    placeholder="e.g. SN12345678"
                    className="bg-[var(--bg)] border-[var(--border-color)]/50"
                    {...register("serialNumber")}
                  />
                  {errors.serialNumber && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.serialNumber.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {deviceType && (
            <>
              {/* ── Hardware Specifications ── */}
              <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
                <div className="px-1 mb-3 flex items-center gap-2">
                  <Cpu size={16} className="text-[var(--color-growth-green)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Hardware Specifications</h3>
                </div>
                <div className="px-[10px] grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Manufacturer</label>
                    <Controller
                      name="manufacturer"
                      control={control}
                      render={({ field }) => (
                        <SuggestionInput
                          {...field}
                          suggestions={MANUFACTURER_SUGGESTIONS}
                          placeholder="e.g. Dell / Apple"
                          className="bg-[var(--bg)] border-[var(--border-color)]/50"
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Model</label>
                    <Input
                      placeholder="e.g. Latitude / MacBook"
                      className="bg-[var(--bg)] border-[var(--border-color)]/50"
                      {...register("model")}
                    />
                  </div>

                  {(deviceType === "LAPTOP" || deviceType === "DESKTOP") && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">CPU</label>
                        <Controller
                          name="cpu"
                          control={control}
                          render={({ field }) => (
                            <SuggestionInput
                              {...field}
                              suggestions={CPU_SUGGESTIONS}
                              placeholder="e.g. i7 Gen 11 / M2"
                              className="bg-[var(--bg)] border-[var(--border-color)]/50"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">RAM (GB)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 16"
                          className="bg-[var(--bg)] border-[var(--border-color)]/50"
                          {...register("ramGb")}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Screen (Inch)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 14"
                      className="bg-[var(--bg)] border-[var(--border-color)]/50"
                      {...register("screenSizeInch")}
                    />
                  </div>

                  {(deviceType === "LAPTOP" || deviceType === "DESKTOP") && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Disk Type</label>
                        <Controller
                          name="diskType"
                          control={control}
                          render={({ field }) => (
                            <SuggestionInput
                              {...field}
                              suggestions={DISK_TYPE_SUGGESTIONS}
                              placeholder="e.g. SSD / HDD"
                              className="bg-[var(--bg)] border-[var(--border-color)]/50"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Storage (GB)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 512"
                          className="bg-[var(--bg)] border-[var(--border-color)]/50"
                          {...register("storageSizeGb")}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Disk Model</label>
                        <Controller
                          name="diskModel"
                          control={control}
                          render={({ field }) => (
                            <SuggestionInput
                              {...field}
                              suggestions={DISK_MODEL_SUGGESTIONS}
                              placeholder="e.g. Samsung NVMe"
                              className="bg-[var(--bg)] border-[var(--border-color)]/50"
                            />
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── Software & Network ── */}
              {(deviceType === "LAPTOP" || deviceType === "DESKTOP") && (
                <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
                  <div className="px-1 mb-3 flex items-center gap-2">
                    <MonitorSmartphone size={16} className="text-[var(--color-growth-green)]" />
                    <h3 className="text-sm font-bold text-[var(--text-main)]">Software & Network</h3>
                  </div>
                  <div className="px-[10px] space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Operating System</label>
                        <Controller
                          name="operatingSystem"
                          control={control}
                          render={({ field }) => (
                            <SuggestionInput
                              {...field}
                              suggestions={OS_SUGGESTIONS}
                              placeholder="e.g. Windows 11 / macOS"
                              className="bg-[var(--bg)] border-[var(--border-color)]/50"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">OS Version</label>
                        <Controller
                          name="osVersion"
                          control={control}
                          render={({ field }) => (
                            <SuggestionInput
                              {...field}
                              suggestions={OS_VERSION_SUGGESTIONS}
                              placeholder="e.g. 23H2, Sonoma 14.2"
                              className="bg-[var(--bg)] border-[var(--border-color)]/50"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <Controller
                        name="domainJoined"
                        control={control}
                        render={({ field }) => (
                          <ToggleSwitch
                            label="Domain Joined"
                            description="Connect device to corporate network Active Directory domain."
                            checked={!!field.value}
                            onChange={field.onChange}
                            size="sm"
                            className="!py-2"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}


              {/* ── Status & Condition ── */}
              <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
                <div className="px-1 mb-3 flex items-center gap-2">
                  <ClipboardList size={16} className="text-[var(--color-growth-green)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Status & Condition</h3>
                </div>
                <div className="px-[10px] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Status</label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <DropdownReverseList
                            options={STATUS_OPTIONS}
                            value={field.value ?? "AVAILABLE"}
                            onChange={field.onChange}
                            className="w-full"
                            panelClassName="bg-[var(--bg)]"
                          />
                        )}
                      />
                      {errors.status && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.status.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Condition</label>
                      <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                          <SuggestionInput
                            {...field}
                            suggestions={CONDITION_SUGGESTIONS}
                            placeholder="e.g. Excellent / Good"
                            className="bg-[var(--bg)] border-[var(--border-color)]/50"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Issue Description (If any)</label>
                    <textarea
                      {...register("issueDescription")}
                      className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-lg focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20 text-[11px] text-[var(--text-main)] placeholder:text-[var(--text-muted)] placeholder:text-[11px] transition-all duration-200 min-h-[80px] resize-none"
                      placeholder="Describe physical or technical issues here..."
                    />
                  </div>
                </div>
              </div>

              {/* ── Asset Image ── */}
              <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
                <div className="px-1 mb-3 flex items-center gap-2">
                  <ImagePlus size={16} className="text-[var(--color-growth-green)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Asset Image</h3>
                </div>

                <div className="px-2">
                  {imagePreview ? (
                    /* ── Preview card ── */
                    <div className="relative group rounded-xl overflow-hidden border border-[var(--border-color)]/40 bg-[var(--surface-hover)]/20">
                      <img
                        src={getSafeImageUrl(imagePreview)}
                        alt="Asset preview"
                        className="w-full h-48 object-contain bg-[var(--surface-hover)]/10"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold rounded-full hover:bg-white/20 transition-all"
                        >
                          <UploadCloud size={14} />
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 text-xs font-semibold rounded-full hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                      {/* File name badge */}
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-[10px] font-medium truncate">
                          {selectedFile instanceof File ? selectedFile.name : "Optimized Selection"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* ── Drop zone ── */
                    <div
                      {...dragProps}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                    relative flex flex-col items-center justify-center gap-3 rounded-xl
                    border-2 border-dashed cursor-pointer transition-all duration-200
                    py-10 px-6 select-none
                    ${isDragging
                          ? "border-[var(--color-growth-green)] bg-[var(--color-growth-green)]/5 scale-[1.01]"
                          : "border-[var(--border-color)]/50 bg-[var(--surface-hover)]/10 hover:border-[var(--color-growth-green)]/60 hover:bg-[var(--color-growth-green)]/5"
                        }
                  `}
                    >
                      {/* Animated icon */}
                      <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200
                    ${isDragging
                          ? "bg-[var(--color-growth-green)]/20 text-[var(--color-growth-green)] scale-110"
                          : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                        }
                  `}>
                        <UploadCloud size={26} strokeWidth={1.5} className={isDragging ? "animate-bounce" : ""} />
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-semibold text-[var(--text-main)]">
                          Drop your image here, or{" "}
                          <span className="text-[var(--color-growth-green)] underline underline-offset-2 cursor-pointer">
                            browse
                          </span>
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-1">
                          Supports: JPG, JPEG2000, PNG · Max 5 MB · One image only
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/jp2"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

            </>
          )}

          {errorMsg && <Message variant="error">{errorMsg}</Message>}

          {successMsg && <Message variant="success">{successMsg}</Message>}

          <div className="pt-2 flex items-center justify-end gap-3 translate-y-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-8 h-10 text-sm font-bold transition-all border-opacity-30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-auto min-w-[160px] h-10 gap-2 px-8 py-2 text-sm font-bold bg-[var(--color-growth-green)] text-black border-0 transition-all rounded-full shadow-[0_2px_8px_var(--btn-primary-shadow)] hover:shadow-[0_4px_14px_var(--btn-primary-shadow)] hover:brightness-110 transform active:scale-95 flex items-center justify-center"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Create Asset
            </Button>
          </div>
        </form>

        {pendingCropImage && (
          <ImageCropper
            image={pendingCropImage}
            onCropComplete={handleCropComplete}
            onCancel={() => setPendingCropImage(null)}
            aspect={4 / 3}
          />
        )}
      </div>
    </Modal>
  );
}
