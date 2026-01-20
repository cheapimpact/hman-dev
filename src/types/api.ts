export interface DiklatData {
  ID: number;
  NM_PEGAWAI: string;
  NIP: string;
  NIPA: string;
  KD_DIKLAT: string;
  NM_DIKLAT: string;
  TGL_AWAL: string;
  TGL_AKHIR: string;
  NM_LEMBAGA: string;
  NO_SERTIFIKAT: string;
  TGL_SERTIFIKAT: string;
  JML_JAMLAT: number;
  ID_IDENTIFIKASI: string;
  LINK_SERTIFIKAT: string;
}

export interface DashboardStats {
  totalPeserta: number;
  totalDiklat: number;
  diklatPopuler: { label: string; value: number }[];
  sebaranLembaga: { id: number; label: string; value: number }[];
}
