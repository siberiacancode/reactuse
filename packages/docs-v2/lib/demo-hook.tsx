export const getDemoHook = (hookName: string) => ({});

// React.lazy(async () => {
//         const mod = await import("./radix/badge-colors")
//         const exportName =
//           Object.keys(mod).find(
//             (key) =>
//               typeof mod[key] === "function" || typeof mod[key] === "object"
//           ) || "badge-colors"
//         return { default: mod.default || mod[exportName] }
//       }),
