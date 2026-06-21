"use client";

interface TorchGroupProps {
  torches: boolean[];
}

export function TorchGroup({ torches }: TorchGroupProps) {
  return (
    <>
      {torches.map((lit, index) => (
        <div
          key={index}
          className={`absolute w-4 h-24 ${index < 3 ? "left-[5%]" : "right-[5%]"} ${
            index % 3 === 0 ? "top-[15%]" : index % 3 === 1 ? "top-1/2 -translate-y-1/2" : "bottom-[15%]"
          } z-20 hidden md:block`}
        >
          {/* Cabo de madeira da tocha */}
          <div className="w-4 h-full bg-gradient-to-b from-[#3e2723] to-[#1a100c] mx-auto relative border-x border-[#5d4037] shadow-lg rounded-b">
            {/* Suporte de ferro */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-2.5 bg-gradient-to-b from-zinc-500 to-zinc-800 rounded-sm shadow" />

            {lit && (
              <>
                {/* Halo de luz */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/25 rounded-full blur-2xl animate-pulse" />

                {/* Chama */}
                <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-9 h-16 origin-bottom">
                  {/* camada externa (âmbar) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-600 via-amber-400 to-transparent rounded-[50%_50%_45%_45%/65%_65%_40%_40%] blur-[2px] animate-[flame-flicker_0.45s_ease-in-out_infinite]" />
                  {/* núcleo claro */}
                  <div className="absolute inset-x-1.5 bottom-0 top-3 bg-gradient-to-t from-amber-300 via-amber-200 to-transparent rounded-[50%_50%_45%_45%/60%_60%_40%_40%] blur-[1px] animate-[flame-flicker_0.3s_ease-in-out_infinite_reverse]" />
                  {/* base brilhante */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-200 rounded-full blur-md opacity-70" />
                </div>

                {/* Brasas subindo */}
                {[0, 1, 2].map((e) => (
                  <span
                    key={e}
                    className="absolute left-1/2 -top-8 w-1 h-1 rounded-full bg-amber-300"
                    style={{
                      animation: `ember-rise ${1.6 + e * 0.4}s ease-out infinite`,
                      animationDelay: `${e * 0.5}s`,
                      marginLeft: `${e * 3 - 3}px`,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
