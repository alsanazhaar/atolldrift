import Link from "next/link";
import type { Experience } from "@/lib/types";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience: xp }: ExperienceCardProps) {
  return (
    <Link href={`/experiences/${xp.id}`} className="exp-card" style={{ textDecoration: "none" }}>
      <div className="exp-card-head">
        <div className="exp-cat-row">
          <span className={`exp-cat ${xp.catClass}`}>{xp.catLabel}</span>
          <span className="exp-atoll">{xp.atoll}</span>
        </div>
        <div className="exp-title">{xp.title}</div>
        <div className="exp-host-row">
          <div className="exp-avatar">{xp.hostInitial}</div>
          <span className="exp-host">{xp.hostName}</span>
        </div>
      </div>
      <div className="exp-card-foot">
        <div className="exp-meta">
          <span>{xp.duration}</span>
          <span>{xp.groupSize} guests</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <span className="exp-rating">★ {xp.rating}</span>
          <div className="exp-price">
            ${xp.price}
            <small> / person</small>
          </div>
        </div>
      </div>
    </Link>
  );
}
