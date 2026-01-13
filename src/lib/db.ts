import Database from "better-sqlite3";
import path from "path";

// 1. Tentukan lokasi file database (kantor.db)
const dbPath = path.join(process.cwd(), "hrdata.db");

// 2. Buka koneksi database
const db = new Database(dbPath, { verbose: console.log }); // verbose agar log query muncul di terminal

// 3. Buat Tabel JIKA BELUM ADA (Pengganti Migration)
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS pegawai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nip TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    jabatan TEXT,
    unit TEXT,
    status TEXT DEFAULT 'Aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

db.exec(createTableQuery);

export default db;
