export const navbarContainer = [
  "sticky",
  "top-0",
  "z-50",
  "flex",
  "flex-col sm:flex-row",         // Responsive layout
  "items-center",
  "justify-between",
  "gap-4 sm:gap-0",              // Avoid crowding on mobile
  "px-4 sm:px-6 md:px-10",
  "py-3 sm:py-4",
  "bg-white",
  "dark:bg-gray-900",
  "shadow-md",
  "transition-all",
  "duration-300",
  "text-center sm:text-left"
].join(" ");

export const logoStyle = [
  "flex",
  "items-center",
  "gap-2",
  "font-bold",
  "text-indigo-600",
  "dark:text-indigo-300",
  "text-lg",
  "text-center sm:text-left"
].join(" ");

export const navLinks = [
  "flex",
  "flex-wrap",                     // Allows wrapping on mobile
  "justify-center sm:justify-end",
  "gap-4 sm:gap-6",
  "text-gray-700",
  "dark:text-gray-300",
  "font-medium",
  "text-sm sm:text-base"
].join(" ");

export const navItem = [
  "hover:text-indigo-600",
  "dark:hover:text-indigo-400",
  "transition-colors",
  "duration-200"
].join(" ");

export const darkToggle = [
  "text-xl",
  "cursor-pointer",
  "transition",
  "duration-200",
  "mt-2 sm:mt-0"
].join(" ");
