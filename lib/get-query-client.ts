import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// A fresh QueryClient per server request, used only to prefetch data and
// hand it off via dehydrate/HydrationBoundary. React's cache() scopes the
// memoized instance to a single request in the App Router, so one user's
// prefetched data can never leak into another's request on the server.
export const getQueryClient = cache(() => new QueryClient());
