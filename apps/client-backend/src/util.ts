// Function to convert bytes to megabytes
const formatMemory = (bytes: number): string =>
  (bytes / 1024 / 1024).toFixed(2) + " MB";

// Node.js memory usage type
type MemoryUsage = NodeJS.MemoryUsage;

export function showMemoryUsage(memoryData: MemoryUsage) {
  const formattedUsage: Record<keyof MemoryUsage, string> = (
    Object.keys(memoryData) as (keyof MemoryUsage)[]
  ).reduce(
    (acc, key) => {
      acc[key] = formatMemory(memoryData[key]);
      return acc;
    },
    {} as Record<keyof MemoryUsage, string>,
  );
  return formattedUsage;
}
