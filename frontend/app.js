// 🔥 URL DE TU BACKEND EN RENDER
const API_URL = "https://papeleria-app-vf6w.onrender.com";


// ===============================
// 🎥 ESCANER QR / CÓDIGO DE BARRAS
// ===============================
let html5QrCode;

function iniciarEscaner() {
  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {

      // 🔎 Buscar cámara trasera automáticamente
      let backCamera = devices.find(device =>
        device.label.toLowerCase().includes("back") ||
        device.label.toLowerCase().includes("rear") ||
        device.label.toLowerCase().includes("environment")
      );

      const cameraId = backCamera 
        ? backCamera.id 
        : devices[devices.length - 1].id;

      html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250
        },
        codigo => {
          document.getElementById("codigo").value = codigo;
          html5QrCode.stop();
        },
        error => {}
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
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({
      codigo: codigo || null,
      nombre: nombre,
      piezas: Number(piezas)
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Error servidor");
    }
    return res.json();
  })
  .then(data => {
    alert("✅ Guardado correctamente");
    limpiarCampos();
    verFaltantes();
    iniciarEscaner(); // reinicia cámara después de guardar
  })
  .catch(err => {
    console.log("ERROR REAL:", err);
    alert("❌ Error al guardar. Revisa conexión o servidor.");
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
    })
    .catch(err => {
      console.log("Error búsqueda:", err);
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
    })
    .catch(err => {
      console.log("Error búsqueda nombre:", err);
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


// ===============================
// 🚀 CARGAR LISTA AL ABRIR
// ===============================
verFaltantes();
