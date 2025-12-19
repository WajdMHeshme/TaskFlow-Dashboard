// src/components/toast/ToastProvider.tsx
import React from "react";
import { Toaster } from "react-hot-toast";

const AnimatedCheck: React.FC = () => (
  <svg
    className="animated-check"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle
      className="circle"
      cx="12"
      cy="12"
      r="9"
      stroke="#10b981"
      strokeWidth="1.6"
      fill="none"
    />
    <path
      className="check"
      d="M7.5 12.5l2.5 2.5L16.5 9"
      stroke="#10b981"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <style>{`
      .animated-check .circle {
        stroke-dasharray: 60;
        stroke-dashoffset: 60;
        animation: circle-draw 600ms ease-out forwards;
      }
      .animated-check .check {
        stroke-dasharray: 40;
        stroke-dashoffset: 40;
        animation: check-draw 450ms ease-out 220ms forwards;
      }
      @keyframes circle-draw { to { stroke-dashoffset: 0; } }
      @keyframes check-draw { to { stroke-dashoffset: 0; } }
    `}</style>
  </svg>
);

const AnimatedCross: React.FC = () => (
  <svg
    className="animated-cross"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle
      className="circle"
      cx="12"
      cy="12"
      r="9"
      stroke="#ef4444"
      strokeWidth="1.6"
      fill="none"
    />
    <g className="cross" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round">
      <path className="c1" d="M9 9l6 6" fill="none" />
      <path className="c2" d="M15 9l-6 6" fill="none" />
    </g>
    <style>{`
      .animated-cross .circle {
        stroke-dasharray: 60;
        stroke-dashoffset: 60;
        animation: circle-draw-red 600ms ease-out forwards;
      }
      .animated-cross .c1, .animated-cross .c2 {
        stroke-dasharray: 20;
        stroke-dashoffset: 20;
        animation: cross-draw 380ms ease-out 240ms forwards;
      }
      @keyframes circle-draw-red { to { stroke-dashoffset: 0; } }
      @keyframes cross-draw { to { stroke-dashoffset: 0; } }
    `}</style>
  </svg>
);

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 2000,
        style: {
          background: "#0b1f16",
          color: "#fff",      
          fontWeight: 600,
          padding: "14px 18px",        
          borderRadius: "16px",        
          boxShadow: "0 12px 35px rgba(0,0,0,0.55)", 
          border: "1px solid rgba(255,255,255,0.1)", 
        },
        success: { icon: <AnimatedCheck /> },
        error: { icon: <AnimatedCross /> },
      }}
    />
  );
};

export default ToastProvider;
