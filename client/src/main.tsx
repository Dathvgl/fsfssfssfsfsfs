import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import App from "~/App";
import { persistor, store } from "~/redux/store";

import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";
import "~/index.css";

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    staleTime: 1 * 60 * 1000,
    cacheTime: 2 * 60 * 1000,
    retry: 3,
    // retryOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
