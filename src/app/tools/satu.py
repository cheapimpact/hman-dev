import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import pandas as pd
import requests
import json
import threading
import concurrent.futures
 


# ==============================================================================
# 🎨 KELAS APLIKASI GUI UTAMA
# ==============================================================================

class ApiMultiToolApp:
    def __init__(self, root):
        self.root = root
        self.root.title("API Multi-Tool Kemenkeu")
        self.root.geometry("800x800")

        # Style
        self.style = ttk.Style(self.root)
        self.style.theme_use('clam')

        # --- Main Layout ---
        # 1. Frame untuk Token (bersama)
        token_frame = ttk.LabelFrame(self.root, text="⚙️ Pengaturan Umum", padding="10")
        token_frame.pack(fill=tk.X, padx=10, pady=5)
        self.create_token_widgets(token_frame)

        # 2. Notebook untuk Tabs
        self.notebook = ttk.Notebook(self.root, padding="5")
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10)

        # 3. Konsol Output (bersama)
        output_frame = ttk.LabelFrame(self.root, text="📜 Konsol Output", padding="10")
        output_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        self.output_console = scrolledtext.ScrolledText(output_frame, wrap=tk.WORD, state="disabled", height=15)
        self.output_console.pack(fill=tk.BOTH, expand=True)

        # --- Membuat Setiap Tab ---
        self.create_nip_tab()
        self.create_personal_group_tab()
        self.create_unit_group_tab()

    def create_token_widgets(self, parent):
        """Membuat widget untuk input Bearer Token."""
        ttk.Label(parent, text="Bearer Token API:").pack(side=tk.LEFT, padx=5)
        self.token_text = tk.Text(parent, height=4, width=80)
        self.token_text.pack(fill=tk.X, expand=True, padx=5)

    # ==========================================================================
    #  TAB 1: GET INFO BY NIP
    # ==========================================================================
    def create_nip_tab(self):
        tab1 = ttk.Frame(self.notebook, padding="10")
        self.notebook.add(tab1, text="1. Get Info by NIP")

        # --- Widgets ---
        frame_file = ttk.Frame(tab1)
        frame_file.pack(fill=tk.X, pady=5)
        ttk.Label(frame_file, text="File Excel (isi NIP):").pack(side=tk.LEFT, padx=5)
        self.nip_input_path = tk.StringVar()
        ttk.Entry(frame_file, textvariable=self.nip_input_path, state="readonly", width=60).pack(side=tk.LEFT,
                                                                                                 fill=tk.X, expand=True)
        ttk.Button(frame_file, text="Browse...", command=lambda: self.browse_file(self.nip_input_path)).pack(
            side=tk.LEFT, padx=5)

        self.nip_progress = ttk.Progressbar(tab1, orient="horizontal", length=100, mode="determinate")
        self.nip_progress.pack(fill=tk.X, pady=10)

        self.nip_submit_button = ttk.Button(tab1, text="🚀 Mulai Proses & Simpan Hasil",
                                            command=self.start_nip_process_thread)
        self.nip_submit_button.pack(pady=10, ipady=5)

    def start_nip_process_thread(self):
        """Memvalidasi dan memulai proses Get NIP di thread terpisah."""
        token = self.token_text.get("1.0", tk.END).strip()
        input_file = self.nip_input_path.get()

        if not token or not input_file:
            messagebox.showwarning("Input Tidak Lengkap",
                                   "Mohon isi Bearer Token dan pilih File Excel terlebih dahulu.")
            return

        output_file = filedialog.asksaveasfilename(
            title="Simpan Hasil Sebagai...",
            filetypes=(("Excel Files", "*.xlsx"), ("All files", "*.*")),
            defaultextension=".xlsx"
        )
        if not output_file:
            self.log_to_console("⚠️ Proses dibatalkan karena tidak memilih lokasi file output.")
            return

        self.nip_submit_button.config(state="disabled", text="Memproses...")
        self.nip_progress["value"] = 0

        thread = threading.Thread(
            target=self.run_nip_process,
            args=(token, input_file, output_file)
        )
        thread.start()

    def run_nip_process(self, BEARER, input_file, output_file):
        """Fungsi worker yang menjalankan logika Get NIP."""
        try:
            self.log_to_console("\n--- [TAB 1] Memulai Proses Get Info by NIP ---")

            # --- Baca File Excel ---
            try:
                df = pd.read_excel(input_file)
                if 'NIP' not in df.columns:
                    messagebox.showerror("Error Kolom", "Kolom 'NIP' tidak ditemukan di file Excel.")
                    self.log_to_console("❌ ERROR: Kolom 'NIP' tidak ditemukan.")
                    return
                self.log_to_console(f"✅ File '{input_file}' berhasil dibaca.")
            except Exception as e:
                messagebox.showerror("Error Membaca File", f"Gagal membaca file Excel: {e}")
                self.log_to_console(f"❌ ERROR saat membaca file: {e}")
                return

            list_nip = df['NIP'].astype(str).tolist()
            self.nip_progress["maximum"] = len(list_nip)
            self.log_to_console(f"Ditemukan {len(list_nip)} NIP untuk diproses.")

            hasil_api = []

            # --- Definisikan Headers API ---
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0',
                'Accept': 'application/json, text/plain, */*',
                'Authorization': BEARER,
                'x-Gateway-APIKey': '8dd3f3bf-425b-4ab5-a9d6-0ae8212c8fc0',
                'Origin': 'https://satu.kemenkeu.go.id',
                'Referer': 'https://satu.kemenkeu.go.id/',
            }
            processed_count = 0
            with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
                future_to_nip = {executor.submit(self.get_info_pegawai_logic, nip, headers): nip for nip in list_nip}
                for future in concurrent.futures.as_completed(future_to_nip):
                    hasil_api.append(future.result())
                    processed_count += 1
                    # self.log_to_console(f"Processed_count {processed_count} NIP sudah diproses.")
                    self.update_progress(self.nip_progress, processed_count)

            kolom_baru = [
                'ID Pegawai', 'Nama', 'NIP', 'Pangkat', 'Golongan', 'Es. 1',
                'Es. 2', 'Es. 3', 'Es. 4', 'Kode Organisasi', 'Kode Induk Organisasi', 'Kode Satker'
            ]
            result_df = pd.DataFrame(hasil_api, columns=kolom_baru)

            # --- PERUBAHAN 2: Simpan DataFrame baru ke file output ---
            result_df.to_excel(output_file, index=False)
            self.log_to_console(f"✅ SUKSES! Hasil telah disimpan ke file '{output_file}'")
            messagebox.showinfo("Sukses", f"Proses selesai! Hasil disimpan di:\n{output_file}")


        except Exception as e:
            self.log_to_console(f"❌ Terjadi error tak terduga: {e}")
            messagebox.showerror("Error", f"Terjadi kesalahan selama proses: {e}")
        finally:
            self.log_to_console("--- [TAB 1] Proses Selesai ---")
            self.nip_submit_button.config(state="normal", text="🚀 Mulai Proses & Simpan Hasil")

    def get_info_pegawai_logic(self, nip, headers):

        self.log_to_console(f"\n--- [NIP {nip}] Memulai Proses")
        """Logika inti untuk mengambil info satu pegawai (diadaptasi dari skrip)."""
        placeholder = 'Tidak Ditemukan'
        error_tuple = (placeholder,) * 12
        search_url = "https://service.kemenkeu.go.id/hris2/profil/api/Profile/GetAllPegawai"
        search_params = {'page': 1, 'pageSize': 1, 'select': 'idPegawai,nip18', 'Filters': f'nama|nip18@=*{nip}'}
        try:
            response_search = requests.get(search_url, params=search_params, headers=headers, timeout=15)
            if response_search.status_code == 200:
                data = response_search.json()
                if data and data.get('data'):
                    pegawai = data['data'][0]
                    id_pegawai = pegawai.get('idPegawai')
                    nip_hasil = pegawai.get('nip18', 'NIP Tdk Ada')

                    if not id_pegawai:
                        return ('ID Tdk Ada', '', nip_hasil, '', '', '', '', '', '', '', '', '')

                    profil_url = f"https://service.kemenkeu.go.id/hris2/profil/api/Profile/GetBasicProfilById/{id_pegawai}"
                    response_profil = requests.get(profil_url, headers=headers, timeout=15)

                    if response_profil.status_code == 200:
                        profil_data = response_profil.json()
                        data = profil_data.get('data', {})
                        print(profil_data)
                        jabatan_list = data.get('jabatan', [])
                        nama = data.get('nama', '')
                        kode_satker = data.get('kdSatker', '')
                        golongan = profil_data.get('golongan', '')
                        nama_pangkat = data.get('pangkat', {}).get('namaPangkat')
                        kode_golongan = data.get('pangkat', {}).get('kodeGolongan')
                        pangkat = f'{nama_pangkat} - {kode_golongan}'
                        if jabatan_list:
                            jabatan = jabatan_list[0]
                            self.log_to_console(f"\n--- [NIP {nip_hasil}] Memulai Proses")
                            return (
                                id_pegawai, nama, nip_hasil, pangkat, golongan,
                                jabatan.get('esl1', ''), jabatan.get('esl2', ''),
                                jabatan.get('esl3', ''), jabatan.get('esl4', ''),
                                jabatan.get('kodeOrganisasi', ''), jabatan.get('kodeIndukOrganisasi', ''),kode_satker
                            )
                        else:
                            return (
                            id_pegawai, nama, nip_hasil, pangkat, golongan, 'Jabatan Tdk Ada', '', '', '', '', '', '')
                    else:
                        return (id_pegawai, nama, nip_hasil, f'Err Profil: {response_profil.status_code}', '', '', '', '', '', '', '', '')
                else:
                    return error_tuple
            elif response_search.status_code == 401:
                self.log_to_console(f"Detail Koneksi Error: Token Kedaluwarsa")
                return ('Token Kedaluwarsa', 'Token Kedaluwarsa', 'Error 401', '', '', '', '', '', '', '', '', '')
            else:
                self.log_to_console(f"Detail Koneksi Error: {response_search.status_code}")
                return (f'Err Search: {response_search.status_code}', '', '', '', '', '', '', '', '', '', '', '')
        except requests.exceptions.RequestException as e:
            self.log_to_console(f"Detail Koneksi Error: {e}")
            return ('Error Koneksi', '', '', '', '', '', '', '', '', '', '', '')

    # ==========================================================================
    # TAB 2: POST GROUP PERSONAL
    # ==========================================================================
    def create_personal_group_tab(self):
        tab2 = ttk.Frame(self.notebook, padding="10")
        self.notebook.add(tab2, text="2. Post Group Personal")

        # --- Widgets ---
        frame_file = ttk.Frame(tab2)
        frame_file.pack(fill=tk.X, pady=5)
        ttk.Label(frame_file, text="File Excel (ID Pegawai):").pack(side=tk.LEFT, padx=5)
        self.personal_input_path = tk.StringVar()
        ttk.Entry(frame_file, textvariable=self.personal_input_path, state="readonly", width=60).pack(side=tk.LEFT,
                                                                                                      fill=tk.X,
                                                                                                      expand=True)
        ttk.Button(frame_file, text="Browse...", command=lambda: self.browse_file(self.personal_input_path)).pack(
            side=tk.LEFT, padx=5)

        frame_group = ttk.Frame(tab2)
        frame_group.pack(fill=tk.X, pady=5)
        ttk.Label(frame_group, text="Nama Grup:").pack(side=tk.LEFT, padx=5)
        self.personal_group_name = tk.StringVar()
        ttk.Entry(frame_group, textvariable=self.personal_group_name, width=60).pack(side=tk.LEFT, fill=tk.X,
                                                                                     expand=True)

        self.personal_submit_button = ttk.Button(tab2, text="🚀 Kirim Data Grup Personal",
                                                 command=self.start_personal_group_thread)
        self.personal_submit_button.pack(pady=20, ipady=5)

    def start_personal_group_thread(self):
        self.start_generic_post_thread(
            tab_name="Personal",
            token=self.token_text.get("1.0", tk.END).strip(),
            input_file=self.personal_input_path.get(),
            group_name=self.personal_group_name.get(),
            submit_button=self.personal_submit_button,
            column_name="ID Pegawai",
            api_url='https://service.kemenkeu.go.id/nadine-web/gateway/Rekam/GroupingPersonal',
            payload_key="IdsPegawai",
            data_type="int"
        )

    # ==========================================================================
    # TAB 3: POST GROUP KANTOR (UNIT)
    # ==========================================================================
    def create_unit_group_tab(self):
        tab3 = ttk.Frame(self.notebook, padding="10")
        self.notebook.add(tab3, text="3. Post Group Kantor")

        # --- Widgets ---
        frame_file = ttk.Frame(tab3)
        frame_file.pack(fill=tk.X, pady=5)
        ttk.Label(frame_file, text="File Excel (IDORG):").pack(side=tk.LEFT, padx=5)
        self.unit_input_path = tk.StringVar()
        ttk.Entry(frame_file, textvariable=self.unit_input_path, state="readonly", width=60).pack(side=tk.LEFT,
                                                                                                  fill=tk.X,
                                                                                                  expand=True)
        ttk.Button(frame_file, text="Browse...", command=lambda: self.browse_file(self.unit_input_path)).pack(
            side=tk.LEFT, padx=5)

        frame_group = ttk.Frame(tab3)
        frame_group.pack(fill=tk.X, pady=5)
        ttk.Label(frame_group, text="Nama Grup:").pack(side=tk.LEFT, padx=5)
        self.unit_group_name = tk.StringVar()
        ttk.Entry(frame_group, textvariable=self.unit_group_name, width=60).pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.unit_submit_button = ttk.Button(tab3, text="🚀 Kirim Data Grup Kantor",
                                             command=self.start_unit_group_thread)
        self.unit_submit_button.pack(pady=20, ipady=5)

    def start_unit_group_thread(self):
        self.start_generic_post_thread(
            tab_name="Kantor",
            token=self.token_text.get("1.0", tk.END).strip(),
            input_file=self.unit_input_path.get(),
            group_name=self.unit_group_name.get(),
            submit_button=self.unit_submit_button,
            column_name="IDORG",
            api_url='https://service.kemenkeu.go.id/nadine-web/gateway/Rekam/GroupingUnits',
            payload_key="KodeOrgs",
            data_type="str"
        )

    # ==========================================================================
    # FUNGSI GENERIC & HELPERS (untuk Tab 2 & 3)
    # ==========================================================================

    def start_generic_post_thread(self, **kwargs):
        """Fungsi generic untuk memulai proses POST (Tab 2 & 3)."""
        if not kwargs['token'] or not kwargs['input_file'] or not kwargs['group_name']:
            messagebox.showwarning("Input Tidak Lengkap", "Mohon isi Token, Nama Grup, dan pilih File Excel.")
            return

        kwargs['submit_button'].config(state="disabled", text="Mengirim...")

        thread = threading.Thread(target=self.run_generic_post_process, kwargs=kwargs)
        thread.start()

    def run_generic_post_process(self, tab_name, token, input_file, group_name, submit_button, column_name, api_url,
                                 payload_key, data_type):
        """Fungsi worker generic untuk proses POST."""
        try:
            self.log_to_console(f"\n--- [TAB {tab_name}] Memulai Proses Post Group ---")

            # 1. Baca data dari Excel
            try:
                dtype_map = {column_name: str}  # Baca sebagai string dulu
                df = pd.read_excel(input_file, dtype=dtype_map)
                if column_name not in df.columns:
                    messagebox.showerror("Error Kolom", f"Kolom '{column_name}' tidak ditemukan.")
                    self.log_to_console(f"❌ ERROR: Kolom '{column_name}' tidak ditemukan.")
                    return None

                # Konversi data sesuai tipe yang dibutuhkan
                if data_type == "int":
                    id_list = pd.to_numeric(df[column_name].dropna(), errors='coerce').dropna().astype(int).tolist()
                else:  # str
                    id_list = df[column_name].dropna().astype(str).tolist()

                if not id_list:
                    messagebox.showwarning("Data Kosong",
                                           "Tidak ada data valid yang ditemukan di kolom yang ditentukan.")
                    self.log_to_console("⚠️ Peringatan: Tidak ada data valid yang ditemukan di file Excel.")
                    return

                self.log_to_console(f"✅ Berhasil membaca {len(id_list)} data dari '{input_file}'.")
            except Exception as e:
                messagebox.showerror("Error Membaca File", f"Gagal membaca file Excel: {e}")
                self.log_to_console(f"❌ ERROR saat membaca file: {e}")
                return

            # 2. Kirim ke API
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0',
                'Accept': 'application/json, text/plain, */*',
                'Authorization': token,
                'roleId': '5', 'unitId': '17086', 'lat': '-6.2053671', 'long': '106.876853',
                'Content-Type': 'application/json', 'Origin': 'https://satu.kemenkeu.go.id',
                'Connection': 'keep-alive', 'Referer': 'https://satu.kemenkeu.go.id/',
            }
            payload = {"Nama": group_name, payload_key: id_list}
            self.log_to_console(f"🚀 Mengirim data untuk grup '{group_name}' dengan {len(id_list)} item...")

            response = requests.post(api_url, headers=headers, data=json.dumps(payload), timeout=30)

            if response.status_code in [200, 201]:
                self.log_to_console("✅ SUKSES! Data berhasil dikirim.")
                self.log_to_console("Respon dari server:\n" + json.dumps(response.json(), indent=2))
                messagebox.showinfo("Sukses", f"Grup '{group_name}' berhasil dikirim!")
            else:
                self.log_to_console(f"❌ GAGAL! Status Code: {response.status_code}")
                self.log_to_console(f"Detail error: {response.text}")
                messagebox.showerror("Gagal",
                                     f"Server merespon dengan error {response.status_code}.\nCek konsol untuk detail.")

        except requests.exceptions.RequestException as e:
            self.log_to_console(f"❌ ERROR Koneksi: {e}")
            messagebox.showerror("Error Koneksi", f"Gagal terhubung ke server: {e}")
        except Exception as e:
            self.log_to_console(f"❌ Terjadi error tak terduga: {e}")
            messagebox.showerror("Error", f"Terjadi kesalahan: {e}")
        finally:
            self.log_to_console(f"--- [TAB {tab_name}] Proses Selesai ---")
            original_text = "🚀 Kirim Data Grup " + ("Personal" if tab_name == "Personal" else "Kantor")
            submit_button.config(state="normal", text=original_text)

    # ==========================================================================
    # FUNGSI UTILITAS GUI
    # ==========================================================================
    def browse_file(self, string_var):
        """Membuka dialog untuk memilih file Excel."""
        file_path = filedialog.askopenfilename(
            title="Pilih File Excel",
            filetypes=(("Excel Files", "*.xlsx"), ("All files", "*.*"))
        )
        if file_path:
            string_var.set(file_path)
            self.log_to_console(f"File dipilih: {file_path}")

    def log_to_console(self, message):
        """Menulis pesan ke konsol output di GUI."""
        self.root.after(0, self._log_to_console_thread_safe, message)

    def _log_to_console_thread_safe(self, message):
        self.output_console.config(state="normal")
        self.output_console.insert(tk.END, message)
        self.output_console.config(state="disabled")
        self.output_console.see(tk.END)

    def update_progress(self, progress_bar, value):
        """Memperbarui progress bar dari thread lain."""
        self.root.after(0, self._update_progress_thread_safe, progress_bar, value)

    def _update_progress_thread_safe(self, progress_bar, value):
        progress_bar["value"] = value


# ==============================================================================
# ENTRY POINT APLIKASI
# ==============================================================================
if __name__ == "__main__":
    root = tk.Tk()
    app = ApiMultiToolApp(root)
    root.mainloop()