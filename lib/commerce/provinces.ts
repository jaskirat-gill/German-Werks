export type Province = {
  code: string;
  name: string;
  percentage: number;
  displayName: string;
  taxType: "gst" | "hst" | "sales_tax";
};

export const PROVINCES: Province[] = [
  { code: "AB", name: "Alberta", percentage: 5, displayName: "GST", taxType: "gst" },
  { code: "BC", name: "British Columbia", percentage: 12, displayName: "GST + PST", taxType: "sales_tax" },
  { code: "MB", name: "Manitoba", percentage: 12, displayName: "GST + PST", taxType: "sales_tax" },
  { code: "NB", name: "New Brunswick", percentage: 15, displayName: "HST", taxType: "hst" },
  { code: "NL", name: "Newfoundland and Labrador", percentage: 15, displayName: "HST", taxType: "hst" },
  { code: "NS", name: "Nova Scotia", percentage: 14, displayName: "HST", taxType: "hst" },
  { code: "NT", name: "Northwest Territories", percentage: 5, displayName: "GST", taxType: "gst" },
  { code: "NU", name: "Nunavut", percentage: 5, displayName: "GST", taxType: "gst" },
  { code: "ON", name: "Ontario", percentage: 13, displayName: "HST", taxType: "hst" },
  { code: "PE", name: "Prince Edward Island", percentage: 15, displayName: "HST", taxType: "hst" },
  { code: "QC", name: "Quebec", percentage: 14.975, displayName: "GST + QST", taxType: "sales_tax" },
  { code: "SK", name: "Saskatchewan", percentage: 11, displayName: "GST + PST", taxType: "sales_tax" },
  { code: "YT", name: "Yukon", percentage: 5, displayName: "GST", taxType: "gst" },
];

export const findProvince = (code: unknown) =>
  PROVINCES.find((province) => province.code === code);
