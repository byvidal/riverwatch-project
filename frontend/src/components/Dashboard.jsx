import {
  Radio,
  Server,
  Waves,
  MapPin,
  Activity,
  Route,
  BellRing,
  Droplets
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function Dashboard({ nodos, alertas }) {
  const nodosOrdenados = [...nodos].sort((a, b) => {
    const orden = {
      nodo3: 1,
      nodo2: 2,
      nodo1: 3
    };

    return orden[a.id] - orden[b.id];
  });

  const dataGrafica = nodosOrdenados.map((nodo) => ({
    nombre: nodo.nombre.replace("Nodo ", "N"),
    nivel: nodo.nivelAgua
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="glass-panel rounded-3xl p-6 shadow-2xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-white">
              <Route className="text-cyan-300" />
              Mapa de Red Multi-hop
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Flujo de paquetes: Nodo 3 → Nodo 2 → Nodo 1 → Servidor Ciudad
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            Radio LoRa simulada
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 lg:flex-row">
          {nodosOrdenados.map((nodo, index) => (
            <div key={nodo.id} className="flex w-full flex-col items-center gap-5 lg:flex-row">
              <NodeCard nodo={nodo} />

              {index < nodosOrdenados.length - 1 && (
                <div className="flex w-full flex-col items-center gap-2 lg:w-24">
                  <div className="connection-line hidden w-full rounded-full lg:block" />
                  <div className="h-10 w-1 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.9)] lg:hidden" />
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                    Salto
                  </p>
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.9)] lg:hidden" />
            <div className="connection-line hidden w-24 rounded-full lg:block" />

            <div className="rounded-3xl border border-sky-300/30 bg-sky-400/10 p-5 text-center shadow-[0_0_28px_rgba(56,189,248,0.18)]">
              <Server size={42} className="mx-auto mb-3 text-sky-300" />
              <h3 className="font-black text-white">Servidor Ciudad</h3>
              <p className="mt-1 text-xs text-slate-400">Backend Express</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="glass-panel rounded-3xl p-6 shadow-2xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
            <Waves className="text-blue-300" />
            Nivel de agua actual
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataGrafica}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="nombre" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 6]} />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: "16px",
                    color: "#e2e8f0"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="nivel"
                  stroke="#38bdf8"
                  strokeWidth={4}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-green-400/10 p-2 text-green-200">
              Normal &lt; 3.0m
            </div>
            <div className="rounded-xl bg-yellow-400/10 p-2 text-yellow-200">
              Precaución ≥ 3.0m
            </div>
            <div className="rounded-xl bg-red-400/10 p-2 text-red-200">
              Crítico &gt; 4.0m
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-6 shadow-2xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
            <BellRing className="text-red-300" />
            Registro de alertas
          </h2>

          {alertas.length === 0 ? (
            <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-200">
              Sin alertas críticas registradas. La red opera con normalidad.
            </div>
          ) : (
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {alertas.slice(0, 6).map((alerta) => (
                <div
                  key={alerta.id}
                  className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4"
                >
                  <p className="font-bold text-red-100">{alerta.nodoNombre}</p>
                  <p className="mt-1 text-sm text-slate-300">{alerta.mensaje}</p>
                  <p className="mt-2 text-xs text-slate-500">{alerta.fecha}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}

function NodeCard({ nodo }) {
  const estilos = {
    Normal: {
      card: "border-green-400/40 bg-green-400/10 shadow-[0_0_30px_rgba(34,197,94,0.22)]",
      icon: "text-green-300",
      badge: "bg-green-400/15 text-green-200 border-green-400/30",
      bar: "bg-green-400"
    },
    Precaucion: {
      card: "border-yellow-400/40 bg-yellow-400/10 shadow-[0_0_30px_rgba(250,204,21,0.22)]",
      icon: "text-yellow-300",
      badge: "bg-yellow-400/15 text-yellow-200 border-yellow-400/30",
      bar: "bg-yellow-400"
    },
    Critico: {
      card: "animate-pulseRed border-red-400/50 bg-red-400/10 shadow-[0_0_34px_rgba(239,68,68,0.45)]",
      icon: "text-red-300",
      badge: "bg-red-400/15 text-red-200 border-red-400/30",
      bar: "bg-red-500"
    }
  };

  const estilo = estilos[nodo.estado] || estilos.Normal;
  const porcentaje = Math.min((nodo.nivelAgua / 6) * 100, 100);

  return (
    <article className={`w-full rounded-3xl border p-5 ${estilo.card}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-white">{nodo.nombre}</h3>

          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={14} />
            {nodo.lat}, {nodo.lng}
          </p>
        </div>

        <Radio className={estilo.icon} size={32} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${estilo.badge}`}>
          {nodo.estado}
        </span>

        <span className="flex items-center gap-1 text-sm font-bold text-slate-200">
          <Droplets size={16} />
          {nodo.nivelAgua} m
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${estilo.bar}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-black/20 p-3 text-xs text-slate-300">
        <p className="flex items-center gap-2">
          <Activity size={14} />
          Siguiente salto:{" "}
          <span className="font-bold text-cyan-200">
            {nodo.siguiente === "Servidor Ciudad" ? "Servidor Ciudad" : nodo.siguiente}
          </span>
        </p>
      </div>
    </article>
  );
}