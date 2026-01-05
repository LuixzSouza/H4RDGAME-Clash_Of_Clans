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
          className={`absolute w-4 h-24 ${index < 3 ? 'left-[5%]' : 'right-[5%]'} ${
            index % 3 === 0 ? 'top-[15%]' : index % 3 === 1 ? 'top-1/2 -translate-y-1/2' : 'bottom-[15%]'
          } z-20 hidden md:block`}
        >
          <div className="w-4 h-full bg-gradient-to-b from-[#3e2723] to-[#1a100c] mx-auto relative border-x border-[#5d4037] shadow-lg">
            {/* Suporte da Tocha */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-700 rounded-sm"></div>
            
            {lit && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-16">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent rounded-full blur-md animate-pulse"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full blur-sm opacity-50"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}