import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import AlertPanel from "./components/AlertPanel.jsx";
import { Activity, RadioTower, ShieldAlert } from "lucide-react";

const API_URL = "http://localhost:3000";

export default function App() {
  const [nodos, setNodos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [actualizado, setActualizado] = useState(null);
  const [error, setError] = useState(null);

  async function cargarDatos() {
    try {
      const [resNodos, resAlertas] = await Promise.all([
        fetch(`${API_URL}/api/nodos`),
        fetch(`${API_URL}/api/alertas`)
      ]);

      if (!resNodos.ok || !resAlertas.ok) {
        throw new Error("No se pudo conectar con el backend");
      }

      const dataNodos = await resNodos.json();
      const dataAlertas = await resAlertas.json();

      setNodos(dataNodos.nodos);
      setAlertas(dataAlertas.alertas);
      setActualizado(dataNodos.actualizado);
      setError(null);
    } catch (err) {
      setError("Backend no disponible. Verifica que Express esté corriendo en el puerto 3000.");
    }
  }

  useEffect(() => {
    cargarDatos();

    const intervalo = setInterval(() => {
      cargarDatos();
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  const nodosCriticos = nodos.filter((nodo) => nodo.estado === "Critico").length;
  const nodosPrecaucion = nodos.filter((nodo) => nodo.estado === "Precaucion").length;

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AlertPanel alerta={alertas[0]} />

        <header className="glass-panel rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                <RadioTower size={18} />
                Red IoT Multi-hop con Telemetría LoRa simulada
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                RiverWatch Mesh
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                Sistema de Alerta Temprana ante Inundaciones con sensores distribuidos,
                retransmisión por saltos y monitoreo ciudadano en tiempo real.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <StatusCard
                icon={<Activity size={22} />}
                label="Nodos activos"
                value={nodos.length}
                tone="cyan"
              />

              <StatusCard
                icon={<ShieldAlert size={22} />}
                label="Precaución"
                value={nodosPrecaucion}
                tone="yellow"
              />

              <StatusCard
                icon={<ShieldAlert size={22} />}
                label="Críticos"
                value={nodosCriticos}
                tone="red"
              />
            </div>
          </div>

          {actualizado && (
            <p className="mt-5 text-xs text-slate-400">
              Última sincronización: {new Date(actualizado).toLocaleString("es-MX")}
            </p>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
        </header>

        <Dashboard nodos={nodos} alertas={alertas} />
      </div>
    </main>
  );
}

function StatusCard({ icon, label, value, tone }) {
  const tones = {
    cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    yellow: "border-yellow-400/30 bg-yellow-400/10 text-yellow-200",
    red: "border-red-400/30 bg-red-400/10 text-red-200"
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="mb-2">{icon}</div>
      <p className="text-xs uppercase tracking-widest opacity-80">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}