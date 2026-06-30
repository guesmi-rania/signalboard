// Seed list of technologies SignalBoard tracks out of the box.
// `query` is used for GitHub/HN search, `npmPackage` for the npm registry
// (null when the tech isn't a single npm package, e.g. a language).
export const TRACKED_TECHNOLOGIES = [
  { name: "React", npmPackage: "react", category: "frontend" },
  { name: "Vue", npmPackage: "vue", category: "frontend" },
  { name: "Svelte", npmPackage: "svelte", category: "frontend" },
  { name: "Solid.js", npmPackage: "solid-js", category: "frontend" },
  { name: "Astro", npmPackage: "astro", category: "frontend" },
  { name: "Next.js", npmPackage: "next", category: "framework" },
  { name: "Remix", npmPackage: "@remix-run/react", category: "framework" },
  { name: "Bun", npmPackage: null, category: "runtime" },
  { name: "Deno", npmPackage: null, category: "runtime" },
  { name: "tRPC", npmPackage: "@trpc/server", category: "backend" },
  { name: "Prisma", npmPackage: "prisma", category: "backend" },
  { name: "Drizzle ORM", npmPackage: "drizzle-orm", category: "backend" },
  { name: "Tailwind CSS", npmPackage: "tailwindcss", category: "styling" },
  { name: "shadcn/ui", npmPackage: null, category: "styling" },
  { name: "Vite", npmPackage: "vite", category: "tooling" },
  { name: "Turborepo", npmPackage: "turbo", category: "tooling" },
  { name: "Zod", npmPackage: "zod", category: "tooling" },
  { name: "LangChain", npmPackage: "langchain", category: "ai" },
  { name: "Rust", npmPackage: null, category: "language" },
  { name: "WebAssembly", npmPackage: null, category: "language" }
];
