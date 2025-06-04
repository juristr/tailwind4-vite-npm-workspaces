import React, { useState, useEffect } from 'react';
import { Skull, Lock, ShieldAlert, Clock } from 'lucide-react';

const HackedOverlay = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [glitchClass, setGlitchClass] = useState('');
  
  useEffect(() => {
    // Update countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    // Apply random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchClass('glitch');
      setTimeout(() => setGlitchClass(''), 150);
    }, 3000);
    
    return () => {
      clearInterval(timer);
      clearInterval(glitchInterval);
    };
  }, []);
  
  // Format time to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        {/* "Shadow" Skull background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <Skull className="w-full h-full max-w-[500px] max-h-[500px]" />
        </div>
        
        {/* Main content */}
        <div className={`relative z-10 max-w-3xl mx-auto ${glitchClass}`}>
          <div className="flex items-center justify-center mb-6">
            <ShieldAlert size={56} className="text-red-500 mr-4" strokeWidth={1.5} />
            <h1 className="text-red-500 text-5xl md:text-6xl font-bold tracking-tighter uppercase">SITE HACKED</h1>
            <Lock size={56} className="text-red-500 ml-4" strokeWidth={1.5} />
          </div>
          
          <div className="bg-gray-900 border border-red-500 p-6 rounded-lg mb-8 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <h2 className="text-2xl md:text-3xl font-mono text-white mb-6">
              YOUR WEBSITE HAS BEEN ENCRYPTED
            </h2>
            
            <p className="text-gray-300 mb-6 text-lg tracking-wide">
              All your files, databases, backups, and customer information have been encrypted using military-grade encryption. 
              Normal operation of your website is <span className="text-red-400 font-semibold">IMPOSSIBLE</span> until decryption.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <h3 className="text-yellow-400 font-mono text-xl mb-2">CRY AND COMMIT IT</h3>
                <ul className="text-left text-gray-400 space-y-1">
                  <li>• Forgot to Secure the Remote Cache</li>
                  <li>• Gave Local Write Access to Dev Machines</li>
                  <li>• No Artifact Integrity Validation</li>
                  <li>• No Access Token Revocation</li>
                  <li>• Blindly Trusted All CI Jobs</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <h3 className="text-yellow-400 font-mono text-xl mb-2">YOU SHOULD HAVE FIXED IT</h3>
                <ul className="text-left text-gray-400 space-y-1">
                  <li>• Upgrade to Nx Cloud Secure Caching</li>
                  <li>• Allow Writes Only from Trusted CI Pipelines</li>
                  <li>• Tie Artifacts to User or Process Identity</li>
                  <li>• Automatically Invalidate on Token Revocation</li>
                  <li>• Enforce Fine-Grained Access Control</li>
                </ul>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-center mb-2">
                <Clock size={24} className="text-red-400 mr-2" />
                <h3 className="text-red-400 text-xl font-mono">TIME REMAINING TO PAY</h3>
              </div>
              <div className="text-white text-5xl font-mono bg-black py-2 px-4 inline-block rounded">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-400 mt-2 text-sm">
                After this time, the price will be doubled and your data will be leaked
              </p>
            </div>
            
            <div className="mb-6">
              <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-lg font-bold text-xl transition-colors duration-300 mx-2"
                >
                PAY 0.5 BTC TO DECRYPT
              </button>
              <a 
                href="https://nx.dev/nx-cloud" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded-lg font-bold text-xl transition-colors duration-300 mt-4 md:mt-0 mx-2"
              >
                UPGRADE TO SECURE CACHING
              </a>
            </div>
            
            <div className="text-xs text-gray-500 mt-4 font-mono">
              Transaction ID: f8a7c6d5b4a3e2f1c0b9a8d7c6b5a4e3f2d1c0b9
            </div>
          </div>
          
          <div className="font-mono text-red-400 text-sm">
            <p>Powered by Artifact Poisoning 2.0™</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackedOverlay;