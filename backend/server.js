import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let modoManual = false;

const nodos = {
  nodo1: {
    id: "nodo1",
    nombre: "Nodo 1 - Puente Centro",
    lat: 18.8121,
    lng: -98.9543,
    nivelAgua: 1.8,
    estado: "Normal",
    siguiente: "Servidor Ciudad",
    historial: []
  },
  nodo2: {
    id: "nodo2",
    nombre: "Nodo 2 - Zona Agrícola",
    lat: 18.8217,
    lng: -98.9689,
    nivelAgua: 2.1,
    estado: "Normal",
    siguiente: "nodo1",
    historial: []
  },
  nodo3: {
    id: "nodo3",
    nombre: "Nodo 3 - Río Alto",
    lat: 18.8364,
    lng: -98.9822,
    nivelAgua: 2.4,
    estado: "Normal",
    siguiente: "nodo2",
    historial: []
  }
};

const alertas = [];

function calcularEstado(nivelAgua) {
  if (nivelAgua > 4.0) return "Critico";
  if (nivelAgua >= 3.0) return "Precaucion";
  return "Normal";
}

function obtenerRutaMultiHop(nodoInicialId) {
  const ruta = [];
  let actual = nodoInicialId;

  while (actual && actual !== "Servidor Ciudad") {
    const nodo = nodos[actual];

    if (!nodo) break;

    ruta.push(nodo.nombre.split(" - ")[0]);
    actual = nodo.siguiente;
  }

  ruta.push("Servidor");
  return ruta;
}

function agregarHistorial(nodo) {
  nodo.historial.push({
    tiempo: new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }),
    nivel: nodo.nivelAgua
  });

  if (nodo.historial.length > 16) {
    nodo.historial.shift();
  }
}

function registrarAlerta(nodo, origen = "Automático") {
  const ultimaAlerta = alertas[0];

  const alertaDuplicadaReciente =
    ultimaAlerta &&
    ultimaAlerta.nodoId === nodo.id &&
    Date.now() - ultimaAlerta.timestamp < 8000;

  if (alertaDuplicadaReciente) return;

  const nuevaAlerta = {
    id: crypto.randomUUID(),
    nodoId: nodo.id,
    nodoNombre: nodo.nombre,
    nivelAgua: nodo.nivelAgua,
    estado: nodo.estado,
    origen,
    mensaje: `ALERTA CRÍTICA: ${nodo.nombre} detectó nivel de agua de ${nodo.nivelAgua}m.`,
    timestamp: Date.now(),
    fecha: new Date().toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "medium"
    })
  };

  alertas.unshift(nuevaAlerta);

  if (alertas.length > 30) {
    alertas.pop();
  }
}

function actualizarNodo(nodoId, nuevoNivel, origen = "Automático") {
  const nodo = nodos[nodoId];

  if (!nodo) return null;

  nodo.nivelAgua = Number(nuevoNivel.toFixed(2));
  nodo.estado = calcularEstado(nodo.nivelAgua);

  agregarHistorial(nodo);

  const ruta = obtenerRutaMultiHop(nodo.id);

  console.log(`🌊 ${nodo.nombre}`);
  console.log(`   Nivel de agua: ${nodo.nivelAgua}m`);
  console.log(`   Estado: ${nodo.estado}`);
  console.log(`   Origen: ${origen}`);
  console.log(`   Ruta de saltos por Radio LoRa: ${ruta.join(" ➡️ ")}`);

  if (nodo.estado === "Critico") {
    console.log("   🚨 Umbral crítico superado. Registrando alerta.");
    registrarAlerta(nodo, origen);
  }

  return nodo;
}

function generarNivelAleatorio(nivelActual) {
  const variacion = Number((Math.random() * 1.1 - 0.45).toFixed(2));
  let nuevoNivel = nivelActual + variacion;

  if (Math.random() < 0.12) {
    nuevoNivel += Number((Math.random() * 1.2).toFixed(2));
  }

  return Math.max(0.5, Math.min(nuevoNivel, 5.8));
}

function simularLecturaSensores() {
  if (modoManual) {
    console.log("\n🕹️ Simulación automática pausada: modo manual activo.");
    return;
  }

  console.log("\n==============================");
  console.log("📡 Nueva ronda automática RiverWatch Mesh");
  console.log("==============================");

  Object.values(nodos).forEach((nodo) => {
    const nuevoNivel = generarNivelAleatorio(nodo.nivelAgua);
    actualizarNodo(nodo.id, nuevoNivel, "Automático");
  });
}

setInterval(simularLecturaSensores, 4000);

Object.values(nodos).forEach((nodo) => {
  agregarHistorial(nodo);
});

app.get("/", (req, res) => {
  res.json({
    sistema: "RiverWatch Mesh",
    descripcion: "Sistema de Alerta Temprana ante Inundaciones",
    endpoints: [
      "GET /api/nodos",
      "GET /api/alertas",
      "POST /api/nodos/:id/nivel",
      "POST /api/modo"
    ]
  });
});

app.get("/api/nodos", (req, res) => {
  res.json({
    actualizado: new Date().toISOString(),
    modoManual,
    topologia: "Nodo 3 -> Nodo 2 -> Nodo 1 -> Servidor Ciudad",
    nodos: Object.values(nodos)
  });
});

app.get("/api/alertas", (req, res) => {
  res.json({
    total: alertas.length,
    alertas
  });
});

app.post("/api/modo", (req, res) => {
  const { manual } = req.body;

  modoManual = Boolean(manual);

  res.json({
    ok: true,
    modoManual,
    mensaje: modoManual
      ? "Modo manual activado. El simulador automático está pausado."
      : "Modo automático activado."
  });
});

app.post("/api/nodos/:id/nivel", (req, res) => {
  const { id } = req.params;
  const { nivelAgua } = req.body;

  if (!nodos[id]) {
    return res.status(404).json({
      ok: false,
      mensaje: "Nodo no encontrado"
    });
  }

  const nivel = Number(nivelAgua);

  if (Number.isNaN(nivel) || nivel < 0 || nivel > 6) {
    return res.status(400).json({
      ok: false,
      mensaje: "El nivel debe ser un número entre 0 y 6 metros"
    });
  }

  modoManual = true;

  const nodoActualizado = actualizarNodo(id, nivel, "Manual");

  res.json({
    ok: true,
    modoManual,
    nodo: nodoActualizado
  });
});

app.post("/api/reset", (req, res) => {
  alertas.length = 0;

  nodos.nodo1.nivelAgua = 1.8;
  nodos.nodo2.nivelAgua = 2.1;
  nodos.nodo3.nivelAgua = 2.4;

  Object.values(nodos).forEach((nodo) => {
    nodo.estado = calcularEstado(nodo.nivelAgua);
    nodo.historial = [];
    agregarHistorial(nodo);
  });

  modoManual = false;

  res.json({
    ok: true,
    mensaje: "Sistema reiniciado",
    modoManual,
    nodos: Object.values(nodos)
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend RiverWatch Mesh corriendo en http://localhost:${PORT}`);
});