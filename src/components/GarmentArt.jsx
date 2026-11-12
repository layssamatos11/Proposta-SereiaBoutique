export default function GarmentArt({ kind = "vestido" }) {
  return (
    <svg className="garment" viewBox="0 0 160 200" aria-hidden="true">
      <Art kind={kind} />
    </svg>
  );
}

function Art({ kind }) {
  if (kind === "conjunto-calca") {
    return (
      <g>
        <path d="M58 46c6-16 38-16 44 0" />
        <path d="M64 44c2 14 1 22 0 28M96 44c-2 14-1 22 0 28" />
        <path d="M56 70h48c1 10 0 16-4 24H60c-4-8-5-14-4-24Z" />
        <path d="M62 100h36l7 78h-16l-9-58-9 58H55l7-78Z" />
      </g>
    );
  }
  if (kind === "conjunto-shorts") {
    return (
      <g>
        <path d="M60 48c5-14 35-14 40 0" />
        <path d="M66 46c2 12 1 18 0 24M94 46c-2 12-1 18 0 24" />
        <path d="M58 68h44c1 8 0 14-3 20H61c-3-6-4-12-3-20Z" />
        <path d="M60 96h40l8 36H86l-6-24-6 24H52l8-36Z" />
      </g>
    );
  }
  if (kind === "macacao") {
    return (
      <g>
        <path d="M58 42c8-14 36-14 44 0l8 28-16 8-6-16h-16l-6 16-16-8 8-28Z" />
        <path d="M64 70h32l8 108H90l-10-62-10 62H56l8-108Z" />
      </g>
    );
  }
  if (kind === "macacao-curto") {
    return (
      <g>
        <path d="M58 50c8-16 36-16 44 0l6 26-14 8-6-14H72l-6 14-14-8 6-26Z" />
        <path d="M62 78h36l10 48H84l-4-28-4 28H52l10-48Z" />
      </g>
    );
  }
  if (kind === "top") {
    return (
      <g>
        <path d="M48 78c10-28 54-28 64 0" />
        <path d="M58 74c3 22 2 34-2 46M102 74c-3 22-2 34 2 46" />
        <path d="M50 116c8 16 52 16 60 0" />
      </g>
    );
  }
  if (kind === "shorts") {
    return (
      <g>
        <path d="M46 78h68v10c-6 8-10 10-16 10h-8l-6 28H62l-6-28h-8c-6 0-10-2-16-10V78Z" />
        <path d="M80 78v18" />
      </g>
    );
  }
  if (kind === "calca") {
    return (
      <g>
        <path d="M52 40h56l6 140H88l-8-92-8 92H46L52 40Z" />
        <path d="M52 40c8 10 48 10 56 0" />
      </g>
    );
  }
  if (kind === "vestido") {
    return (
      <g>
        <path d="M62 36c6-8 30-8 36 0l6 18-14 6v8l28 96H42l28-96v-8l-14-6 6-18Z" />
        <path d="M70 68h20" />
      </g>
    );
  }
  if (kind === "vestido-longo") {
    return (
      <g>
        <path d="M66 28c5-8 23-8 28 0l4 16h12l-18 132H68L50 44h12l4-16Z" />
        <path d="M74 50h12" />
      </g>
    );
  }
  if (kind === "blusa") {
    return (
      <g>
        <path d="M48 58 32 78l10 10 8-8 4 78h52l4-78 8 8 10-10-16-20c-8 10-20 14-34 14s-26-4-34-14Z" />
        <path d="M80 62v18" />
      </g>
    );
  }
  if (kind === "saia") {
    return (
      <g>
        <path d="M50 58h60l10 104H40L50 58Z" />
        <path d="M50 58c8 8 52 8 60 0" />
        <path d="M70 70l-8 92M90 70l8 92M80 66v96" />
      </g>
    );
  }
  if (kind === "jeans") {
    return (
      <g>
        <path d="M50 42h60l8 136H90l-8-88-2 88H62l-2-88-8 88H42L50 42Z" />
        <path d="M50 42c10 12 50 12 60 0" />
        <path d="M62 70h10v16H62zM88 70h10v16H88z" />
      </g>
    );
  }
  if (kind === "jaqueta") {
    return (
      <g>
        <path d="M46 56 28 74l12 14 8-10v86h64V78l8 10 12-14-18-18c-6 12-18 18-32 18s-26-6-32-18Z" />
        <path d="M80 58v106" />
      </g>
    );
  }
  if (kind === "blazer") {
    return (
      <g>
        <path d="M48 48 30 70l14 12 8-8 2 90h52l2-90 8 8 14-12-18-22c-8 14-20 20-34 20S56 62 48 48Z" />
        <path d="M72 64c6 18 10 40 10 70M88 64c-6 18-10 40-10 70" />
      </g>
    );
  }
  if (kind === "praia") {
    return (
      <g>
        <path d="M58 46c6-12 38-12 44 0-8 10-36 10-44 0Z" />
        <path d="M64 44v16M96 44v16" />
        <path d="M52 118h56c-2 16-8 26-28 26s-26-10-28-26Z" />
      </g>
    );
  }
  return (
    <g>
      <path d="M48 52 30 74l12 12 8-8v78h52V78l8 8 12-12-18-22c-6 12-18 18-32 18S54 64 48 52Z" />
      <path d="M68 70h24" />
    </g>
  );
}
