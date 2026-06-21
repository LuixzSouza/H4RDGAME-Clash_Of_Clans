"use client";

const WALL_PATTERN = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E`;

export function LoginBackground() {
  return (
    <>
      {/* Brilho dourado central + escurecimento das bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background to-background -z-10" />
      {/* Glows laterais (lado das tochas) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-[80%] bg-primary/10 blur-[120px] -z-10 hidden md:block" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-[80%] bg-primary/10 blur-[120px] -z-10 hidden md:block" />
      {/* Textura de muralha */}
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: `url("${WALL_PATTERN}")` }} />
      {/* Vinheta inferior */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent -z-10" />

      {/* Brasas flutuantes pela cena */}
      {[
        { left: "12%", delay: "0s", dur: "5s" },
        { left: "22%", delay: "1.5s", dur: "6s" },
        { left: "78%", delay: "0.8s", dur: "5.5s" },
        { left: "88%", delay: "2.2s", dur: "6.5s" },
        { left: "50%", delay: "3s", dur: "7s" },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute bottom-24 w-1 h-1 rounded-full bg-amber-400/70 blur-[1px] -z-10"
          style={{ left: p.left, animation: `ember-rise ${p.dur} ease-out infinite`, animationDelay: p.delay }}
        />
      ))}
    </>
  );
}
