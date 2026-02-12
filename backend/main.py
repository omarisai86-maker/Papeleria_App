from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

# ==========================
# CORS (permite conexión desde tu frontend)
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# BASE DE DATOS
# ==========================
DB_PATH = os.path.join(os.getcwd(), "productos.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS productos (
            codigo TEXT PRIMARY KEY,
            nombre TEXT,
            piezas INTEGER
        )
    """)
    conn.commit()
    conn.close()

init_db()

def get_db():
    return sqlite3.connect(DB_PATH, check_same_thread=False)

# ==========================
# RUTA PRINCIPAL
# ==========================
@app.get("/")
def home():
    return {"status": "API Papelería OK"}

# ==========================
# BUSCAR POR CÓDIGO
# ==========================
@app.get("/buscar_codigo/{codigo}")
def buscar_codigo(codigo: str):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT codigo, nombre, piezas FROM productos WHERE codigo = ?",
        (codigo,)
    )
    r = c.fetchone()
    conn.close()

    if r:
        return {"codigo": r[0], "nombre": r[1], "piezas": r[2]}
    return {}

# ==========================
# BUSCAR POR NOMBRE
# ==========================
@app.get("/buscar_nombre/{texto}")
def buscar_nombre(texto: str):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT codigo, nombre, piezas FROM productos WHERE nombre LIKE ?",
        (f"%{texto}%",)
    )
    rows = c.fetchall()
    conn.close()

    return [
        {"codigo": r[0], "nombre": r[1], "piezas": r[2]}
        for r in rows
    ]

# ==========================
# GUARDAR PRODUCTO
# ==========================
@app.post("/guardar")
def guardar(p: dict):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT OR REPLACE INTO productos (codigo, nombre, piezas)
        VALUES (?, ?, ?)
    """, (p["codigo"], p["nombre"], p["piezas"]))
    conn.commit()
    conn.close()

    return {"ok": True}

# ==========================
# LISTA DE FALTANTES
# ==========================
@app.get("/faltantes")
def faltantes():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT codigo, nombre, piezas
        FROM productos
        WHERE piezas <= 5
        ORDER BY piezas ASC
    """)
    rows = c.fetchall()
    conn.close()

    return [
        {"codigo": r[0], "nombre": r[1], "piezas": r[2]}
        for r in rows
    ]
