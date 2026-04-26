"use client";

import type { ResumeData, SectionKey, SectionEmphasis } from "@/types";

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
}

const C = {
  text: "#1a1a1a",
  textSec: "#555555",
  textMuted: "#999999",
  line: "#333333",
  lineLight: "#d0d0d0",
  bg: "#ffffff",
};

function getText(b: { zh: string; en: string } | undefined | null, lang: "zh" | "en"): string {
  if (!b) return "";
  return lang === "zh" ? b.zh || b.en : b.en || b.zh;
}

function SectionHead({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: `1.5px solid ${C.line}`, paddingBottom: "4px", marginBottom: "8px", marginTop: "14px" }}>
      <span style={{ fontSize: "13px", fontWeight: 700, color: C.text, letterSpacing: "0.5px" }}>{title}</span>
    </div>
  );
}

export function ClassicTemplate({ data, sectionOrder, emphasis, language }: TemplateProps) {
  const visibleSections = sectionOrder.filter(
    (key) => key === "personalInfo" || emphasis[key] !== "hidden"
  );
  const info = data.personalInfo;
  const name = getText(info.name, language);

  const renderPersonalInfo = () => {
    if (!name && !info.email) return null;
    const contactParts = [
      info.gender, info.birthDate, info.politicalStatus,
      info.phone, info.email, getText(info.location, language), info.website,
    ].filter(Boolean);
    return (
      <div style={{ textAlign: "center", marginBottom: "6px", paddingBottom: "8px", borderBottom: `1px solid ${C.lineLight}` }}>
        <div style={{ fontSize: "22px", fontWeight: 700, color: C.text, letterSpacing: "1px" }}>{name}</div>
        {getText(info.title, language) && (
          <div style={{ fontSize: "13px", color: C.textSec, marginTop: "2px" }}>{getText(info.title, language)}</div>
        )}
        {contactParts.length > 0 && (
          <div style={{ fontSize: "11px", color: C.textSec, marginTop: "6px" }}>
            {contactParts.join(" | ")}
          </div>
        )}
        {getText(info.summary, language) && (
          <div style={{ fontSize: "11px", color: C.textSec, marginTop: "10px", lineHeight: 1.5, textAlign: "left" }}>{getText(info.summary, language)}</div>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    if (data.education.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "教育背景" : "Education"} />
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: "12px" }}>{getText(edu.school, language)}</span>
                {getText(edu.major, language) && <span style={{ fontSize: "11px", color: C.textSec }}> · {getText(edu.major, language)}</span>}
                {getText(edu.degree, language) && <span style={{ fontSize: "11px", color: C.textSec }}> · {getText(edu.degree, language)}</span>}
              </div>
              <span style={{ fontSize: "11px", color: C.textMuted, flexShrink: 0 }}>{edu.period}</span>
            </div>
            {(edu.gpa || edu.courses.length > 0) && (
              <div style={{ fontSize: "10.5px", color: C.textSec, marginTop: "1px" }}>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
                {edu.gpa && edu.courses.length > 0 && <span> | </span>}
                {edu.courses.length > 0 && <span>{language === "zh" ? "主修" : "Core"}: {edu.courses.join("、")}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderHonors = () => {
    if (data.honors.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "荣誉奖项" : "Honors & Awards"} />
        {data.honors.map((h) => (
          <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px", fontSize: "11px" }}>
            <div>
              <span style={{ fontWeight: 600 }}>{getText(h.title, language)}</span>
              {h.level && <span style={{ color: C.textMuted, marginLeft: "4px" }}>[{h.level}]</span>}
            </div>
            <span style={{ color: C.textMuted, flexShrink: 0 }}>{h.period}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = () => {
    if (data.experience.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "实习经历" : "Internship"} />
        {data.experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: "12px" }}>{getText(exp.company, language)}<span style={{ fontWeight: 400 }}> · {getText(exp.role, language)}</span></span>
              <span style={{ fontSize: "11px", color: C.textMuted, flexShrink: 0 }}>{exp.period}</span>
            </div>
            {getText(exp.description, language) && (
              <div style={{ fontSize: "11px", color: C.textSec, lineHeight: 1.5, marginTop: "2px" }}>{getText(exp.description, language)}</div>
            )}
            {exp.highlights && exp.highlights.length > 0 && (
              <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", fontSize: "11px", color: C.textSec }}>
                {exp.highlights.map((h, i) => <li key={i} style={{ lineHeight: 1.5 }}>{getText(h, language)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "项目经历" : "Projects"} />
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: "12px" }}>{getText(proj.name, language)}{getText(proj.role, language) ? <span style={{ fontWeight: 400 }}> · {getText(proj.role, language)}</span> : null}</span>
              {proj.period && <span style={{ fontSize: "11px", color: C.textMuted, flexShrink: 0 }}>{proj.period}</span>}
            </div>
            {proj.tech.length > 0 && (
              <div style={{ fontSize: "10px", color: C.textSec, marginTop: "2px" }}>
                {proj.tech.join(" · ")}
              </div>
            )}
            {getText(proj.description, language) && (
              <div style={{ fontSize: "11px", color: C.textSec, lineHeight: 1.5, marginTop: "2px" }}>{getText(proj.description, language)}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCampusActivities = () => {
    if (data.campusActivities.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "校园经历" : "Campus Activities"} />
        {data.campusActivities.map((act) => (
          <div key={act.id} style={{ marginBottom: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: "12px" }}>{getText(act.organization, language)}<span style={{ fontWeight: 400 }}> · {getText(act.role, language)}</span></span>
              <span style={{ fontSize: "11px", color: C.textMuted, flexShrink: 0 }}>{act.period}</span>
            </div>
            {getText(act.description, language) && (
              <div style={{ fontSize: "11px", color: C.textSec, lineHeight: 1.5, marginTop: "2px" }}>{getText(act.description, language)}</div>
            )}
            {act.highlights && act.highlights.length > 0 && (
              <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", fontSize: "11px", color: C.textSec }}>
                {act.highlights.map((h, i) => <li key={i} style={{ lineHeight: 1.5 }}>{getText(h, language)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (data.skills.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "技能特长" : "Skills"} />
        {data.skills.map((cat) => (
          <div key={cat.id} style={{ marginBottom: "3px", fontSize: "11px" }}>
            <span style={{ fontWeight: 600 }}>{getText(cat.category, language)}：</span>
            <span style={{ color: C.textSec }}>{cat.items.join(" | ")}</span>
          </div>
        ))}
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

  return (
    <div style={{ padding: "28px 36px", fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif", lineHeight: 1.5, color: C.text, background: C.bg }}>
      {visibleSections.map((key) => (
        <div key={key}>{sectionRenderers[key]?.()}</div>
      ))}
    </div>
  );
}