import { Siren, TriangleAlert } from "lucide-react";

export default function AlertPanel({ alerta }) {
  if (!alerta) return null;

  return (
    <section className="animate-pulseRed rounded-[2rem] border border-red-300/40 bg-gradient-to-r from-red-950 via-red-700 to-red-950 p-5 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="animate-siren rounded-3xl bg-white/15 p-4 shadow-xl">
            <Siren size={46} className="text-white" />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-red-100">
              <TriangleAlert size={18} />
              Alerta ciudadana masiva
            </div>

            <h2 className="text-2xl font-black text-white md:text-4xl">
              Evacuación urgente recomendada
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-red-50 md:text-base">
              {alerta.mensaje} Alejarse del cauce del río, acudir a zonas altas y seguir
              indicaciones de Protección Civil.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-black/25 p-4 text-sm text-red-50">
          <p className="font-bold">Sensor origen</p>
          <p>{alerta.nodoNombre}</p>

          <p className="mt-2 font-bold">Nivel detectado</p>
          <p>{alerta.nivelAgua} m</p>

          <p className="mt-2 text-xs opacity-80">{alerta.fecha}</p>
        </div>
      </div>
    </section>
  );
}