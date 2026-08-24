import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// Nitro + `vercel` preset: TanStack Start on Vercel (Fluid / serverless). See https://tanstack.com/start/latest/docs/framework/react/guide/hosting#vercel
export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart(),
    nitro({ preset: "vercel" }),
    react(),
  ],
});
