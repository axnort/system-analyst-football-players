# topskor.py
import csv
from dataclasses import dataclass
from typing import List, Dict
from .players import BASE_DIR  # ikut struktur kamu

CSV_FILE_TOPSKOR = BASE_DIR / "database" / "top_skor.csv"

@dataclass
class TopScorer:
    Name: str
    Category: str
    Score: int
    Photo: str  # bisa URL absolut (http/https) atau nama file relatif

class TopSkorRepository:
    @staticmethod
    def _to_int(v) -> int:
        try:
            return int(v)
        except Exception:
            return 0

    @staticmethod
    def load_all() -> List[TopScorer]:
        """
        Baca CSV: Category,Name,Photo,Score -> list TopScorer
        (CSV kamu memang menyertakan kolom Photo)
        """
        rows: List[TopScorer] = []
        if not CSV_FILE_TOPSKOR.exists():
            return rows
        with CSV_FILE_TOPSKOR.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for r in reader:
                name  = (r.get("Name") or "").strip()
                cat   = (r.get("Category") or "").strip()
                photo = (r.get("Photo") or "").strip()
                if not name or not cat:
                    continue
                score = TopSkorRepository._to_int(r.get("Score", 0))
                rows.append(TopScorer(Name=name, Category=cat, Score=score, Photo=photo))
        return rows

    @staticmethod
    def categories() -> List[str]:
        cats = sorted({r.Category for r in TopSkorRepository.load_all()})
        return cats or ["KU8", "KU12"]

    @staticmethod
    def by_category_aggregated(category: str) -> List[Dict]:
        """
        Agregasi per pemain untuk KU tertentu:
        - jumlahkan Score jika pemain muncul berkali-kali
        - simpan Photo (pakai yang pertama non-kosong)
        - urut desc by Score, tie-break Name asc
        - tambahkan Rank (1..n)
        """
        data = [r for r in TopSkorRepository.load_all() if r.Category == category]

        agg: Dict[str, Dict] = {}
        for r in data:
            if r.Name not in agg:
                agg[r.Name] = {"Name": r.Name, "Score": 0, "Photo": r.Photo}
            agg[r.Name]["Score"] += r.Score
            # jika photo belum ada/ kosong, ambil yang non-kosong
            if not agg[r.Name]["Photo"] and r.Photo:
                agg[r.Name]["Photo"] = r.Photo

        items = list(agg.values())
        items.sort(key=lambda x: (-x["Score"], x["Name"]))
        for i, it in enumerate(items, start=1):
            it["Rank"] = i
        return items
