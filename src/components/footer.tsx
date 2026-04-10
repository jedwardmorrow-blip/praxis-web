export function Footer() {
  return (
    <footer className="flex items-center justify-between px-20 py-11 border-t border-border max-sm:flex-col max-sm:gap-4 max-sm:px-6 max-sm:text-center">
      <div className="flex items-center gap-1.5">
        <span className="font-heading font-bold text-[0.95rem] tracking-[0.06em] text-muted-foreground">
          PRAXIS
        </span>
        <span className="h-1 w-1 rounded-full bg-brand" aria-hidden="true" />
      </div>
      <span className="text-[0.72rem] text-muted-foreground tracking-[0.04em]">
        © 2026 PRAXIS. Operational Intelligence.
      </span>
      <span className="text-[0.72rem] text-muted-foreground tracking-[0.1em] uppercase">
        gopraxis.ai
      </span>
    </footer>
  )
}
