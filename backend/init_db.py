import sqlite3

conn = sqlite3.connect("productos.db")
c = conn.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS productos (
    codigo TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    piezas INTEGER DEFAULT 0
)
""")

conn.commit()
conn.close()

print("Base de datos creada")
