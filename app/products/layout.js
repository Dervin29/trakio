import DotField from "@/components/DotField";

export default function ProductsLayout({ children }) {
  return (
    <main className="relative min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <DotField />
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}
