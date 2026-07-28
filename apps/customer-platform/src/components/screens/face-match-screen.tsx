'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Sun, CheckCircle2, ChevronRight } from 'lucide-react';
import {
  INK, INK_SOFT, TEXT_TERTIARY, FONT_STACK, CARD_SHADOW,
  meshDots, scanMessages,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { ScoreRing } from '../shared/score-ring';
import { ScreenKey, ScanStage } from '../../types';

interface FaceMatchProps {
  onBack: () => void;
  onPush: (next: ScreenKey) => void;
}

export function FaceMatch({ onBack, onPush }: FaceMatchProps) {
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
      <div className="relative mx-auto max-w-md md:max-w-xl" style={{ paddingBottom: '40px' }}>
        <SimpleHeader title="AI Face Match" onBack={onBack} />

        <div className="px-6 text-center mt-1 mb-5">
          <h2 className="text-xl font-semibold mb-1" style={{ color: INK }}>
            {stage === 'positioning' && 'Position Your Face'}
            {stage === 'detected' && 'Face Aligned'}
            {stage === 'scanning' && 'Analyzing Skin...'}
            {stage === 'complete' && 'Scan Complete!'}
          </h2>
          <p className="text-xs" style={{ color: TEXT_TERTIARY }}>
            {stage === 'positioning' && 'Center your face inside the bounding frame'}
            {stage === 'detected' && 'Hold still — click Start Scan to begin'}
            {stage === 'scanning' && scanMessages[msgIdx]}
            {stage === 'complete' && 'Your updated Skin Score report is ready'}
          </p>
        </div>

        {stage !== 'complete' ? (
          <div className="px-6">
            <div
              className="relative mx-auto overflow-hidden shadow-2xl border border-stone-200 dark:border-slate-700 bg-stone-900"
              style={{ width: '100%', maxWidth: '320px', height: '380px', borderRadius: '36px' }}
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
                  <p className="text-xs font-semibold text-stone-300">Simulating Live Camera Stream</p>
                </div>
              )}

              {/* Bounding Frame */}
              <div
                className="absolute inset-0 m-auto border-2 border-dashed pointer-events-none transition-colors duration-300"
                style={{
                  width: '210px',
                  height: '270px',
                  borderRadius: '130px',
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
                <div className="absolute inset-0 m-auto pointer-events-none" style={{ width: '210px', height: '270px' }}>
                  {meshDots.map((dot, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50"
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

              {/* Scanning Glow Line */}
              {isScanning && (
                <div
                  className="app-scanline absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0"
                  style={{ boxShadow: '0 0 16px #10B981' }}
                />
              )}

              {/* Lighting Badge */}
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-white">
                <Sun size={12} className="text-amber-300" />
                <span>Good Lighting</span>
              </div>
            </div>

            {/* Bottom Actions & Controls Box */}
            <div className="mt-6 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700" style={{ boxShadow: CARD_SHADOW }}>
              {stage === 'positioning' && (
                <div className="text-center py-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-indigo-300 text-xs font-semibold mb-2">
                    <Sparkles size={13} /> Align face inside oval
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Keep camera at eye level with even lighting</p>
                </div>
              )}

              {stage === 'detected' && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
                    <CheckCircle2 size={14} /> Perfect Alignment
                  </div>
                  <button
                    type="button"
                    onClick={() => setStage('scanning')}
                    className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                    style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}
                  >
                    Start AI Scan
                  </button>
                </div>
              )}

              {stage === 'scanning' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2" style={{ color: INK }}>
                    <span>Scanning Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Scan Completion View */
          <div className="px-6 app-fade">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-100 dark:border-slate-700 text-center mb-6" style={{ boxShadow: CARD_SHADOW }}>
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: INK }}>
                Analysis Complete!
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
                Your face scan has been successfully evaluated by Medivo AI engine.
              </p>
              <div className="flex justify-center mb-6">
                <ScoreRing score={87} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-slate-700 border border-indigo-100 dark:border-slate-600">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Hydration</p>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-300">76% (+8%)</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-slate-700 border border-emerald-100 dark:border-slate-600">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Skin Score</p>
                  <p className="text-lg font-bold text-emerald-900 dark:text-emerald-300">87 (+4)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onPush('scanReport')}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/20 active:scale-98 transition-all"
                style={{ background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
              >
                View Full Scan Report <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
