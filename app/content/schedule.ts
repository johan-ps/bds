import { pexels } from "../lib/images";

export const schedule = [
  {
    day: "Monday",
    sessions: [
      { time: "6:30 AM", className: "Glow Flow", location: "Northside" },
      { time: "7:00 PM", className: "Bollyfit Burn", location: "Downtown" },
    ],
  },
  {
    day: "Tuesday",
    sessions: [
      { time: "6:00 AM", className: "Rhythm Remix", location: "Westpark" },
      { time: "8:00 PM", className: "Kuthu Power", location: "Downtown" },
    ],
  },
  {
    day: "Wednesday",
    sessions: [
      { time: "6:30 AM", className: "Bollyfit Burn", location: "Northside" },
      { time: "7:30 PM", className: "Semiclassical Flow", location: "Waterfront" },
    ],
  },
  {
    day: "Thursday",
    sessions: [
      { time: "6:00 AM", className: "Kuthu Power", location: "Downtown" },
      { time: "7:15 PM", className: "Rhythm Remix", location: "Northside" },
    ],
  },
  {
    day: "Friday",
    sessions: [
      { time: "6:30 AM", className: "Glow Flow", location: "Waterfront" },
      { time: "7:00 PM", className: "Bollyfit Burn", location: "Westpark" },
    ],
  },
  {
    day: "Saturday",
    sessions: [
      { time: "9:00 AM", className: "Kuthu Power", location: "Downtown" },
      { time: "11:00 AM", className: "Family Groove", location: "Westpark" },
    ],
  },
  {
    day: "Sunday",
    sessions: [
      { time: "10:00 AM", className: "Rhythm Remix", location: "Waterfront" },
      { time: "12:00 PM", className: "Glow Flow", location: "Northside" },
    ],
  },
];

export const scheduleHeroImage = {
  src: pexels("34473000", 1200),
  alt: "Traditional dancer in motion",
};
