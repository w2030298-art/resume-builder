"use client";

import type { ResumeData, SectionKey, SectionEmphasis } from "@/types";

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
}

export function CompactTemplate({ data, sectionOrder, emphasis, language }: TemplateProps) {
  const getText = (b: { zh: string; en: string } | undefined | null) =>
    language === "zh" ? (b?.zh || b?.en || "") : (b?.en || b?.zh || "");

  const sectionLabel: Record<SectionKey, string> = {
    personalInfo: "",
    education: language === "zh" ? "教育背景" : "Education",
    honors: language === "zh" ? "荣誉奖项" : "Honors",
    experience: language === "zh" ? "实习经历" : "Experience",
    projects: language === "zh" ? "项目经历" : "Projects",
    campusActivities: language === "zh" ? "校园经历" : "Campus Activities",
    skills: language === "zh" ? "技能特长" : "Skills",
  };

  const renderSectionHeader = (label: string) => (
    <div
      style={{
        borderLeft: "2px solid #2563eb",
        paddingLeft: "6px",
        marginTop: "6px",
        marginBottom: "4px",
        fontSize: "11px",
        fontWeight: 700,
        color: "#1a1a1a",
        lineHeight: 1.3,
      }}
    >
      {label}
    </div>
  );

  const renderPersonalInfo = () => {
    const info = data.personalInfo;
    const name = getText(info.name);
    if (!name && !info.email) return null;

    const title = getText(info.title);
    const headerLine = title ? `${name} | ${title}` : name;

    const contactParts: string[] = [];
    if (info.gender) contactParts.push(info.gender);
    if (info.birthDate) contactParts.push(info.birthDate);
    if (info.politicalStatus) contactParts.push(info.politicalStatus);
    if (info.phone) contactParts.push(info.phone);
    if (info.email) contactParts.push(info.email);
    if (getText(info.location)) contactParts.push(getText(info.location));
    if (info.website) contactParts.push(info.website);

    return (
      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>
          {headerLine}
        </div>
        {contactParts.length > 0 && (
          <div style={{ fontSize: "10px", color: "#4a4a4a", marginTop: "2px", lineHeight: 1.4 }}>
            {contactParts.join(" | ")}
          </div>
        )}
        {getText(info.summary) && (
          <div style={{ fontSize: "10px", fontStyle: "italic", color: "#4a4a4a", marginTop: "2px", lineHeight: 1.45 }}>
            {getText(info.summary)}
          </div>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    if (data.education.length === 0) return null;
    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.education)}
        {data.education.map((edu) => {
          const parts: string[] = [];
          if (getText(edu.school)) parts.push(getText(edu.school));
          if (getText(edu.degree)) parts.push(getText(edu.degree));
          if (getText(edu.major)) parts.push(getText(edu.major));

          return (
            <div key={edu.id} style={{ marginBottom: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, fontSize: "10.5px", color: "#1a1a1a" }}>
                  {parts.join(" · ")}
                </span>
                <span style={{ fontSize: "10px", color: "#888", flexShrink: 0 }}>{edu.period}</span>
              </div>
              {edu.gpa && (
                <div style={{ fontSize: "10px", color: "#4a4a4a", lineHeight: 1.4 }}>
                  GPA: {edu.gpa}
                </div>
              )}
              {edu.courses && edu.courses.length > 0 && (
                <div style={{ fontSize: "10px", color: "#4a4a4a", lineHeight: 1.4 }}>
                  {language === "zh" ? "核心课程" : "Core"}: {edu.courses.join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderHonors = () => {
    if (data.honors.length === 0) return null;

    const shortHonors = data.honors.every(
      (h) => getText(h.title).length <= 12 && !getText(h.description)
    );

    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.honors)}
        {shortHonors ? (
          <div style={{ fontSize: "10.5px", color: "#1a1a1a", lineHeight: 1.5 }}>
            {data.honors.map((h, i) => {
              const text = getText(h.title) + (h.level ? `[${h.level}]` : "");
              return (
                <span key={h.id}>
                  {text}
                  {i < data.honors.length - 1 ? " · " : ""}
                </span>
              );
            })}
          </div>
        ) : (
          data.honors.map((h) => (
            <div key={h.id} style={{ marginBottom: "2px", fontSize: "10.5px", lineHeight: 1.45 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
                  {getText(h.title)}{h.level ? ` [${h.level}]` : ""}
                </span>
                {h.period && <span style={{ fontSize: "10px", color: "#888" }}>{h.period}</span>}
              </div>
              {getText(h.description) && (
                <div style={{ fontSize: "10px", color: "#4a4a4a" }}>{getText(h.description)}</div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderExperience = () => {
    if (data.experience.length === 0) return null;
    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.experience)}
        {data.experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: "10.5px", color: "#1a1a1a" }}>
                {getText(exp.company)} · {getText(exp.role)}
              </span>
              <span style={{ fontSize: "10px", color: "#888", flexShrink: 0 }}>{exp.period}</span>
            </div>
            {exp.highlights && exp.highlights.length > 0 && (
              <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", fontSize: "10.5px", color: "#4a4a4a" }}>
                {exp.highlights.slice(0, 3).map((h, i) => (
                  <li key={i} style={{ lineHeight: 1.45 }}>{getText(h)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (data.projects.length === 0) return null;
    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.projects)}
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: "10.5px", color: "#1a1a1a" }}>
                {getText(proj.name)}{getText(proj.role) ? ` · ${getText(proj.role)}` : ""}
              </span>
              <span style={{ fontSize: "10px", color: "#888", flexShrink: 0 }}>{proj.period}</span>
            </div>
            {proj.tech && proj.tech.length > 0 && (
              <div style={{ fontSize: "9.5px", color: "#888", lineHeight: 1.4 }}>
                {language === "zh" ? "技术" : "Tech"}: {proj.tech.join(", ")}
              </div>
            )}
            {getText(proj.description) ? (
              <div style={{ fontSize: "10.5px", color: "#4a4a4a", lineHeight: 1.45 }}>
                {getText(proj.description)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  const renderCampusActivities = () => {
    if (data.campusActivities.length === 0) return null;
    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.campusActivities)}
        {data.campusActivities.map((act) => (
          <div key={act.id} style={{ marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: "10.5px", color: "#1a1a1a" }}>
                {getText(act.organization)} · {getText(act.role)}
              </span>
              <span style={{ fontSize: "10px", color: "#888", flexShrink: 0 }}>{act.period}</span>
            </div>
            {act.highlights && act.highlights.length > 0 ? (
              <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", fontSize: "10.5px", color: "#4a4a4a" }}>
                {act.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} style={{ lineHeight: 1.45 }}>{getText(h)}</li>
                ))}
              </ul>
            ) : getText(act.description) ? (
              <div style={{ fontSize: "10.5px", color: "#4a4a4a", lineHeight: 1.45 }}>
                {getText(act.description)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (data.skills.length === 0) return null;
    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.skills)}
        <div style={{ fontSize: "10.5px", color: "#1a1a1a", lineHeight: 1.5 }}>
          {data.skills.map((cat, i) => (
            <span key={cat.id}>
              <span style={{ fontWeight: 600 }}>{getText(cat.category)}</span>
              <span style={{ color: "#4a4a4a" }}>: {cat.items.join(", ")}</span>
              {i < data.skills.length - 1 ? <span style={{ color: "#888", margin: "0 4px" }}>|</span> : null}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    personalInfo: renderPersonalInfo,
    education: renderEducation,
    honors: renderHonors,
    experience: renderExperience,
    projects: renderProjects,
    campusActivities: renderCampusActivities,
    skills: renderSkills,
  };

  const visibleSections = sectionOrder.filter(
    (key) => key === "personalInfo" || emphasis[key] !== "hidden"
  );

  return (
    <div
      style={{
        padding: "20px 30px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        lineHeight: 1.45,
        color: "#1a1a1a",
        background: "#ffffff",
      }}
    >
      {visibleSections.map((key) => (
        <div key={key}>{sectionRenderers[key]?.()}</div>
      ))}
    </div>
  );
}