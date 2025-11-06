export const formatToDollar = (value: number | string): string => {
  const num = Number(value);

  if (isNaN(num)) return "$0.00";

  return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Format as: "Jan 19, 2025, 6:00 PM"
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
