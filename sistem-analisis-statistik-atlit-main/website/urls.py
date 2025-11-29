from flask import Blueprint, render_template, request, redirect, url_for, abort
import csv

from .players import BASE_DIR, PlayerRepository
from .klasemen import KlasemenRepository
from .topskor import TopSkorRepository

urls = Blueprint("urls", __name__)

CSV_FILE_CLUB_PIN = BASE_DIR / "database" / "club_pin.csv"
ADMIN_COMPARE_PIN = "2222"  # PIN admin


# ========= Helper =========
def load_club_pins() -> dict:
    """Baca club_pin.csv -> dict {Club: Pin}."""
    pins = {}
    if CSV_FILE_CLUB_PIN.exists():
        with CSV_FILE_CLUB_PIN.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                club = (row.get("Club") or "").strip()
                pin = (row.get("Pin") or "").strip()
                if club:
                    pins[club] = pin
    return pins


def selected_gender() -> str:
    """Ambil gender dari query/form dengan default putra."""
    return (request.args.get("gender") or request.form.get("gender") or "putra").strip().lower() or "putra"


def resolve_player(name: str, gender_hint: str | None = None):
    """Cari pemain berdasarkan nama dan gender opsional dengan fallback lintas gender."""
    if not name:
        return None, None, None, None

    if gender_hint:
        data = PlayerRepository.find_by_name(name, gender=gender_hint)
        if data:
            return data["player"], data.get("next"), data.get("prev"), gender_hint

    data_any = PlayerRepository.find_by_name_any(name)
    if data_any:
        return (
            data_any.get("player"),
            data_any.get("next"),
            data_any.get("prev"),
            data_any.get("gender"),
        )
    return None, None, None, None


# ========= Routes =========
@urls.route("/", methods=["GET"])
def home():
    return render_template("index.html")


# Redirect halaman /players lama ke /clubs (panel klub)
@urls.route("/players", methods=["GET"])
def fetch():
    gender = selected_gender()
    return redirect(url_for("urls.clubs", gender=gender))


@urls.route("/player/<string:name>", methods=["GET"])
def get(name):
    gender = selected_gender()
    player, next_p, prev_p, gender = resolve_player(name, gender)
    if not player:
        abort(404)
    return render_template(
        "player.html",
        player=player,
        next=next_p,
        prev=prev_p,
        gender_selected=gender,
    )


@urls.route("/compare", methods=["GET"])
def compare():
    p1_name = request.args.get("player1")
    p2_name = request.args.get("player2")

    player1, next1, prev1, gender1 = resolve_player(p1_name, request.args.get("gender1"))
    player2, next2, prev2, gender2 = resolve_player(p2_name, request.args.get("gender2"))

    error = None
    if p1_name and not player1:
        error = f"Pemain '{p1_name}' tidak ditemukan."
    elif p2_name and not player2:
        error = f"Pemain '{p2_name}' tidak ditemukan."

    return render_template(
        "compare.html",
        player1=player1,
        player2=player2,
        next1=next1,
        prev1=prev1,
        next2=next2,
        prev2=prev2,
        gender1=gender1,
        gender2=gender2,
        error=error,
    )


# ========= Auth PIN =========
@urls.route("/auth_pin/<string:name>", methods=["GET"])
def auth_pin(name):
    gender = selected_gender()
    player, _, _, gender = resolve_player(name, gender)
    if not player:
        abort(404)
    return render_template("auth_pin.html", player=player, gender_selected=gender)


@urls.route("/auth_check/<string:name>", methods=["POST"])
def auth_check(name):
    gender = selected_gender()
    club = request.form.get("club")
    pin = (request.form.get("pin") or "").strip()

    club_pins = load_club_pins()
    if club in club_pins and club_pins[club] == pin:
        return redirect(url_for("urls.get", name=name, gender=gender))

    player, _, _, gender = resolve_player(name, gender)
    if not player:
        abort(404)
    return render_template(
        "auth_pin.html",
        player=player,
        gender_selected=gender,
        message="Invalid PIN",
    )


@urls.route("/pin_admin", methods=["GET"])
def pin_admin():
    return render_template("pin_admin.html")


@urls.route("/pin_admin", methods=["POST"])
def pin_admin_check():
    pin = (request.form.get("pin") or "").strip()
    if pin == ADMIN_COMPARE_PIN:
        return redirect(url_for("urls.compare"))
    return render_template("pin_admin.html", message="Invalid PIN")


# ========= Clubs & Players =========
@urls.route("/clubs")
def clubs():
    q = (request.args.get("q", "") or "").lower()
    ku = request.args.get("ku", "KU8")   # default KU8
    gender = selected_gender()

    clubs_all = PlayerRepository.load_clubs(gender=gender)
    # urutkan nama klub A→Z
    clubs_all = sorted(clubs_all, key=lambda c: (c["Name"] or "").lower())

    filtered = []
    for c in clubs_all:
        match_q = (not q) or (q in (c["Name"] or "").lower())
        match_ku = (ku == "ALL") or (c["Category"] == ku)
        if match_q and match_ku:
            filtered.append(c)

    return render_template(
        "clubs.html",
        datas={"clubs": filtered},
        q=q,
        ku_selected=ku,
        gender_selected=gender,
    )


@urls.route("/players/club/<slug>")
def club_players(slug: str):
    ku = request.args.get("ku", "KU8")   # pertahankan KU
    gender = selected_gender()

    players = []
    for p in PlayerRepository.load_all(gender=gender):
        slug_p = p.Club.strip().lower().replace(" ", "-")
        if slug_p == slug.lower() and (ku == "ALL" or p.Category == ku):
            players.append(p)

    return render_template(
        "players.html",
        datas={"players": players},
        ku_selected=ku,
        club=slug,
        gender_selected=gender,
    )


@urls.route("/auth_club/<slug>", methods=["GET", "POST"])
def auth_club(slug):
    ku = request.args.get("ku", "KU8")  # default KU8
    gender = selected_gender()

    if request.method == "POST":
        pin = (request.form.get("pin") or "").strip()

        # ambil daftar pin klub dari CSV
        club_pins = load_club_pins()

        # cari nama klub asli dari slug
        club_name = slug.replace("-", " ").title()
        if club_name in club_pins and club_pins[club_name] == pin:
            # kalau PIN benar → redirect ke daftar pemain klub
            return redirect(url_for("urls.club_players", slug=slug, ku=ku, gender=gender))
        else:
            return render_template(
                "auth_pin.html",
                club_slug=slug,
                ku=ku,
                gender_selected=gender,
                message="Invalid PIN",
            )

    # GET → tampilkan form PIN
    return render_template("auth_pin.html", club_slug=slug, ku=ku, gender_selected=gender)


@urls.route("/klasemen")
def page_klasemen():
    ku = request.args.get("category")  # mis: KU10 (opsional)
    grouped = KlasemenRepository.grouped(ku)  # dict: {"KU10 GRUP A": [KlasemenRow,...], ...}
    return render_template("klasemen.html", datas={"grouped": grouped}, category=ku)


# ========= Top Skor =========
@urls.route("/topskor")
def page_top_skor():
    kus = TopSkorRepository.categories()
    ku = request.args.get("ku") or ("KU8" if "KU8" in kus else kus[0])
    rows = TopSkorRepository.by_category_aggregated(ku)
    return render_template("topskor.html", ku=ku, kus=kus, rows=rows)
