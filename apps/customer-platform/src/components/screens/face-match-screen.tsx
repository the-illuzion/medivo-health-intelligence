'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Sun, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import {
  INK, FONT_STACK, CARD_SHADOW,
  meshDots, scanMessages,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { ScoreRing } from '../shared/score-ring';
import { BottomNav } from '../shared/bottom-nav';
import { ScreenKey, ScanStage } from '../../types';

interface FaceMatchProps {
  onBack: () => void;
  onPush: (next: ScreenKey) => void;
  onSwitchTab?: (tab: ScreenKey) => void;
  showBack?: boolean;
}

export function FaceMatch({ onBack, onPush, onSwitchTab, showBack = true }: FaceMatchProps) {
  const [stage, setStage] = useState<ScanStage>('positioning');
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Camera access fallback:', err);
      }
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (stage !== 'positioning') return;
    const t = setTimeout(() => setStage('detected'), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'scanning') return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage('complete'), 400);
          return 100;
        }
        return p + 2;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'scanning') return;
    const msgInterval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % scanMessages.length);
    }, 1100);
    return () => clearInterval(msgInterval);
  }, [stage]);

  const isScanning = stage === 'scanning';

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-6xl lg:px-8" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="AI Face Match Analysis" onBack={onBack} showBack={showBack} />

        <div className="px-6 lg:px-0 text-center lg:text-left mt-2 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
            {stage === 'positioning' && 'Position Your Face'}
            {stage === 'detected' && 'Face Aligned & Verified'}
            {stage === 'scanning' && 'Analyzing Skin Telemetry...'}
            {stage === 'complete' && 'AI Scan Complete!'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            {stage === 'positioning' && 'Center your face inside the bounding oval for accurate scanning'}
            {stage === 'detected' && 'Hold still — click Start Scan to run clinical analysis'}
            {stage === 'scanning' && scanMessages[msgIdx]}
            {stage === 'complete' && 'Your updated Skin Score & hydration metrics report is ready'}
          </p>
        </div>

        {stage !== 'complete' ? (
          /* Live Camera View & Controls Grid */
          <div className="px-6 lg:px-0 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Camera Frame (Left Column on Desktop) */}
            <div className="lg:col-span-6 flex justify-center mb-6 lg:mb-0">
              <div
                className="relative w-full max-w-[340px] sm:max-w-[380px] h-[400px] sm:h-[440px] overflow-hidden shadow-2xl border border-stone-200 dark:border-slate-700 bg-stone-900"
                style={{ borderRadius: '36px' }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                  style={{ display: cameraActive ? 'block' : 'none' }}
                />

                {!cameraActive && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-6 text-center">
                    <div className="w-20 h-20 rounded-full border-2 border-indigo-400/40 flex items-center justify-center mb-3">
                      <Sparkles size={32} className="text-indigo-400 animate-pulse" />
                    </div>
                    <p className="text-xs font-semibold text-stone-300">Simulating Live WebRTC Camera Feed</p>
                  </div>
                )}

                {/* Bounding Oval Frame */}
                <div
                  className="absolute inset-0 m-auto border-2 border-dashed pointer-events-none transition-colors duration-300"
                  style={{
                    width: '220px',
                    height: '280px',
                    borderRadius: '135px',
                    borderColor: isScanning ? '#10B981' : stage === 'detected' ? '#10B981' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>

                {/* Landmark Mesh Dots */}
                {(stage === 'detected' || isScanning) && (
                  <div className="absolute inset-0 m-auto pointer-events-none" style={{ width: '220px', height: '280px' }}>
                    {meshDots.map((dot, i) => (
                      <div
                        key={i}
                        className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/60"
                        style={{
                          top: dot.top,
                          left: dot.left,
                          transform: 'translate(-50%, -50%)',
                          animation: `appDotReveal 0.6s ease ${i * 60}ms forwards`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Scanning Glowing Green Scanline */}
                {isScanning && (
                  <div
                    className="app-scanline absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0"
                    style={{ boxShadow: '0 0 16px #10B981' }}
                  />
                )}

                {/* Lighting Status Badge */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-white shadow-md">
                  <Sun size={14} className="text-amber-300" />
                  <span className="font-semibold">Optimal Lighting</span>
                </div>
              </div>
            </div>

            {/* Scan Telemetry & Control Panel (Right Column on Desktop) */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-100 dark:border-slate-700 shadow-md">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-indigo-600 dark:text-indigo-400" />
                  Scan Status & Alignment
                </h3>

                {stage === 'positioning' && (
                  <div>
                    <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-700/60 border border-indigo-100 dark:border-slate-600 mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                        <Sparkles size={14} /> Automatic Alignment active
                      </div>
                      <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                        Hold device at eye level. Medivo AI engine will auto-verify facial boundaries.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-700 border border-stone-100 dark:border-slate-600">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Lighting</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Good</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-700 border border-stone-100 dark:border-slate-600">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Angle</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Centered</span>
                      </div>
                    </div>
                  </div>
                )}

                {stage === 'detected' && (
                  <div>
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-700/60 border border-emerald-200 dark:border-emerald-900/60 mb-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                        <CheckCircle2 size={16} /> Bounding Frame Aligned
                      </div>
                      <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                        9 landmark mesh points acquired. Ready for high-resolution skin telemetry scan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStage('scanning')}
                      className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-98 transition-all"
                      style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}
                    >
                      Start AI Skin Scan
                    </button>
                  </div>
                )}

                {stage === 'scanning' && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2 text-slate-900 dark:text-slate-100">
                      <span>Analyzing Telemetry</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{progress}%</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-500 dark:text-slate-400 text-center font-medium animate-pulse">
                      {scanMessages[msgIdx]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Scan Completion View */
          <div className="px-6 lg:px-0 app-fade">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-stone-100 dark:border-slate-700 text-center shadow-xl max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                AI Analysis Complete!
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mb-6">
                Your face scan has been successfully evaluated by Medivo Clinical AI engine.
              </p>

              <div className="flex justify-center mb-6">
                <ScoreRing score={87} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-700 border border-indigo-100 dark:border-slate-600">
                  <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">Hydration Level</p>
                  <p className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300">76% (+8%)</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-700 border border-emerald-100 dark:border-slate-600">
                  <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">Skin Score</p>
                  <p className="text-xl font-extrabold text-emerald-900 dark:text-emerald-300">87 (+4)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPush('scanReport')}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-98 transition-all"
                style={{ background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
              >
                View Detailed Scan Report <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        {onSwitchTab && <BottomNav active="faceMatch" onSwitchTab={onSwitchTab} />}
      </div>
    </div>
  );
}
