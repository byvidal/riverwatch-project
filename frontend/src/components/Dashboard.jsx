import {
  Radio, Server, Waves, MapPin, Activity, Route,
  BellRing, Droplets, ArrowRight, Wifi, Gauge
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, AreaChart, Area
} from "recharts";

export default function Dashboard({ nodos, alertas }) {
  const nodosOrdenados = [...nodos].sort((a, b) => {
    const orden = { nodo3: 1, nodo2: 2, nodo1: 3 };
    return orden[a.id] - orden[b.id];
  });

  const dataGrafica = nodosOrdenados.map((nodo) => ({
    nombre: nodo.nombre.replace("Nodo ", "N"),
    nivel: nodo.nivelAgua
  }));

  const historialCombinado = crearHistorialCombinado(nodosOrdenados);

  return (
    <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.85fr]">
      <section className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-white">
              <Route className="text-cyan-300" />
              Mapa de Red Multi-hop
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Los paquetes viajan por saltos hasta llegar al servidor central.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-100">
            <Wifi size={17} />
            Radio LoRa simulada
          </div>
        </div>

        {/* CONTENEDOR MEJORADO: Permite scroll horizontal sin comprimir tarjetas */}
        <div className="w-full overflow-x-auto pb-6 pt-2 snap-x snap-mandatory">
          <div className="flex w-max min-w-full items-stretch gap-6 px-2">
            {nodosOrdenados.map((nodo, index) => (
              <div key={nodo.id} className="flex shrink-0 snap-center items-center gap-6">
                <NodeCard nodo={nodo} />

                {index < nodosOrdenados.length - 1 && (
                  <HopLine label="Salto LoRa" />
                )}
              </div>
            ))}

            <div className="flex shrink-0 items-center gap-6">
              <HopLine label="Gateway" />

              <div className="flex w-[260px] flex-col justify-center rounded-3xl border border-sky-300/30 bg-sky-400/10 p-6 text-center shadow-[0_0_35px_rgba(56,189,248,0.22)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-400/15">
                  <Server size={38} className="text-sky-300" />
                </div>
                <h3 className="text-lg font-black text-white">Servidor Ciudad</h3>
                <p className="mt-1 text-xs text-slate-400">Backend Express</p>
                <p className="mt-3 inline-block rounded-full bg-sky-400/10 px-4 py-1.5 text-xs font-bold tracking-wide text-sky-200">
                  API REST
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El resto de los aside (Gráficas y alertas) se mantienen iguales... */}
      <aside className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-1">
         {/* ... Código de gráficas y alertas existente ... */}
      </aside>
    </div>
  );
}

function NodeCard({ nodo }) {
  const estilos = {
    Normal: {
      card: "border-green-400/40 bg-green-400/10 shadow-[0_0_32px_rgba(34,197,94,0.18)]",
      icon: "text-green-300",
      badge: "bg-green-400/15 text-green-200 border-green-400/30",
      bar: "bg-green-400"
    },
    Precaucion: {
      card: "border-yellow-400/40 bg-yellow-400/10 shadow-[0_0_32px_rgba(250,204,21,0.18)]",
      icon: "text-yellow-300",
      badge: "bg-yellow-400/15 text-yellow-200 border-yellow-400/30",
      bar: "bg-yellow-400"
    },
    Critico: {
      card: "border-red-400/50 bg-red-400/10 shadow-[0_0_40px_rgba(239,68,68,0.45)]",
      icon: "text-red-300",
      badge: "bg-red-400/15 text-red-200 border-red-400/30",
      bar: "bg-red-500"
    }
  };

  const estilo = estilos[nodo.estado] || estilos.Normal;
  const porcentaje = Math.min((nodo.nivelAgua / 6) * 100, 100);

  return (
    <article className={`w-[280px] shrink-0 rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 ${estilo.card}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-white">{nodo.nombre}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={14} />
            {nodo.lat}, {nodo.lng}
          </p>
        </div>
        <div className="rounded-2xl bg-black/20 p-3">
          <Radio className={estilo.icon} size={28} />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${estilo.badge}`}>
          {nodo.estado}
        </span>
        <span className="flex items-center gap-1 text-sm font-black text-slate-100">
          <Droplets size={16} />
          {nodo.nivelAgua} m
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900">
        <div
          className={`h-full rounded-full transition-all duration-700 ${estilo.bar}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-black/20 p-3 text-xs text-slate-300">
        <p className="flex items-center gap-2">
          <Activity size={14} />
          Siguiente salto:
          <span className="font-bold text-cyan-200 truncate">
            {nodo.siguiente === "Servidor Ciudad" ? "Servidor Ciudad" : nodo.siguiente}
          </span>
        </p>
      </div>
    </article>
  );
}

function HopLine({ label }) {
  return (
    <div className="flex shrink-0 w-[100px] flex-col items-center justify-center gap-1 text-cyan-300">
      <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_18px_rgba(56,189,248,0.8)]" />
      <ArrowRight size={18} />
      <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ... función crearHistorialCombinado intacta ...

function crearHistorialCombinado(nodos) {
  const max = Math.max(...nodos.map((n) => n.historial?.length || 0), 0);

  return Array.from({ length: max }).map((_, index) => {
    const punto = {
      tiempo: nodos[0]?.historial?.[index]?.tiempo || ""
    };

    nodos.forEach((nodo) => {
      punto[nodo.id] = nodo.historial?.[index]?.nivel ?? null;
    });

    return punto;
  });
}