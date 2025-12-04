import React, { useState, useEffect, useMemo } from 'react';
import { Clipboard, Check, Database, Sliders, LineChart as LineChartIcon } from 'lucide-react';
import { parseCSV, generateConfig, formatFullOutput } from './utils';
import { CSV_DATA } from './constants';
import XpChart from './components/XpChart';

const App: React.FC = () => {
  const [dinoLevel, setDinoLevel] = useState<number>(87);
  const [playerLevel, setPlayerLevel] = useState<number>(218);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'chart'>('code');

  // Parse data only once
  const data = useMemo(() => parseCSV(CSV_DATA), []);

  // Generate config whenever inputs change
  const config = useMemo(() => 
    generateConfig(dinoLevel, playerLevel, data), 
    [dinoLevel, playerLevel, data]
  );

  const fullOutput = useMemo(() => formatFullOutput(config), [config]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Limit input to max available data rows
  const maxAvailableDino = data.dino.length - 1;
  const maxAvailablePlayer = data.player.length - 1;

  const handleDinoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    if (val > maxAvailableDino) val = maxAvailableDino;
    if (val < 0) val = 0;
    setDinoLevel(val);
  };

  const handlePlayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    if (val > maxAvailablePlayer) val = maxAvailablePlayer;
    if (val < 0) val = 0;
    setPlayerLevel(val);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-slate-900 text-slate-200">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar / Controls */}
        <div className="col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-lg">
                <Database className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-xl font-bold text-white">MayChuGameTG.Com</h1>
            </div>

            <p className="text-slate-400 text-sm mb-6">
              Website tạo mã ini cho lever người và thú của games ARK
            </p>

            <div className="space-y-6">
              {/* Player Input */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-blue-400">Max Player Level</label>
                  <span className="text-sm font-mono bg-slate-700 px-2 py-0.5 rounded text-white">{playerLevel}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxAvailablePlayer}
                  value={playerLevel}
                  onChange={handlePlayerChange}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    value={playerLevel}
                    onChange={handlePlayerChange}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <span className="ml-2 text-xs text-slate-500 whitespace-nowrap">Max XP: {(config.playerMaxXP / 1000000000).toFixed(2)}B</span>
                </div>
              </div>

              {/* Dino Input */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-emerald-400">Max Dino Level</label>
                  <span className="text-sm font-mono bg-slate-700 px-2 py-0.5 rounded text-white">{dinoLevel}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxAvailableDino}
                  value={dinoLevel}
                  onChange={handleDinoChange}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    value={dinoLevel}
                    onChange={handleDinoChange}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <span className="ml-2 text-xs text-slate-500 whitespace-nowrap">Max XP: {(config.dinoMaxXP / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700 space-y-4">
               <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>System Online</span>
               </div>
               
               {/* Instructions */}
               <div className="bg-slate-700/30 rounded-lg p-4 text-sm border border-slate-700/50">
                  <h3 className="font-semibold text-white mb-2">Hướng dẫn sử dụng</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-300">Đối với Lever Player</p>
                    <ul className="text-slate-400 space-y-1 list-none">
                      <li className="flex items-start">
                        <span className="mr-2 text-indigo-400">•</span>
                        Ark SE : Phải cộng thêm 115 Lever
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-indigo-400">•</span>
                        Ark SE : phải cộng thêm 130 Lever
                      </li>
                    </ul>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-6">
          
          {/* Tabs */}
          <div className="bg-slate-800 rounded-xl p-1 shadow-lg border border-slate-700 flex space-x-1">
             <button
                onClick={() => setActiveTab('code')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'code' 
                    ? 'bg-slate-700 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
             >
                <Sliders className="w-4 h-4" />
                <span>Configuration Code</span>
             </button>
             <button
                onClick={() => setActiveTab('chart')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'chart' 
                    ? 'bg-slate-700 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
             >
                <LineChartIcon className="w-4 h-4" />
                <span>XP Curve Visualization</span>
             </button>
          </div>

          {/* Content */}
          <div className="flex-1 bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col">
            
            {activeTab === 'code' ? (
              <div className="flex flex-col h-full relative group">
                 <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 shadow-lg ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar bg-[#0d1117] p-6">
                  <pre className="font-mono text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
                    <span className="text-purple-400">OverrideMaxExperiencePointsPlayer</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-orange-400">{config.playerMaxXP}</span>
                    {'\n'}
                    <span className="text-purple-400">OverrideMaxExperiencePointsDino</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-orange-400">{config.dinoMaxXP}</span>
                    {'\n'}
                    <span className="text-blue-400">LevelExperienceRampOverrides</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-yellow-300">(</span>
                    {config.playerRamp.replace('LevelExperienceRampOverrides=(', '').slice(0, -1)}
                    <span className="text-yellow-300">)</span>
                    {'\n'}
                    <span className="text-blue-400">LevelExperienceRampOverrides</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-yellow-300">(</span>
                    {config.dinoRamp.replace('LevelExperienceRampOverrides=(', '').slice(0, -1)}
                    <span className="text-yellow-300">)</span>
                  </pre>
                  
                  {/* Invisible textarea for actual copying ensuring clean format without syntax highlighting spans */}
                  <textarea 
                    className="sr-only" 
                    readOnly 
                    value={fullOutput} 
                  />
                </div>
                <div className="bg-slate-700/50 p-2 text-center text-xs text-slate-500 border-t border-slate-700">
                  Generated for Game.ini
                </div>
              </div>
            ) : (
              <div className="flex-1 p-6 flex items-center justify-center bg-slate-800">
                <XpChart data={data} maxPlayerLevel={playerLevel} maxDinoLevel={dinoLevel} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;