from sqlalchemy import text
from app.db.session import engine

DDL = """
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS centers CASCADE;

-- alembic version table (will be recreated by migrations)
DROP TABLE IF EXISTS alembic_version CASCADE;

-- drop enum type if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        DROP TYPE role_enum;
    END IF;
END $$;
"""

with engine.connect() as conn:
    conn = conn.execution_options(isolation_level="AUTOCOMMIT")
    conn.execute(text(DDL))

print("✅ Dev DB reset done.")