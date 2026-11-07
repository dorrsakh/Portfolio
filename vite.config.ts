import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Allow this workspace’s forwarded preview host without opening the dev server to arbitrary hosts.
const workspacePreviewHost = process.env.TERMOTE_CODER_APP_HOST?.replace(
  /^termote--/,
  "5173--",
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { allowedHosts: workspacePreviewHost ? [workspacePreviewHost] : [] },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
