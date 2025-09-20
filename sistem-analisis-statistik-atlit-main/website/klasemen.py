# klasemen.py
import csv
from dataclasses import dataclass
from typing import Dict, List, Optional
from pathlib import Path

# Lokasi file CSV
BASE_DIR = Path(__file__).resolve().parent
CSV_KLASEMEN = BASE_DIR / "database" / "klasemen_dummy.csv"
CSV_KLASEMEN.parent.mkdir(parents=True, exist_ok=True)


@dataclass
class KlasemenRow:
    Category: str
    Grup: str
    Club: str
    TotalMain: int
    Menang: int
    Seri: int
    Kalah: int
    GolMasuk: int
    GolKebobolan: int
    SelisihGol: int
    Poin: int


class KlasemenRepository:
    @staticmethod
    def _to_int(v) -> int:
        try:
            return int(str(v).strip())
        except Exception:
            return 0

    @staticmethod
    def _get(row: dict, *keys: str, default: str = "") -> str:
        """Ambil value row untuk salah satu nama kolom (fallback beberapa alias)."""
        for k in keys:
            if k in row and row[k] not in (None, ""):
                return str(row[k]).strip()
        return default

    @staticmethod
    def load_rows() -> List[KlasemenRow]:
        """
        Baca semua baris klasemen dari CSV.
        Header yang didukung:
        Category, Grup, Club, TotalMain, Menang, Seri, Kalah,
        GolMasuk, GolKebobolan, SelisihGol, Poin
        """
        rows: List[KlasemenRow] = []

        if not CSV_KLASEMEN.exists():
            # Buat file kosong dengan header agar tidak error saat pertama kali
            with CSV_KLASEMEN.open("w", newline="", encoding="utf-8-sig") as f:
                writer = csv.writer(f)
                writer.writerow([
                    "Category", "Grup", "Club", "TotalMain", "Menang", "Seri", "Kalah",
                    "GolMasuk", "GolKebobolan", "SelisihGol", "Poin"
                ])
            return rows

        with CSV_KLASEMEN.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for r in reader:
                # Ambil string (fallback kalau user ganti nama kolom)
                category = KlasemenRepository._get(r, "Category", "Kategori", default="UNKNOWN")
                grup     = KlasemenRepository._get(r, "Grup", "Group", default="-")
                club     = KlasemenRepository._get(r, "Club", "Tim", default="")

                # Ambil angka
                to_int = KlasemenRepository._to_int
                rows.append(KlasemenRow(
                    Category   = category,
                    Grup       = grup,
                    Club       = club,
                    TotalMain  = to_int(r.get("TotalMain")),
                    Menang     = to_int(r.get("Menang")),
                    Seri       = to_int(r.get("Seri")),
                    Kalah      = to_int(r.get("Kalah")),
                    GolMasuk   = to_int(r.get("GolMasuk")),
                    GolKebobolan = to_int(r.get("GolKebobolan")),
                    SelisihGol = to_int(r.get("SelisihGol")),
                    Poin       = to_int(r.get("Poin")),
                ))

        return rows

    @staticmethod
    def _sort_key(row: KlasemenRow):
        """Urutan: Poin desc, SelisihGol desc, GolMasuk desc, Club asc."""
        return (-row.Poin, -row.SelisihGol, -row.GolMasuk, row.Club.lower())

    @staticmethod
    def grouped(category: Optional[str] = None) -> Dict[str, List[KlasemenRow]]:
        """
        Kelompokkan data per Category+Grup.
        - Jika category diisi (mis. 'KU10'), hanya kembalikan grup untuk kategori itu.
        - Key dict: 'KU10 GRUP A', 'KU10 GRUP B', dst.
        """
        data = KlasemenRepository.load_rows()

        # Filter kategori jika diminta
        if category:
            data = [r for r in data if (r.Category or "").strip().upper() == category.strip().upper()]

        # Group
        grouped: Dict[str, List[KlasemenRow]] = {}
        for r in data:
            label = f"{(r.Category or '').strip().upper()} GRUP {(r.Grup or '').strip().upper()}"
            grouped.setdefault(label, []).append(r)

        # Sort tiap grup
        for key in list(grouped.keys()):
            grouped[key] = sorted(grouped[key], key=KlasemenRepository._sort_key)

        # Optional: urutkan dictionary berdasarkan nama grup
        # (misal: A, B, C ...), tetap mempertahankan urutan predictable.
        ordered = dict(sorted(grouped.items(), key=lambda kv: kv[0]))
        return ordered
