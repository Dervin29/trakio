import DotField from "@/components/DotField";

export default function ProductsLayout({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* DotField as background */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <DotField
          dotRadius={2.5}
          dotSpacing={20}
          cursorRadius={350}
          cursorForce={0.12}
          bulgeOnly={true}
          bulgeStrength={40}
          glowRadius={180}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </main>
  );
}