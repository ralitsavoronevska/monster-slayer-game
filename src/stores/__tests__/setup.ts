import { afterEach, vi } from "vitest";
import cleanup from "@vitejs/plugin-vue";

afterEach(() => {
  cleanup();
});

// Enable fake timers globally
vi.useFakeTimers();
