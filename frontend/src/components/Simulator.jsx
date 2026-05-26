import {
  SlidersHorizontal,
  Waves,
  Power,
  RotateCcw,
  Radio,
  Server,
  ArrowRight,
  Siren
} from "lucide-react";

const API_URL = "http://localhost:3000";

export default function Simulator({ nodos, cargarDatos, modoManual }) {
  const nodosOrdenados = [...nodos].sort((a, b) => {
    const orden = { nodo3: 1, nodo2: 2, nodo1: 3 };
    return orden[a.id] - orden[b.id];
  });

  async function cambiarNivel(nodoId, nivelAgua) {
    await fetch(`${API_URL}/api/nodos/${nodoId}/nivel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nivelAgua: Number(nivelAgua)
      })
    });

    cargarDatos();
  }

  async function cambiarModo(manual) {
    await fetch(`${API_URL}/api/modo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ manual })
    });

    cargarDatos();
  }

  async function reiniciarSistema() {
    await fetch(`${API_URL}/api/reset`, {
      method: "POST"
    });

    cargarDatos();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm font-bold text-purple-200">
              <SlidersHorizontal size={18} />
              Simulación manual de telemetría
            </div>

            <h2 className="text-3xl font-black text-white md:text-4xl">
              Control manual del nivel del río
            </h2>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
              Mueve los controles para aumentar o disminuir el nivel de agua en cada nodo.
              Cuando un nodo pase de 3.0m cambiará a precaución y cuando supere 4.0m activará
              alerta crítica ciudadana.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => cambiarModo(true)}
              className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                modoManual
                  ? "bg-purple-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)]"
                  : "border border-purple-400/30 bg-purple-400/10 text-purple-200 hover:bg-purple-400/20"
              }`}
            >
              <Power className="mr-2 inline" size={17} />
              Modo manual
            </button>

            <button
              onClick={() => cambiarModo(false)}
              className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-black text-cyan-200 transition hover:bg-cyan-400/20"
            >
              <Waves className="mr-2 inline" size={17} />
              Automático
            </button>

            <button
              onClick={reiniciarSistema}
              className="rounded-2xl border border-slate-400/30 bg-white/10 px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/20"
            >
              <RotateCcw className="mr-2 inline" size={17} />
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          {nodosOrdenados.map((nodo) => (
            <ControlNodo key={nodo.id} nodo={nodo} cambiarNivel={cambiarNivel} />
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="mb-6 text-2xl font-black text-white">
            Activación visual de la red
          </h3>

          <div className="min-w-0 overflow-x-auto pb-4">
            <div className="flex min-w-[850px] items-center gap-4">
              {nodosOrdenados.map((nodo, index) => (
                <div key={nodo.id} className="flex items-center gap-4">
                  <NodoVisual nodo={nodo} />

                  {index < nodosOrdenados.length - 1 && (
                    <div className="flex flex-col items-center gap-1 text-cyan-300">
                      <ArrowRight size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        LoRa
                      </span>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col items-center gap-1 text-cyan-300">
                <ArrowRight size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Gateway
                </span>
              </div>

              <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5 text-center">
                <Server className="mx-auto mb-3 text-sky-300" size={42} />
                <p className="font-black text-white">Servidor Ciudad</p>
                <p className="mt-1 text-xs text-slate-400">Recibe alertas</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Leyenda color="bg-green-400" titulo="Normal" texto="Menor a 3.0m" />
            <Leyenda color="bg-yellow-400" titulo="Precaución" texto="Desde 3.0m" />
            <Leyenda color="bg-red-500" titulo="Crítico" texto="Mayor a 4.0m" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlNodo({ nodo, cambiarNivel }) {
  const estilo = obtenerEstilo(nodo.estado);

  return (
    <article className={`rounded-[2rem] border p-6 shadow-2xl backdrop-blur-xl ${estilo.card}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-black text-white">{nodo.nombre}</h3>
          <p className="mt-1 text-sm text-slate-400">
            Control manual del sensor y simulación de lectura.
          </p>
        </div>

        <div className={`rounded-full border px-4 py-2 text-sm font-black ${estilo.badge}`}>
          {nodo.estado}
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-300">Nivel del río</span>
            <span className="text-2xl font-black text-white">{nodo.nivelAgua}m</span>
          </div>

          <input
            type="range"
            min="0"
            max="6"
            step="0.1"
            value={nodo.nivelAgua}
            onChange={(e) => cambiarNivel(nodo.id, e.target.value)}
            className="w-full cursor-pointer accent-cyan-400"
          />

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>0m</span>
            <span>3m</span>
            <span>4m</span>
            <span>6m</span>
          </div>
        </div>

        <div className="flex h-28 w-full items-end justify-center rounded-3xl border border-white/10 bg-black/20 p-3 md:w-24">
          <div
            className={`w-full rounded-2xl transition-all duration-500 ${estilo.water}`}
            style={{
              height: `${Math.min((nodo.nivelAgua / 6) * 100, 100)}%`
            }}
          />
        </div>
      </div>
    </article>
  );
}

function NodoVisual({ nodo }) {
  const estilo = obtenerEstilo(nodo.estado);

  return (
    <div className={`w-52 rounded-3xl border p-5 text-center ${estilo.visual}`}>
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-black/25">
        {nodo.estado === "Critico" ? (
          <Siren className={estilo.icon} size={36} />
        ) : (
          <Radio className={estilo.icon} size={36} />
        )}
      </div>

      <p className="font-black text-white">{nodo.nombre.split(" - ")[0]}</p>
      <p className="mt-1 text-xs text-slate-400">{nodo.nombre.split(" - ")[1]}</p>
      <p className="mt-3 text-3xl font-black text-white">{nodo.nivelAgua}m</p>
      <p className={`mt-2 rounded-full border px-3 py-1 text-xs font-black ${estilo.badge}`}>
        {nodo.estado}
      </p>
    </div>
  );
}

function Leyenda({ color, titulo, texto }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <p className="font-black text-white">{titulo}</p>
      </div>
      <p className="text-sm text-slate-400">{texto}</p>
    </div>
  );
}

function obtenerEstilo(estado) {
  const estilos = {
    Normal: {
      card: "border-green-400/30 bg-green-400/10",
      visual: "border-green-400/40 bg-green-400/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]",
      badge: "border-green-400/30 bg-green-400/15 text-green-200",
      icon: "text-green-300",
      water: "bg-green-400"
    },
    Precaucion: {
      card: "border-yellow-400/30 bg-yellow-400/10",
      visual: "border-yellow-400/40 bg-yellow-400/10 shadow-[0_0_30px_rgba(250,204,21,0.25)]",
      badge: "border-yellow-400/30 bg-yellow-400/15 text-yellow-200",
      icon: "text-yellow-300",
      water: "bg-yellow-400"
    },
    Critico: {
      card: "animate-pulseRed border-red-400/40 bg-red-400/10",
      visual: "animate-pulseRed border-red-400/50 bg-red-400/10 shadow-[0_0_40px_rgba(239,68,68,0.45)]",
      badge: "border-red-400/30 bg-red-400/15 text-red-200",
      icon: "text-red-300",
      water: "bg-red-500"
    }
  };

  return estilos[estado] || estilos.Normal;
}