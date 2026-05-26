import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/*
  Topología Multi-hop:
  Nodo 3 -> Nodo 2 -> Nodo 1 -> Servidor Ciudad
*/

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

function generarNivelAnteriorConVariacion(nivelActual) {
  const variacion = Number((Math.random() * 1.2 - 0.45).toFixed(2));
  let nuevoNivel = nivelActual + variacion;

  if (Math.random() < 0.15) {
    nuevoNivel += Number((Math.random() * 1.4).toFixed(2));
  }

  nuevoNivel = Math.max(0.6, Math.min(nuevoNivel, 5.8));

  return Number(nuevoNivel.toFixed(2));
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

function registrarAlerta(nodo) {
  const ultimaAlerta = alertas[0];

  const alertaDuplicadaReciente =
    ultimaAlerta &&
    ultimaAlerta.nodoId === nodo.id &&
    Date.now() - ultimaAlerta.timestamp < 12000;

  if (alertaDuplicadaReciente) return;

  const nuevaAlerta = {
    id: crypto.randomUUID(),
    nodoId: nodo.id,
    nodoNombre: nodo.nombre,
    nivelAgua: nodo.nivelAgua,
    estado: nodo.estado,
    mensaje: `ALERTA CRÍTICA: ${nodo.nombre} detectó nivel de agua de ${nodo.nivelAgua}m. Evacuación preventiva recomendada.`,
    timestamp: Date.now(),
    fecha: new Date().toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "medium"
    })
  };

  alertas.unshift(nuevaAlerta);

  if (alertas.length > 20) {
    alertas.pop();
  }
}

function simularLecturaSensores() {
  console.log("\n==============================");
  console.log("📡 Nueva ronda de telemetría RiverWatch Mesh");
  console.log("==============================");

  Object.values(nodos).forEach((nodo) => {
    nodo.nivelAgua = generarNivelAnteriorConVariacion(nodo.nivelAgua);
    nodo.estado = calcularEstado(nodo.nivelAgua);

    const puntoHistorial = {
      tiempo: new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
      nivel: nodo.nivelAgua
    };

    nodo.historial.push(puntoHistorial);

    if (nodo.historial.length > 12) {
      nodo.historial.shift();
    }

    const ruta = obtenerRutaMultiHop(nodo.id);

    console.log(`🌊 ${nodo.nombre}`);
    console.log(`   Nivel de agua: ${nodo.nivelAgua}m`);
    console.log(`   Estado: ${nodo.estado}`);
    console.log(`   Ruta de saltos por Radio LoRa: ${ruta.join(" ➡️ ")}`);

    if (nodo.estado === "Critico") {
      console.log("   🚨 Umbral crítico superado. Registrando alerta.");
      registrarAlerta(nodo);
    }
  });
}

setInterval(simularLecturaSensores, 4000);
simularLecturaSensores();

app.get("/", (req, res) => {
  res.json({
    sistema: "RiverWatch Mesh",
    descripcion: "Sistema de Alerta Temprana ante Inundaciones",
    endpoints: ["/api/nodos", "/api/alertas"]
  });
});

app.get("/api/nodos", (req, res) => {
  res.json({
    actualizado: new Date().toISOString(),
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

app.listen(PORT, () => {
  console.log(`Backend RiverWatch Mesh corriendo en http://localhost:${PORT}`);
});