import os
import sqlite3
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))


def get_db():
    database_path = os.getenv("DATABASE_PATH")

    if not database_path:
        raise RuntimeError("DATABASE_PATH is not configured.")

    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")

    return conn
