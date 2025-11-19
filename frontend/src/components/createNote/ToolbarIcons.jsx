import React from 'react';

export const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export const H1Icon = () => (<span className="text-xs font-bold">H1</span>);

export const H2Icon = () => (<span className="text-xs font-semibold">H2</span>);

export const QuoteIcon = () => (<span className="text-xs font-serif">""</span>);

export const CodeIcon = () => (<span className="text-[10px] font-mono">{`</>`}</span>);

export const ClearIcon = () => (<span className="text-[10px]">CLR</span>);
