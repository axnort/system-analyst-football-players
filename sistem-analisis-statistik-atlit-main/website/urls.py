from flask import Blueprint, render_template, request, redirect, url_for, abort
from .players import BASE_DIR, PlayerRepository
import csv
from .klasemen import KlasemenRepository

urls = Blueprint("urls", __name__)

CSV_FILE_CLUB_PIN = BASE_DIR / "database" / "club_pin.csv"
ADMIN_COMPARE_PIN = "2222"   # PIN admin

# ========= Helper =========
def load_club_pins() -> dict:
    """Baca club_pin.csv -> dict {Club: Pin}"""
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


# ========= Routes =========

@urls.route("/", methods=["GET"])
def home():
    return render_template("index.html")


# Redirect halaman /players lama ke /clubs (panel klub)
@urls.route("/players", methods=["GET"])
def fetch():
    return redirect(url_for("urls.clubs"))


@urls.route("/player/<string:name>", methods=["GET"])
def get(name):
    data = PlayerRepository.find_by_name(name)
    if not data:
        abort(404)
    return render_template(
        "player.html",
        player=data["player"],
        next=data["next"],
        prev=data["prev"]
    )


@urls.route("/compare", methods=["GET"])
def compare():
    player1 = request.args.get("player1")
    player2 = request.args.get("player2")

    if not player1 or not player2:
        return render_template("compare.html", player1=None, player2=None)

    p1 = PlayerRepository.find_by_name(player1)["player"]
    p2 = PlayerRepository.find_by_name(player2)["player"]

    return render_template(
        "compare.html",
        player1=p1, player2=p2,
        next1=PlayerRepository.find_by_name(player1)["next"],
        prev1=PlayerRepository.find_by_name(player1)["prev"],
        next2=PlayerRepository.find_by_name(player2)["next"],
        prev2=PlayerRepository.find_by_name(player2)["prev"]
    )


# ========= Auth PIN =========

@urls.route("/auth_pin/<string:name>", methods=["GET"])
def auth_pin(name):
    data = PlayerRepository.find_by_name(name)
    if not data:
        abort(404)
    return render_template("auth_pin.html", player=data["player"])


@urls.route("/auth_check/<string:name>", methods=["POST"])
def auth_check(name):
    club = request.form.get("club")
    pin = request.form.get("pin")

    club_pins = load_club_pins()
    if club in club_pins and club_pins[club] == pin:
        return redirect(url_for("urls.get", name=name))

    data = PlayerRepository.find_by_name(name)
    return render_template(
        "auth_pin.html",
        player=data["player"],
        message="Invalid PIN"
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

    clubs_all = PlayerRepository.load_clubs()
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
        ku_selected=ku
    )


@urls.route("/players/club/<slug>")
def club_players(slug: str):
    ku = request.args.get("ku", "KU8")   # pertahankan KU

    players = []
    for p in PlayerRepository.load_all():
        slug_p = p.Club.strip().lower().replace(" ", "-")
        if slug_p == slug.lower() and (ku == "ALL" or p.Category == ku):
            players.append(p)

    return render_template(
        "players.html",
        datas={"players": players},
        ku_selected=ku,
        club=slug
    )
    
@urls.route("/auth_club/<slug>", methods=["GET", "POST"])
def auth_club(slug):
    ku = request.args.get("ku", "KU8")  # default KU8

    if request.method == "POST":
        pin = (request.form.get("pin") or "").strip()

        # ambil daftar pin klub dari CSV
        club_pins = load_club_pins()

        # cari nama klub asli dari slug
        club_name = slug.replace("-", " ").title()
        if club_name in club_pins and club_pins[club_name] == pin:
            # kalau PIN benar → redirect ke daftar pemain klub
            return redirect(url_for("urls.club_players", slug=slug, ku=ku))
        else:
            return render_template(
                "auth_pin.html",
                club_slug=slug,
                ku=ku,
                message="Invalid PIN"
            )

    # GET → tampilkan form PIN
    return render_template("auth_pin.html", club_slug=slug, ku=ku)

@urls.route("/klasemen")
def page_klasemen():
    ku = request.args.get("category")  # mis: KU10 (opsional)
    grouped = KlasemenRepository.grouped(ku)  # dict: {"KU10 GRUP A": [KlasemenRow,...], ...}
    return render_template("klasemen.html", datas={"grouped": grouped}, category=ku)
