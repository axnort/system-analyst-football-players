import sys
import os

# Tambahkan path project agar bisa diimport
project_home = os.path.dirname(__file__)
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import create_app() dari project kamu
from website import create_app

# Passenger mencari variabel ini:
application = create_app()
