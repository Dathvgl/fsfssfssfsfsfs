import { lazy } from "react";

export const customLazy: typeof lazy = (importer) => {
  const retryImport = async () => {
    try {
      return await importer();
    } catch (error: any) {
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i));
        // Ex: "Failed to fetch dynamically imported module: https://example.com/assets/Home.tsx"
        const url = new URL(
          error.message
            .replace("Failed to fetch dynamically imported module: ", "")
            .trim()
        );

        // add a timestamp to the url to force a reload the module (and not use the cached version - cache busting)
        url.searchParams.set("t", `${+new Date()}`);

        try {
          return await import(/* @vite-ignore */ url.href);
        } catch (e) {
          console.log("Retrying import");
        }
      }
      throw error;
    }
  };

  return lazy(retryImport);
};
