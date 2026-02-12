from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

# ==========================
# CONFIGURAR CORS
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# RUTA CORRECTA DE BASE DE DATOS
# ==========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "productos.db")


# ==========================
# CREAR TABLA AUTOMÁTICAMENTE
# ==========================
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


# ⚠️ ESTA LÍNEA ES CLAVE
init_db()


def get_db():
    return sqlite3.connect(DB_PATH, check_same_thread=False)


# ==========================
# RUTAS
# ==========================

@app.get("/")
def home():
    return {"status": "API Papelería OK"}


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
