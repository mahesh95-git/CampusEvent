import React from "react";

export function Icon({ name, size = 15, color = "currentColor" }) {
  const p = { stroke: color, strokeWidth: "1.3", fill: "none", strokeLinecap: "round" };
  const icons = {
    grid:      <><rect x="1" y="1" width="5.5" height="5.5" rx="1.2" {...p}/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" {...p}/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" {...p}/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" {...p}/></>,
    building:  <><rect x="2" y="2" width="11" height="12" rx="1.5" {...p}/><path d="M5 6h1.5M5 9h1.5M8.5 6H10M8.5 9H10M6 14v-4h3v4" {...p}/></>,
    "user-add":<><circle cx="6" cy="5" r="2.5" {...p}/><path d="M1 13c0-2.8 2.2-5 5-5" {...p}/><path d="M11 9v5M8.5 11.5h5" {...p}/></>,
    calendar:  <><rect x="1.5" y="2.5" width="12" height="11" rx="2" {...p}/><path d="M5 1v3M10 1v3M1.5 6.5h12" {...p}/></>,
    chart:     <><path d="M2 13L5.5 8.5 8.5 10.5 13 4" {...p}/><path d="M2 13h11" {...p}/></>,
    settings:  <><circle cx="7.5" cy="7.5" r="2" {...p}/><path d="M12.5 5.2l-.5-.9c-.2-.4-.7-.6-1.1-.4l-.6.2a3.5 3.5 0 0 0-.6-.4l-.1-.7A1 1 0 0 0 8.7 2H6.8a1 1 0 0 0-.9.9l-.1.7a3.5 3.5 0 0 0-.6.4l-.6-.2A1 1 0 0 0 3.5 4.3l-.9 1.6a1 1 0 0 0 .2 1.2l.6.4v.8l-.6.4A1 1 0 0 0 3 9.8l.9 1.6a1 1 0 0 0 1.1.4l.6-.2.6.4.1.7c.1.5.5.9 1 .9H9c.5 0 .9-.4 1-.9l.1-.7.6-.4.6.2a1 1 0 0 0 1.1-.4l.9-1.6a1 1 0 0 0-.2-1.2l-.6-.4v-.8l.6-.4a1 1 0 0 0-.1-1.3z" {...p} strokeWidth="1.1"/></>,
    bell:      <><path d="M7.5 1.5a4.5 4.5 0 0 1 4.5 4.5v2.5l1 2H2l1-2V6A4.5 4.5 0 0 1 7.5 1.5z" {...p}/><path d="M6 13.5a1.5 1.5 0 0 0 3 0" {...p}/></>,
    chevron:   <path d="M3 5l4.5 4.5L12 5" {...p} strokeLinejoin="round"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 15 15" fill="none">{icons[name]}</svg>;
}
