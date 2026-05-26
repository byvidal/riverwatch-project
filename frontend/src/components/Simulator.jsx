import {
  SlidersHorizontal, Waves, Power, RotateCcw,
  Radio, Server, ArrowRight, Siren
} from "lucide-react";

const API_URL = "http://localhost:3000";

export default function Simulator({ nodos, cargarDatos, modoManual }) {
  // ... Funciones de cambiarNivel, cambiarModo y reiniciarSistema intactas ...

  return (
    <section className="space-y-6">
      {/* ... Header del simulador intacto ... */}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          {nodosOrdenados.map((nodo) => (
            <ControlNodo key={nodo.id} nodo={nodo} cambiarNivel={cambiarNivel} />
          ))}
        </div>

        <div className="flex flex-col rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="mb-6 text-2xl font-black text-white">
            Activación visual de la red
          </h3>

          {/* CONTENEDOR VISUAL RESPONSIVO */}
          <div className="flex-1 w-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex w-max min-w-full items-center gap-4 md:gap-6 px-2">
              {nodosOrdenados.map((nodo, index) => (
                <div key={nodo.id} className="flex shrink-0 items-center gap-4 md:gap-6">
                  <NodoVisual nodo={nodo} />

                  {index < nodosOrdenados.length - 1 && (
                    <div className="flex shrink-0 flex-col items-center gap-1 text-cyan-300">
                      <ArrowRight size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">LoRa</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex shrink-0 flex-col items-center gap-1 text-cyan-300 ml-2">
                <ArrowRight size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Gateway</span>
              </div>

              <div className="w-[180px] shrink-0 rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5 text-center">
                <Server className="mx-auto mb-3 text-sky-300" size={42} />
                <p className="font-black text-white">Servidor</p>
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

// ... Componente ControlNodo intacto ...

function NodoVisual({ nodo }) {
  const estilo = obtenerEstilo(nodo.estado);
  const porcentaje = Math.min((nodo.nivelAgua / 6) * 100, 100);

  return (
    <div className={`relative w-[220px] shrink-0 overflow-hidden rounded-3xl border p-6 text-center transition-all duration-500 ${estilo.visual}`}>
      
      {/* FONDO ANIMADO DEL NIVEL DE AGUA */}
      <div 
        className={`absolute bottom-0 left-0 right-0 w-full opacity-20 transition-all duration-700 ${estilo.water}`}
        style={{ height: `${porcentaje}%` }}
      />

      <div className="relative z-10">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-black/40 backdrop-blur-sm">
          {nodo.estado === "Critico" ? (
            <Siren className={`animate-bounce ${estilo.icon}`} size={42} />
          ) : (
            <Radio className={estilo.icon} size={42} />
          )}
        </div>

        <p className="text-xl font-black text-white">{nodo.nombre.split(" - ")[0]}</p>
        <p className="mt-1 text-sm text-slate-300">{nodo.nombre.split(" - ")[1]}</p>
        
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-4xl font-black text-white drop-shadow-md">{nodo.nivelAgua}m</p>
          <p className={`rounded-full border px-4 py-1.5 text-sm font-black tracking-wide ${estilo.badge}`}>
            {nodo.estado.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

function Leyenda({ color, titulo, texto }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
      <div className={`mb-2 h-4 w-4 rounded-full ${color} shadow-[0_0_15px_currentColor]`} />
      <p className="font-black text-white">{titulo}</p>
      <p className="text-xs text-slate-400">{texto}</p>
    </div>
  );
}

// ... Componente obtenerEstilo intacto ...

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