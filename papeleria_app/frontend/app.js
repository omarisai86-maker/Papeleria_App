// ================================
// CONFIGURACIÓN
// ================================
// ⚠️ CAMBIA ESTA URL POR TU BACKEND EN PRODUCCIÓN (HTTPS)
const API = "https://papeleria-app.onrender.com";

// ================================
// ELEMENTOS
// ================================
const codigo = document.getElementById("codigo");
const nombre = document.getElementById("nombre");
const piezas = document.getElementById("piezas");
const lista  = document.getElementById("lista");
const reader = document.getElementById("reader");

// ================================
// ESCÁNER QR / BARRAS (SEGURO)
// ================================
if (reader) {
  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (code) => {
      codigo.value = code;

      try {
        const r = await fetch(`${API}/buscar_codigo/${code}`);
        if (!r.ok) throw new Error("No encontrado");

        const d = await r.json();

        if (d && d.nombre) {
          nombre.value = d.nombre;
          piezas.value = d.piezas;
        } else {
          nombre.value = "";
          piezas.value = 0;
        }
      } catch (err) {
        console.warn("Producto no encontrado");
        nombre.value = "";
        piezas.value = 0;
      }
    }
  ).catch(err => {
    console.error("Error al iniciar cámara:", err);
  });
}

// ================================
// GUARDAR PRODUCTO
// ================================
async function guardar() {
  if (!codigo.value || !nombre.value) {
    alert("⚠️ Completa código y nombre");
    return;
  }

  try {
    await fetch(`${API}/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: codigo.value,
        nombre: nombre.value,
        piezas: parseInt(piezas.value || 0)
      })
    });

    alert("✅ Producto guardado");
    piezas.value = "";
  } catch (err) {
    alert("❌ Error al guardar");
    console.error(err);
  }
}

// ================================
// BUSCAR POR NOMBRE
// ================================
async function buscarNombre(txt) {
  if (!txt) {
    lista.innerHTML = "";
    return;
  }

  try {
    const r = await fetch(`${API}/buscar_nombre/${txt}`);
    if (!r.ok) throw new Error("Error búsqueda");

    const data = await r.json();
    lista.innerHTML = "";

    data.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p[1]} (${p[2]})`;
      li.onclick = () => {
        codigo.value = p[0];
        nombre.value = p[1];
        piezas.value = p[2];
        lista.innerHTML = "";
      };
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Error buscando nombre", err);
  }
}

// ================================
// 🌙 TEMA OSCURO
// ================================
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

// CARGAR TEMA GUARDADO / SISTEMA
(() => {
  const saved = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (saved === "dark" || (!saved && systemDark)) {
    document.body.classList.add("dark");
  }
})();
