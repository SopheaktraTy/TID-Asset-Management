import { z } from "zod";

export interface ProcurementResponse {
  id: number;
  assetId: number;
  purchaseDate: string;
  purchaseVendor: string;
  purchaseCost: number;
  warrantyExpiryDate: string;
}

export const procurementBaseSchema = z.object({
  purchaseDate: z.string().min(1, "Purchase date is required"),
  purchaseVendor: z.string().min(1, "Purchase vendor is required").max(255),
  purchaseCost: z.coerce.number().min(0, "Purchase cost must be at least 0"),
  warrantyExpiryDate: z.string().min(1, "Warranty expiry date is required"),
});

export const procurementSchema = procurementBaseSchema.refine((data) => {
  const purchase = new Date(data.purchaseDate);
  const warranty = new Date(data.warrantyExpiryDate);
  return warranty >= purchase;
}, {
  message: "Warranty expiry must be after purchase date",
  path: ["warrantyExpiryDate"],
});

export interface ProcurementFormValues {
  purchaseDate: string;
  purchaseVendor: string;
  purchaseCost: number;
  warrantyExpiryDate: string;
}
