import sqlite3

DB = "compras.db"

def connect():
    return sqlite3.connect(DB, check_same_thread=False)

def init_db():
    con = connect()
    cur = con.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS productos(
            codigo TEXT PRIMARY KEY,
            nombre TEXT,
            piezas INTEGER DEFAULT 0
        )
    """)
    con.commit()
    con.close()

def guardar_producto(codigo, nombre, piezas):
    con = connect()
    cur = con.cursor()
    cur.execute(
        "INSERT OR REPLACE INTO productos VALUES (?,?,?)",
        (codigo, nombre, piezas)
    )
    con.commit()
    con.close()

def buscar_codigo(codigo):
    con = connect()
    cur = con.cursor()
    cur.execute(
        "SELECT nombre,piezas FROM productos WHERE codigo=?",
        (codigo,)
    )
    r = cur.fetchone()
    con.close()
    return r

def buscar_nombre(nombre):
    con = connect()
    cur = con.cursor()
    cur.execute(
        "SELECT codigo,nombre,piezas FROM productos WHERE nombre LIKE ?",
        (f"%{nombre}%",)
    )
    r = cur.fetchall()
    con.close()
    return r
