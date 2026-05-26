import { useEffect, useMemo, useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import AlertPanel from "./components/AlertPanel.jsx";
import Simulator from "./components/Simulator.jsx";
import {
  Activity,
  RadioTower,
  ShieldAlert,
  Waves,
  Wifi,
  Server,
  AlertTriangle,
  LayoutDashboard,
  SlidersHorizontal
} from "lucide-react";

const API_URL = "http://localhost:3000";

export default function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [nodos, setNodos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [actualizado, setActualizado] = useState(null);
  const [modoManual, setModoManual] = useState(false);
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

      setNodos(dataNodos.nodos || []);
      setModoManual(Boolean(dataNodos.modoManual));
      setAlertas(dataAlertas.alertas || []);
      setActualizado(dataNodos.actualizado);
      setError(null);
    } catch (err) {
      setError("No se pudo conectar con el backend. Ejecuta el servidor en http://localhost:3000");
    }
  }

  useEffect(() => {
    cargarDatos();

    const intervalo = setInterval(() => {
      cargarDatos();
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  const resumen = useMemo(() => {
    return {
      total: nodos.length,
      normales: nodos.filter((n) => n.estado === "Normal").length,
      precaucion: nodos.filter((n) => n.estado === "Precaucion").length,
      criticos: nodos.filter((n) => n.estado === "Critico").length
    };
  }, [nodos]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 md:px-8">
        <AlertPanel alerta={alertas[0]} />

        <header className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                <RadioTower size={18} />
                Red IoT Multi-hop con telemetría LoRa simulada
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                RiverWatch <span className="text-cyan-300">Mesh</span>
              </h1>

              <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
                Monitoreo inteligente de niveles de agua mediante nodos distribuidos,
                retransmisión por saltos y alertamiento ciudadano en tiempo real.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge icon={<Wifi size={16} />} text="Nodo 3 → Nodo 2 → Nodo 1" />
                <Badge icon={<Server size={16} />} text="Servidor Ciudad" />
                <Badge icon={<Waves size={16} />} text="Umbral crítico: 4.0 m" />
              </div>

              {actualizado && (
                <p className="mt-5 text-sm text-slate-400">
                  Última actualización:{" "}
                  <span className="font-semibold text-slate-200">
                    {new Date(actualizado).toLocaleString("es-MX")}
                  </span>
                </p>
              )}

              <p className="mt-2 text-sm text-slate-400">
                Modo actual:{" "}
                <span className={modoManual ? "font-black text-purple-300" : "font-black text-cyan-300"}>
                  {modoManual ? "Manual" : "Automático"}
                </span>
              </p>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3">
              <MetricCard
                title="Nodos activos"
                value={resumen.total}
                icon={<Activity />}
                className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
              />
              <MetricCard
                title="Normales"
                value={resumen.normales}
                icon={<ShieldAlert />}
                className="border-green-400/30 bg-green-400/10 text-green-200"
              />
              <MetricCard
                title="Precaución"
                value={resumen.precaucion}
                icon={<AlertTriangle />}
                className="border-yellow-400/30 bg-yellow-400/10 text-yellow-200"
              />
              <MetricCard
                title="Críticos"
                value={resumen.criticos}
                icon={<ShieldAlert />}
                className="border-red-400/30 bg-red-400/10 text-red-200"
              />
            </div>
          </div>
        </header>

        <nav className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-2 md:grid-cols-2">
            <button
              onClick={() => setPagina("dashboard")}
              className={`rounded-3xl px-5 py-4 text-sm font-black transition ${
                pagina === "dashboard"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="mr-2 inline" size={18} />
              Dashboard en tiempo real
            </button>

            <button
              onClick={() => setPagina("simulador")}
              className={`rounded-3xl px-5 py-4 text-sm font-black transition ${
                pagina === "simulador"
                  ? "bg-purple-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal className="mr-2 inline" size={18} />
              Simulador manual
            </button>
          </div>
        </nav>

        {pagina === "dashboard" ? (
          <Dashboard nodos={nodos} alertas={alertas} />
        ) : (
          <Simulator nodos={nodos} cargarDatos={cargarDatos} modoManual={modoManual} />
        )}
      </div>
    </main>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
      {icon}
      {text}
    </div>
  );
}

function MetricCard({ title, value, icon, className }) {
  return (
    <div className={`min-h-36 rounded-3xl border p-5 shadow-xl ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-black/20 p-3">{icon}</div>
        <p className="text-4xl font-black">{value}</p>
      </div>
      <p className="text-sm font-bold uppercase tracking-widest opacity-80">{title}</p>
    </div>
  );
}