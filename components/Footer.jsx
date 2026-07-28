import { Package } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Trakio</span>
          <span className="text-xs text-gray-400 font-medium ml-1">v1.0</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Support
            </a>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Alan Derwin
          </p>
        </div>
      </div>
    </footer>
  );
}