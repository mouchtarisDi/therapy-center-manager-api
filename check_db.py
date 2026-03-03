from sqlalchemy import text
from app.db.session import engine

with engine.connect() as conn:
    tables = conn.execute(
        text("""
        SELECT tablename
        FROM pg_catalog.pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename;
        """)
    ).fetchall()

print("Tables:", [t[0] for t in tables])