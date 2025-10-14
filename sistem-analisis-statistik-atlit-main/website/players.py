import csv
from dataclasses import dataclass, asdict
from typing import List, Optional
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CSV_FILE = BASE_DIR / "database" / "players_dummy.csv"
CSV_FILE_MATCH = BASE_DIR / "database" / "match_stat.csv"
CSV_FILE.parent.mkdir(parents=True, exist_ok=True)
CSV_FILE_CLUB_PIN = BASE_DIR / "database" / "club_pin.csv"


@dataclass
class Player:
    Name: str
    Category: str            # KU8 / KU12 / dst
    Photo: str
    Attacking: int
    Vision: int
    Speed: int
    Physical: int
    Defending: int
    Mental: int
    Aerial: int
    Technical: int
    Club: str
    LogoClub: str
    Position: str
    DateOfBirth: str
    Height: int
    Weight: int
    Acceleration: int
    Agility: int
    Balance: int
    JumpingReach: int
    NaturalFitness: int
    Pace: int
    Stamina: int
    Strength: int
    GoalkeeperAbility: int
    ConditionPct: int
    PreferredFoot: str
    Dribbling: int
    Passing: int
    Corners: int
    Crossing: int
    FirstTouch: int
    Finishing: int
    PenaltyTaking: int
    FreeKickTaking: int
    LongShots: int
    LongThrows: int
    Heading: int
    Marking: int
    Trackling: int            # (tetap) fallback dari Tackling saat baca CSV
    Technique: int
    Aggression: int
    Anticipation: int
    Bravery: int
    Composure: int
    Concentration: int
    Decisions: int
    Determination: int
    Flair: int
    Leadership: int
    OffTheBall: int
    Teamwork: int
    Vision2: int
    WorkRate: int
    Matches: int
    Goals: int
    Assists: int
    Shots: int
    OnTarget: int             # dukung juga kolom ShotsOnTarget
    Passes: int
    Completed: int            # dukung juga kolom PassesCompleted
    Saves: int
    Fouls: int
    Cards: int
    Tackles: int
    MatchRating: int


