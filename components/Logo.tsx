type Props = {
  className?: string;
  /** Show the 2 × 2 construction grid behind the mark. */
  grid?: boolean;
};

/** The Bux mark: a B built from a square and two half circles, with an accent dot. Same artwork as public/assets/logo.svg. */
export function BuxMark({ className, grid = false }: Props) {
  return (
    <svg viewBox={grid ? "-12 -12 224 224" : "0 0 200 200"} className={className} aria-hidden="true">
      {grid && (
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
          <path d="M0 0V200M100 0V200M200 0V200M0 0H200M0 100H200M0 200H200" />
          <circle cx="100" cy="100" r="100" />
        </g>
      )}
      <path fill="currentColor" d="M0 0h100a50 50 0 0 1 0 100a50 50 0 0 1 0 100H0z" />
      <circle cx="175" cy="175" r="25" className="fill-accent" />
    </svg>
  );
}
