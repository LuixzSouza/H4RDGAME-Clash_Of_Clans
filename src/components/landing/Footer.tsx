export function Footer() {
  return (
    <footer className="py-10 bg-[#08090d] border-t border-[#1f2937] text-center">
      <p className="text-slate-500 text-sm font-medium">
        &copy; {new Date().getFullYear()} <span className="text-yellow-500">H4RD G4ME</span>. Clash of Clans Manager.
      </p>
      <p className="text-slate-600 text-xs mt-2">
        Este site não é afiliado, endossado, patrocinado ou especificamente aprovado pela Supercell.
      </p>
    </footer>
  );
}