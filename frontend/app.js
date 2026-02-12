// 🔥 CAMBIA ESTO POR TU URL DE RENDER
const API_URL = "https://papeleria-app.onrender.com";

// ===============================
// 🎥 ESCANER QR / CÓDIGO DE BARRAS
// ===============================
function iniciarEscaner() {
  const html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      html5QrCode.start(
        devices[0].id,
        {
          fps: 10,
          qrbox: 250
        },
        codigo => {
          document.getElementById("codigo").value = codigo;
          html5QrCode.stop();
        }
      );
    }
  }).catch(err => {
    console.log("Error cámara:", err);
  });
}

iniciarEscaner();


// ===============================
// 💾 GUARDAR PRODUCTO
// ===============================
function guardar() {
  const codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("nombre").value;
  const piezas = document.getElementById("piezas").value;

  if (!nombre || !piezas) {
    alert("Completa nombre y piezas");
    return;
  }

  fetch(`${API_URL}/faltantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo,
      nombre,
      piezas
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Guardado correctamente");
    limpiarCampos();
    verFaltantes();
  })
  .catch(err => {
    alert("❌ Error al guardar");
    console.log(err);
  });
}


// ===============================
// 📦 VER FALTANTES
// ===============================
function verFaltantes() {
  fetch(`${API_URL}/faltantes`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista");
      lista.innerHTML = "";

      data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${item.nombre}</strong><br>
          Código: ${item.codigo || "N/A"}<br>
          Piezas: ${item.piezas}
        `;
        lista.appendChild(li);
      });
    })
    .catch(err => {
      console.log("Error:", err);
    });
}


// ===============================
// 🔎 BUSCAR POR CÓDIGO
// ===============================
function buscarCodigo() {
  const codigo = document.getElementById("codigo").value;

  if (!codigo) {
    alert("Escribe un código");
    return;
  }

  fetch(`${API_URL}/faltantes`)
    .then(res => res.json())
    .then(data => {
      const encontrado = data.find(p => p.codigo === codigo);

      if (encontrado) {
        document.getElementById("nombre").value = encontrado.nombre;
        document.getElementById("piezas").value = encontrado.piezas;
      } else {
        alert("Producto no encontrado");
      }
    });
}


// ===============================
// 🔍 BUSCAR POR NOMBRE
// ===============================
function buscarNombre(texto) {
  fetch(`${API_URL}/faltantes`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista");
      lista.innerHTML = "";

      const filtrados = data.filter(item =>
        item.nombre.toLowerCase().includes(texto.toLowerCase())
      );

      filtrados.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${item.nombre}</strong><br>
          Código: ${item.codigo || "N/A"}<br>
          Piezas: ${item.piezas}
        `;
        lista.appendChild(li);
      });
    });
}


// ===============================
// 🌙 MODO OSCURO
// ===============================
function toggleTheme() {
  document.body.classList.toggle("dark");
}


// ===============================
// 🧹 LIMPIAR CAMPOS
// ===============================
function limpiarCampos() {
  document.getElementById("codigo").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("piezas").value = "";
}


// Cargar lista al abrir
verFaltantes();
