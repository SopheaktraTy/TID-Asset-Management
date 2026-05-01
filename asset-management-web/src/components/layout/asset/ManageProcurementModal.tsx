import React from "react";
import { Loader2, ShoppingBag, Calendar, Store, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { 
  procurementSchema, 
  type ProcurementFormValues, 
  type ProcurementResponse 
} from "../../../types/procurement.types";
import { 
  createAssetProcurementApi, 
  updateAssetProcurementApi 
} from "../../../services/procurement.service";
import { useTheme } from "../../../hooks/useTheme";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface ManageProcurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (procurement: ProcurementResponse) => void;
  assetId: number;
  initialData?: ProcurementResponse | null;
}

export default function ManageProcurementModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  assetId,
  initialData 
}: ManageProcurementModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProcurementFormValues>({
    resolver: zodResolver(procurementSchema) as any,
    defaultValues: {
      purchaseDate: initialData?.purchaseDate || "",
      purchaseVendor: initialData?.purchaseVendor || "",
      purchaseCost: initialData?.purchaseCost || 0,
      warrantyExpiryDate: initialData?.warrantyExpiryDate || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        purchaseDate: initialData?.purchaseDate || "",
        purchaseVendor: initialData?.purchaseVendor || "",
        purchaseCost: initialData?.purchaseCost || 0,
        warrantyExpiryDate: initialData?.warrantyExpiryDate || "",
      });
      setErrorMsg(null);
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: ProcurementFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let result;
      if (initialData) {
        result = await updateAssetProcurementApi(assetId, data);
      } else {
        result = await createAssetProcurementApi(assetId, data);
      }
      onSuccess(result);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to save procurement data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[500px]"
    >
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="w-full flex items-center justify-center mb-6 pt-1">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">
              {initialData ? "Edit Procurement" : "Add Procurement"}
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              financial record
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          {/* Purchase & Warranty Details Group */}
          <div className="border border-[var(--border-color)]/30 rounded-2xl p-5 bg-[var(--surface-hover)]/5 space-y-4">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag size={16} className="text-[var(--color-growth-green)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Purchase & Warranty</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                  Vendor / Supplier *
                </label>
                <Input
                  leftIcon={<Store size={15} />}
                  placeholder="e.g. Dell Official Store"
                  className="bg-[var(--bg)] border-[var(--border-color)]/50 h-11"
                  {...register("purchaseVendor")}
                />
                {errors.purchaseVendor && <p className="mt-1.5 text-[10px] text-red-500 ml-1 font-bold">{errors.purchaseVendor.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                    Purchase Date *
                  </label>
                  <Input
                    rightIcon={<Calendar size={15} />}
                    type="date"
                    className="bg-[var(--bg)] border-[var(--border-color)]/50 h-11 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                    {...register("purchaseDate")}
                    onClick={(e) => {
                      try { e.currentTarget.showPicker(); } catch (err) {}
                    }}
                  />
                  {errors.purchaseDate && <p className="mt-1.5 text-[10px] text-red-500 ml-1 font-bold">{errors.purchaseDate.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                    Cost (USD) *
                  </label>
                  <Input
                    leftIcon={<CreditCard size={15} />}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-[var(--bg)] border-[var(--border-color)]/50 h-11"
                    {...register("purchaseCost")}
                  />
                  {errors.purchaseCost && <p className="mt-1.5 text-[10px] text-red-500 ml-1 font-bold">{errors.purchaseCost.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                  Warranty Expiry Date *
                </label>
                <Input
                  rightIcon={<Calendar size={15} />}
                  type="date"
                  className="bg-[var(--bg)] border-[var(--border-color)]/50 h-11 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                  {...register("warrantyExpiryDate")}
                  onClick={(e) => {
                    try { e.currentTarget.showPicker(); } catch (err) {}
                  }}
                />
                {errors.warrantyExpiryDate && <p className="mt-1.5 text-[10px] text-red-500 ml-1 font-bold">{errors.warrantyExpiryDate.message}</p>}
              </div>
            </div>
          </div>

          {errorMsg && <Message variant="error">{errorMsg}</Message>}

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-8 h-11 text-sm font-bold transition-all border-opacity-30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-auto min-w-[160px] h-11 gap-2 px-8 py-2 text-sm font-bold bg-[var(--color-growth-green)] text-black border-0 transition-all rounded-full shadow-lg shadow-[var(--color-growth-green)]/10 hover:brightness-110 active:scale-95 flex items-center justify-center"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {initialData ? "Update Record" : "Save Record"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