class PlayerRepository:
    @staticmethod
    def _fieldnames():
        return list(Player.__annotations__.keys())

    @staticmethod
    def _to_int(v):
        try:
            return int(v)
        except Exception:
            return 0

    @staticmethod
    def load_all() -> List[Player]:
        players: List[Player] = []

        # buat file dengan header jika belum ada
        if not CSV_FILE.exists():
            with CSV_FILE.open("w", newline="", encoding="utf-8-sig") as f:
                csv.DictWriter(f, fieldnames=PlayerRepository._fieldnames()).writeheader()
            return players

        # siapkan (opsional) data match
        match_rows: List[dict] = []
        if CSV_FILE_MATCH.is_file():
            with CSV_FILE_MATCH.open(newline="", encoding="utf-8-sig") as m:
                match_rows = list(csv.DictReader(m))
        elif CSV_FILE_MATCH.is_dir():
            import glob
            for path in sorted(glob.glob(str(CSV_FILE_MATCH / "*.csv"))):
                with open(path, newline="", encoding="utf-8-sig") as m:
                    match_rows.extend(list(csv.DictReader(m)))

        to_int = PlayerRepository._to_int

        with CSV_FILE.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row.get("Name"):
                    continue

                p = Player(
                    Name=row.get("Name", ""),
                    Category=row.get("Category", "ALL"),
                    Photo=row.get("Photo", ""),
                    Attacking=to_int(row.get("Attacking", 0)),
                    Vision=to_int(row.get("Vision", 0)),
                    Speed=to_int(row.get("Speed", 0)),
                    Physical=to_int(row.get("Physical", 0)),
                    Defending=to_int(row.get("Defending", 0)),
                    Mental=to_int(row.get("Mental", 0)),
                    Aerial=to_int(row.get("Aerial", 0)),
                    Technical=to_int(row.get("Technical", 0)),
                    Club=row.get("Club", ""),
                    LogoClub=row.get("LogoClub", ""),
                    Position=to_int(row.get("Position", 0)),
                    DateOfBirth=row.get("DateOfBirth", ""),
                    Height=to_int(row.get("Height", 0)),
                    Weight=to_int(row.get("Weight", 0)),
                    Acceleration=to_int(row.get("Acceleration", 0)),
                    Agility=to_int(row.get("Agility", 0)),
                    Balance=to_int(row.get("Balance", 0)),
                    JumpingReach=to_int(row.get("JumpingReach", 0)),
                    NaturalFitness=to_int(row.get("NaturalFitness", 0)),
                    Pace=to_int(row.get("Pace", 0)),
                    Stamina=to_int(row.get("Stamina", 0)),
                    Strength=to_int(row.get("Strength", 0)),
                    GoalkeeperAbility=to_int(row.get("GoalkeeperAbility", 0)),
                    ConditionPct=to_int(row.get("ConditionPct", 0)),
                    PreferredFoot=row.get("PreferredFoot", ""),
                    Dribbling=to_int(row.get("Dribbling", 0)),
                    Passing=to_int(row.get("Passing", 0)),
                    Corners=to_int(row.get("Corners", 0)),
                    Crossing=to_int(row.get("Crossing", 0)),
                    FirstTouch=to_int(row.get("FirstTouch", 0)),
                    Finishing=to_int(row.get("Finishing", 0)),
                    PenaltyTaking=to_int(row.get("PenaltyTaking", 0)),
                    FreeKickTaking=to_int(row.get("FreeKickTaking", 0)),
                    LongShots=to_int(row.get("LongShots", 0)),
                    LongThrows=to_int(row.get("LongThrows", 0)),
                    Heading=to_int(row.get("Heading", 0)),
                    Marking=to_int(row.get("Marking", 0)),
                    Trackling=to_int(row.get("Trackling", row.get("Tackling", 0))),  # fallback "Tackling"
                    Technique=to_int(row.get("Technique", 0)),
                    Aggression=to_int(row.get("Aggression", 0)),
                    Anticipation=to_int(row.get("Anticipation", 0)),
                    Bravery=to_int(row.get("Bravery", 0)),
                    Composure=to_int(row.get("Composure", 0)),
                    Concentration=to_int(row.get("Concentration", 0)),
                    Decisions=to_int(row.get("Decisions", 0)),
                    Determination=to_int(row.get("Determination", 0)),
                    Flair=to_int(row.get("Flair", 0)),
                    Leadership=to_int(row.get("Leadership", 0)),
                    OffTheBall=to_int(row.get("OffTheBall", 0)),
                    Teamwork=to_int(row.get("Teamwork", 0)),
                    Vision2=to_int(row.get("Vision2", 0)),
                    WorkRate=to_int(row.get("WorkRate", 0)),
                    Matches=to_int(row.get("Matches", 0)),
                    Goals=to_int(row.get("Goals", 0)),
                    Assists=to_int(row.get("Assists", 0)),
                    Shots=to_int(row.get("Shots", 0)),
                    OnTarget=to_int(row.get("OnTarget", row.get("ShotsOnTarget", 0))),        # <- dukung 2 nama
                    Passes=to_int(row.get("Passes", 0)),
                    Completed=to_int(row.get("Completed", row.get("PassesCompleted", 0))),    # <- dukung 2 nama
                    Saves=to_int(row.get("Saves", 0)),
                    Fouls=to_int(row.get("Fouls", 0)),
                    Cards=to_int(row.get("Cards", 0)),
                    Tackles=to_int(row.get("Tackles", 0)),
                    MatchRating=to_int(row.get("MatchRating", 0)),
                )

                # === isi p.matches (opsional) ===
                p.matches = []
                name = (p.Name or "").strip().lower()
                for mr in match_rows:
                    if (mr.get("Name") or "").strip().lower() != name:
                        continue
                    p.matches.append({
                        "Match":       mr.get("Match", ""),
                        "Goals":       to_int(mr.get("Goals")),
                        "Assists":     to_int(mr.get("Assists")),
                        "Shots":       to_int(mr.get("Shots")),
                        "OnTarget":    to_int(mr.get("OnTarget", mr.get("ShotsOnTarget", 0))),
                        "Passes":      to_int(mr.get("Passes")),
                        "Completed":   to_int(mr.get("Completed", mr.get("PassesCompleted", 0))),
                        "Saves":       to_int(mr.get("Saves")),
                        "Fouls":       to_int(mr.get("Fouls")),
                        "Cards":       to_int(mr.get("Cards")),
                        "Tackles":     to_int(mr.get("Tackles")),
                        "MatchRating": to_int(mr.get("MatchRating")),
                    })

                players.append(p)

        return players

    @staticmethod
    def save_all(players: List[Player]) -> None:
        with CSV_FILE.open("w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=PlayerRepository._fieldnames())
            writer.writeheader()
            for player in players:
                writer.writerow(asdict(player))

    @staticmethod
    def add(player: Player) -> None:
        players = PlayerRepository.load_all()
        players.append(player)
        PlayerRepository.save_all(players)

    @staticmethod
    def find_by_name(name: str) -> Optional[Player]:
        players = PlayerRepository.load_all()
        next_player = None
        prev_player = None
        for i, p in enumerate(players):
            if p.Name.lower() == name.lower():
                next_player = players[i + 1] if i + 1 < len(players) else None
                prev_player = players[i - 1] if i - 1 >= 0 else None
                return {"player": p, "next": next_player, "prev": prev_player}
        return None

    @staticmethod
    def update(name: str, new_data: dict) -> bool:
        players = PlayerRepository.load_all()
        updated = False
        for i, p in enumerate(players):
            if p.Name.lower() == name.lower():
                for key, value in new_data.items():
                    if hasattr(p, key):
                        setattr(p, key, value)
                players[i] = p
                updated = True
                break
        if updated:
            PlayerRepository.save_all(players)
        return updated

    @staticmethod
    def delete(name: str) -> bool:
        players = PlayerRepository.load_all()
        new_players = [p for p in players if p.Name.lower() != name.lower()]
        if len(new_players) != len(players):
            PlayerRepository.save_all(new_players)
            return True
        return False

    @staticmethod
    def paginate(page: int, per_page: int):
        players = PlayerRepository.load_all()
        start = (page - 1) * per_page
        end = start + per_page
        next_ = end < len(players)
        prev_ = start > 0
        return {
            "players": players[start:end],
            "next": next_,
            "prev": prev_,
            "page": page,
            "per_page": per_page,
            "next_page": page + 1 if next_ else None,
            "prev_page": page - 1 if prev_ else None,
            "total": len(players),
        }

    @staticmethod
    def load_clubs():
        """Kembalikan daftar unik klub dengan kategori & logo (dari photo pertama yang ditemukan)."""
        clubs = {}
        for p in PlayerRepository.load_all():
            key = (p.Club.strip(), p.Category.strip())
            if not key[0]:
                continue
            if key not in clubs:
                clubs[key] = {
                    "Name": p.Club.strip(),
                    "Category": p.Category.strip(),
                    "Logo": p.LogoClub or "",
                    "slug": p.Club.strip().lower().replace(" ", "-"),
                }
        return list(clubs.values())
