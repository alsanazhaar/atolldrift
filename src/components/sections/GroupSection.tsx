"use client";

import Link from "next/link";
import { useState } from "react";

const privateGroups = [
  { name: "The Dhoni Journey", desc: "The whole boat. Your group, your pace, your itinerary built with us." },
  { name: "Couple & Small Groups", desc: "Two to four people. We pair you with one other group or you travel solo." },
  { name: "Family Expeditions", desc: "Designed around children who can swim and a pace that keeps everyone whole." },
  { name: "Open Group Departures", desc: "Join six to ten strangers who will not stay strangers. Our most popular format." },
];

interface Departure {
  atoll: string;
  atollClass: string;
  journey: string;
  date: string;
  spots: number;
  spotsLabel: string;
  status: "hot" | "open";
  journeyId: string;
}

interface GroupSectionProps {
  departures: Departure[];
}

export default function GroupSection({ departures }: GroupSectionProps) {
  const [activeTab, setActiveTab] = useState<"departures" | "private">("departures");

  return (
    <section className="group-sec" id="sec-departures">
      <div className="inner">
        <div className="group-left">
          <h2 className="group-title">Group Journeys</h2>
          <p className="group-sub">
            Every departure is small. Six to ten people at most. The ocean does not scale.
          </p>
          <div className="gtabs">
            <button
              className={`gtab${activeTab === "departures" ? " active" : ""}`}
              onClick={() => setActiveTab("departures")}
            >
              Upcoming Departures
            </button>
            <button
              className={`gtab${activeTab === "private" ? " active" : ""}`}
              onClick={() => setActiveTab("private")}
            >
              Private Groups
            </button>
          </div>
        </div>

        <div className="group-right">
          {activeTab === "departures" && (
            <div>
              <div className="dep-list">
                {departures.map((dep, i) => (
                  <div key={i} className="dep-row">
                    <div className="dep-left">
                      <div className="dep-atoll-tag th">{dep.atoll}</div>
                      <div className="dep-name">{dep.journey}</div>
                      <div className="dep-date">{dep.date}</div>
                    </div>
                    <div className="dep-right">
                      <div className={`dep-spots ${dep.status === "hot" ? "sh" : "so"}`}>
                        {dep.spotsLabel}
                      </div>
                      <Link href={`/journeys/${dep.journeyId}`} className="djoin">
                        Join
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/journeys" className="full-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                View All Departures
              </Link>
            </div>
          )}

          {activeTab === "private" && (
            <div>
              <div className="gcards">
                {privateGroups.map((g, i) => (
                  <div key={i} className="gcard">
                    <div className="gcard-name">{g.name}</div>
                    <div className="gcard-desc">{g.desc}</div>
                  </div>
                ))}
              </div>
              <button className="full-btn">Enquire About a Private Group</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
