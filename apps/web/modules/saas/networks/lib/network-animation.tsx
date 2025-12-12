import React, { useEffect, useState } from 'react';
import { 
  Server, 
  Cloud, 
  Router, 
  CheckCircle2, 
  Settings,
  Database
} from 'lucide-react';

interface NetworkAnimationProps {
  active?: boolean;
}

export const NetworkAnimation: React.FC<NetworkAnimationProps> = ({ active = true }) => {
  const [step, setStep] = useState(0);

  // Cycle the animation steps if needed for more complex logic later
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setStep((prev) => (prev + 1) % 5), 2500);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="relative w-full max-w-[600px] aspect-[16/9] mx-auto select-none pointer-events-none font-sans">
      <style>{`
        @keyframes flow-horizontal {
          0% { stroke-dashoffset: 100; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes signal-radiate {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* 
        NEW COORDINATE SYSTEM (600x340) - Tightened & Balanced
        SaaS Node Center: (100, 100) -> Box Left: 68, Right Edge: 132
        Cloud Node Center: (275, 100) -> Box Left: 235, Right Edge: 315 (Moved Left by 25)
        Controller Node Center: (450, 100) -> Box Left: 418 (Moved Left by 50)
        Device Node Center: (450, 260) -> Box Left: 418
        
        Gaps:
        SaaS -> Cloud: 103px (132 to 235)
        Cloud -> Controller: 103px (315 to 418)
      */}

      {/* --- LAYER 1: SVG CONNECTIONS --- */}
      <svg 
        className="absolute inset-0 w-full h-full overflow-visible" 
        viewBox="0 0 600 340"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
          </marker>
        </defs>

        {/* Path 1: SaaS to Cloud */}
        {/* Line from x=132 (right of SaaS) to x=235 (left of Cloud) */}
        <path 
          d="M 132 100 L 235 100" 
          stroke="#E2E8F0" 
          strokeWidth="2" 
          fill="none" 
        />
        <circle r="3" fill="#3B82F6" style={{ animation: active ? 'flow-horizontal 2s ease-in-out infinite' : 'none', opacity: active ? 1 : 0 }}>
          <animateMotion 
            dur="2s" 
            repeatCount="indefinite" 
            path="M 132 100 L 235 100"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>

        {/* Path 2: Cloud to Controller */}
        {/* Line from x=315 (right of Cloud) to x=418 (left of Controller) */}
        <path 
          d="M 315 100 L 418 100" 
          stroke="#E2E8F0" 
          strokeWidth="2" 
          fill="none" 
        />
        <circle r="3" fill="#3B82F6" style={{ animation: active ? 'flow-horizontal 2s ease-in-out infinite 1s' : 'none', opacity: active ? 1 : 0 }}>
          <animateMotion 
            dur="2s" 
            repeatCount="indefinite" 
            begin="1s" 
            path="M 315 100 L 418 100"
          />
        </circle>

        {/* Path 3: Controller to Device */}
        {/* Line from y=132 (bottom of Controller) to y=228 (top of Device) - X fixed at 450 */}
        <path 
          d="M 450 132 L 450 228" 
          stroke="#E2E8F0" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="4 4"
        />
      </svg>

      {/* --- LAYER 2: HTML NODES (Absolute Positioning to match SVG) --- */}

      {/* 1. SaaS Node (Center: 100, 100) */}
      <div className="absolute w-[64px] h-[64px] top-[68px] left-[68px] z-10">
        <div className={`w-full h-full bg-white rounded-xl shadow-lg border border-slate-200 flex items-center justify-center relative group transition-transform ${active ? 'hover:-translate-y-1' : ''}`}>
          <Server className="w-8 h-8 text-blue-600 relative z-10" />
          {active && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap">
           <span className="text-xs font-semibold text-slate-600 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm border border-slate-100 shadow-sm">
            Phoenix
          </span>
        </div>
      </div>

      {/* 2. Cloud Node (Center: 275, 100) */}
      <div className="absolute w-[80px] h-[80px] top-[60px] left-[235px] z-10 flex items-center justify-center">
         <Cloud className="w-20 h-20 text-slate-200 absolute" fill="currentColor" />
         <Settings className="w-8 h-8 text-slate-400" style={{ animation: active ? 'spin-slow 8s linear infinite' : 'none' }} />
         <div className="absolute top-[85px] left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              API Sync
            </span>
         </div>
      </div>

      {/* 3. Controller Node (Center: 450, 100) */}
      <div className="absolute w-[64px] h-[64px] top-[68px] left-[418px] z-10">
        <div className="w-full h-full bg-white rounded-xl shadow-lg border border-slate-200 flex items-center justify-center relative">
             <Database className="w-8 h-8 text-indigo-600" />
             {active && <div className="absolute inset-0 border-2 border-indigo-100 rounded-xl animate-pulse" />}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap">
          <span className="text-xs font-semibold text-slate-600 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm border border-slate-100 shadow-sm">
            Controller
          </span>
        </div>
      </div>

      {/* 4. Device Node (Center: 450, 260) */}
      <div className="absolute w-[64px] h-[64px] top-[228px] left-[418px] z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center w-12 h-12">
            {/* Router Icon */}
            <div className="w-12 h-12 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center z-10">
                <Router className="w-6 h-6 text-slate-700" />
            </div>
            {/* Signals */}
            {active && (
              <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-full" style={{ animation: 'signal-radiate 2s ease-out infinite' }} />
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-full" style={{ animation: 'signal-radiate 2s ease-out infinite 0.5s' }} />
              </div>
            )}
            {/* Checkmark */}
            <div className="absolute -right-2 -top-2 bg-white rounded-full shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500" fill="white" />
            </div>
        </div>
        <div className="mt-2 text-center">
            <span className="text-[10px] font-medium text-slate-500">Guest Wi-Fi</span>
        </div>

        {/* Guest Portal Pop-out */}
        <div 
          className="absolute right-[50px] top-0 w-20 bg-white rounded-md shadow-lg border border-slate-100 p-1.5 flex flex-col gap-1"
          style={{ animation: active ? 'fade-in-up 0.5s ease-out forwards 1s' : 'none', opacity: active ? undefined : 1 }}
        >
            <div className="h-1 w-8 bg-slate-200 rounded-full mb-0.5" />
            <div className="h-1 w-12 bg-blue-100 rounded-full" />
            <div className="mt-1 flex justify-center">
                <div className="w-8 h-2 bg-blue-600 rounded-[2px]" />
            </div>
            {/* Line connecting to AP */}
            <div className="absolute top-4 -right-2 w-2 h-[1px] bg-slate-300" />
            <div className="absolute top-4 -right-2 w-1 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>

      {/* Floating Success Notification (Phoenix Side) */}
      {active && (
        <div 
          className="absolute top-[80px] left-[140px] z-20" 
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
           <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-md shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-700">Configured</span>
           </div>
        </div>
      )}

    </div>
  );
};