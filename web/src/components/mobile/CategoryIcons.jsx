import React from 'react';

export const ClockDurationIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="#0284C7" />
    <path
      d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10Z"
      fill="#0369A1"
    />
    <circle cx="24" cy="24" r="14" fill="#FFFFFF" />
    <circle cx="24" cy="24" r="2.5" fill="#0284C7" />
    <path
      d="M24 14V24L30 28"
      stroke="#0284C7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SoilMoneyIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Pouch / Bag body in vibrant green */}
    <path
      d="M14 20C14 16 18 12 24 12C30 12 34 16 34 20L36 34C36 38 32 40 24 40C16 40 12 38 12 34L14 20Z"
      fill="#15803D"
    />
    <path
      d="M17 14C19 12 21 10 24 10C27 10 29 12 31 14"
      stroke="#EAB308"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Upward yellow/gold growth arrow */}
    <path
      d="M24 32V20M24 20L19 25M24 20L29 25"
      stroke="#FACC15"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sprout accent */}
    <circle cx="24" cy="26" r="4.5" fill="#22C55E" />
    <text x="24" y="29" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">₹</text>
  </svg>
);

export const LowRiskDocIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Document sheet */}
    <rect x="12" y="10" width="24" height="30" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
    {/* Red bookmark / tag */}
    <path d="M16 10V18L19.5 15.5L23 18V10H16Z" fill="#EF4444" />
    {/* Bar chart bars */}
    <rect x="25" y="24" width="3" height="10" rx="1.5" fill="#0284C7" />
    <rect x="20" y="28" width="3" height="6" rx="1.5" fill="#EAB308" />
    <rect x="15" y="31" width="3" height="3" rx="1.5" fill="#22C55E" />
  </svg>
);

export const ProtectionShieldIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Shield */}
    <path
      d="M24 8L36 13V24C36 32 30 38 24 40C18 38 12 32 12 24V13L24 8Z"
      fill="#16A34A"
    />
    {/* Checkmark */}
    <path
      d="M18 24L22 28L30 18"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Protection gentle curve underneath */}
    <path
      d="M15 33C17 36 20 37.5 24 37.5C28 37.5 31 36 33 33"
      stroke="#FCA5A5"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
