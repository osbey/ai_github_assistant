export function CommitGraph() {
  return (
    <svg
      viewBox="0 0 320 420"
      className="w-full h-full"
      fill="none"
      aria-hidden
    >
      <path d="M40 0 V420" stroke="var(--border)" strokeWidth="1.5" />
      <path
        d="M40 60 C 90 60, 90 100, 140 100 S 190 140, 240 140"
        stroke="var(--accent-ai)"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        opacity="0.4"
        className="animate-[graph-flow_3s_linear_infinite]"
      />
      <path
        d="M40 220 C 90 220, 90 260, 140 260 S 190 300, 240 300"
        stroke="var(--accent-git)"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        opacity="0.4"
        className="animate-[graph-flow_3.6s_linear_infinite]"
      />
      {[40, 70, 110, 160, 220, 290, 360].map((y, i) => (
        <circle
          key={y}
          cx="40"
          cy={y}
          r="3.5"
          fill={i % 2 === 0 ? "var(--accent-git)" : "var(--accent-ai)"}
          className="animate-[graph-pulse_2.4s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      <circle cx="140" cy="100" r="3.5" fill="var(--accent-ai)" />
      <circle cx="240" cy="140" r="3.5" fill="var(--accent-ai)" />
      <circle cx="140" cy="260" r="3.5" fill="var(--accent-git)" />
      <circle cx="240" cy="300" r="3.5" fill="var(--accent-git)" />
    </svg>
  );
}
