"use client";

import type { ResumeData, SectionKey, SectionEmphasis } from "@/types";

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
}

const SIDEBAR_BG = "#2c3e50";
const SIDEBAR_TEXT = "#ecf0f1";
const SIDEBAR_TEXT_LIGHT = "#bdc3c7";
const SIDEBAR_ACCENT = "#3498db";
const MAIN_TEXT = "#2c3e50";
const MAIN_TEXT_SECONDARY = "#555555";
const MAIN_TEXT_MUTED = "#7f8c8d";
const MAIN_BORDER = "#e0e4e8";
const SECTION_LINE = "#3498db";
const HONOR_LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  national: { bg: "#c0392b", color: "#ffffff" },
  国家级: { bg: "#c0392b", color: "#ffffff" },
  provincial: { bg: "#e67e22", color: "#ffffff" },
  省级: { bg: "#e67e22", color: "#ffffff" },
  university: { bg: "#2980b9", color: "#ffffff" },
  校级: { bg: "#2980b9", color: "#ffffff" },
};
const DEFAULT_HONOR_LEVEL = { bg: "#7f8c8d", color: "#ffffff" };

const SECTION_LABELS: Record<SectionKey, { zh: string; en: string }> = {
  personalInfo: { zh: "基本信息", en: "Personal Info" },
  education: { zh: "教育背景", en: "Education" },
  honors: { zh: "荣誉奖项", en: "Honors & Awards" },
  experience: { zh: "实习经历", en: "Internship" },
  projects: { zh: "项目经历", en: "Projects" },
  campusActivities: { zh: "校园经历", en: "Campus Activities" },
  skills: { zh: "技能特长", en: "Skills" },
};

export function ModernTemplate({
  data,
  sectionOrder,
  emphasis,
  language,
}: TemplateProps) {
  const getText = (b: { zh: string; en: string } | undefined | null) => {
    if (!b) return "";
    return language === "zh" ? b.zh || b.en : b.en || b.zh;
  };

  const renderSidebarPersonalInfo = () => {
    const info = data.personalInfo;
    const name = getText(info.name);
    if (!name && !info.email) return null;

    return (
      <div>
        {info.avatarUrl ? (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto 10px",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            <img
              src={info.avatarUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: SIDEBAR_TEXT_LIGHT,
              fontWeight: 300,
            }}
          >
            {name ? name.charAt(0) : ""}
          </div>
        )}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: SIDEBAR_TEXT,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {name}
        </div>
        {getText(info.title) && (
          <div
            style={{
              fontSize: "11px",
              color: SIDEBAR_TEXT_LIGHT,
              textAlign: "center",
              marginTop: "3px",
            }}
          >
            {getText(info.title)}
          </div>
        )}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.2)",
            margin: "10px 0",
          }}
        />
        <div
          style={{
            fontSize: "10px",
            color: SIDEBAR_TEXT_LIGHT,
            lineHeight: 1.8,
          }}
        >
          {[info.gender, info.birthDate, info.politicalStatus]
            .filter(Boolean)
            .map((v) => v)
            .length > 0 && (
            <div>
              {[info.gender, info.birthDate, info.politicalStatus]
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}
          {info.phone && <div>📱 {info.phone}</div>}
          {info.email && <div>✉ {info.email}</div>}
          {getText(info.location) && <div>📍 {getText(info.location)}</div>}
          {info.website && <div>🔗 {info.website}</div>}
        </div>
      </div>
    );
  };

  const renderSidebarSkills = () => {
    if (data.skills.length === 0) return null;
    return (
      <div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: SIDEBAR_TEXT,
            marginBottom: "8px",
            paddingBottom: "4px",
            borderBottom: `2px solid ${SIDEBAR_ACCENT}`,
          }}
        >
          {getText(SECTION_LABELS.skills)}
        </div>
        {data.skills.map((cat) => (
          <div key={cat.id} style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: SIDEBAR_TEXT_LIGHT,
                marginBottom: "3px",
              }}
            >
              {getText(cat.category)}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: SIDEBAR_TEXT,
                lineHeight: 1.6,
              }}
            >
              {cat.items.join(" · ")}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMainSectionHeader = (sectionKey: SectionKey) => (
    <div
      style={{
        fontSize: "13px",
        fontWeight: 700,
        color: MAIN_TEXT,
        marginBottom: "6px",
        paddingBottom: "3px",
        borderBottom: `2px solid ${SECTION_LINE}`,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {getText(SECTION_LABELS[sectionKey])}
    </div>
  );

  const renderEducation = () => {
    if (data.education.length === 0) return null;
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("education")}
        {data.education.map((edu) => {
          const parts = [getText(edu.school)];
          if (getText(edu.degree)) parts.push(getText(edu.degree));
          if (getText(edu.major)) parts.push(getText(edu.major));
          return (
            <div
              key={edu.id}
              style={{ marginBottom: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: MAIN_TEXT,
                    }}
                  >
                    {parts.join(" · ")}
                  </span>
                  {edu.gpa && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: SIDEBAR_ACCENT,
                        fontWeight: 600,
                        marginLeft: "8px",
                      }}
                    >
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: MAIN_TEXT_MUTED,
                    flexShrink: 0,
                  }}
                >
                  {edu.period}
                </div>
              </div>
              {edu.courses && edu.courses.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    flexWrap: "wrap",
                    marginTop: "3px",
                  }}
                >
                  {edu.courses.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "9px",
                        padding: "1px 6px",
                        borderRadius: "3px",
                        background: "#eaf2f8",
                        color: "#2980b9",
                      }}
                    >
                      {c}
                    </span>
                  ))}
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
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("honors")}
        {data.honors.map((honor) => {
          const levelStyle =
            HONOR_LEVEL_COLORS[honor.level] || DEFAULT_HONOR_LEVEL;
          return (
            <div
              key={honor.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "4px",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontWeight: 600, color: MAIN_TEXT }}>
                  {getText(honor.title)}
                </span>
                {honor.level && (
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      background: levelStyle.bg,
                      color: levelStyle.color,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {honor.level}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {honor.period}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderExperience = () => {
    if (data.experience.length === 0) return null;
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("experience")}
        {data.experience.map((exp, idx) => (
          <div
            key={exp.id}
            style={{
              marginBottom: idx < data.experience.length - 1 ? "8px" : 0,
              paddingBottom: idx < data.experience.length - 1 ? "8px" : 0,
              borderBottom:
                idx < data.experience.length - 1
                  ? `1px solid ${MAIN_BORDER}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 600, fontSize: "11px", color: MAIN_TEXT }}
                >
                  {getText(exp.company)}
                </span>
                {getText(exp.role) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: MAIN_TEXT_SECONDARY,
                      fontWeight: 400,
                    }}
                  >
                    {" · "}
                    {getText(exp.role)}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {exp.period}
              </span>
            </div>
            {exp.highlights && exp.highlights.length > 0 && (
              <ul
                style={{
                  margin: "3px 0 0 0",
                  paddingLeft: "14px",
                  fontSize: "10.5px",
                  color: MAIN_TEXT_SECONDARY,
                  lineHeight: 1.6,
                }}
              >
                {exp.highlights.map((h, i) => (
                  <li key={i}>{getText(h)}</li>
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
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("projects")}
        {data.projects.map((proj, idx) => (
          <div
            key={proj.id}
            style={{
              marginBottom: idx < data.projects.length - 1 ? "8px" : 0,
              paddingBottom: idx < data.projects.length - 1 ? "8px" : 0,
              borderBottom:
                idx < data.projects.length - 1
                  ? `1px solid ${MAIN_BORDER}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 600, fontSize: "11px", color: MAIN_TEXT }}
                >
                  {getText(proj.name)}
                </span>
                {getText(proj.role) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: MAIN_TEXT_SECONDARY,
                      fontWeight: 400,
                    }}
                  >
                    {" · "}
                    {getText(proj.role)}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {proj.period}
              </span>
            </div>
            {proj.tech && proj.tech.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  flexWrap: "wrap",
                  marginTop: "3px",
                }}
              >
                {proj.tech.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "9px",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      background: "#eaf2f8",
                      color: "#2980b9",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {getText(proj.description) && (
              <div style={{ fontSize: "10.5px", color: MAIN_TEXT_SECONDARY, lineHeight: 1.6, marginTop: "2px" }}>
                {getText(proj.description)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCampusActivities = () => {
    if (data.campusActivities.length === 0) return null;
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("campusActivities")}
        {data.campusActivities.map((act, idx) => (
          <div
            key={act.id}
            style={{
              marginBottom: idx < data.campusActivities.length - 1 ? "8px" : 0,
              paddingBottom: idx < data.campusActivities.length - 1 ? "8px" : 0,
              borderBottom:
                idx < data.campusActivities.length - 1
                  ? `1px solid ${MAIN_BORDER}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 600, fontSize: "11px", color: MAIN_TEXT }}
                >
                  {getText(act.organization)}
                </span>
                {getText(act.role) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: MAIN_TEXT_SECONDARY,
                      fontWeight: 400,
                    }}
                  >
                    {" · "}
                    {getText(act.role)}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {act.period}
              </span>
            </div>
            {act.highlights && act.highlights.length > 0 && (
              <ul
                style={{
                  margin: "3px 0 0 0",
                  paddingLeft: "14px",
                  fontSize: "10.5px",
                  color: MAIN_TEXT_SECONDARY,
                  lineHeight: 1.6,
                }}
              >
                {act.highlights.map((h, i) => (
                  <li key={i}>{getText(h)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const sidebarSections: SectionKey[] = ["personalInfo", "skills"];
  const mainSections: SectionKey[] = [
    "education",
    "honors",
    "experience",
    "projects",
    "campusActivities",
  ];

  const sidebarRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: renderSidebarPersonalInfo,
    skills: renderSidebarSkills,
  };

  const mainRenderers: Record<string, () => React.ReactNode> = {
    education: renderEducation,
    honors: renderHonors,
    experience: renderExperience,
    projects: renderProjects,
    campusActivities: renderCampusActivities,
  };

  const visibleSidebarSections = sidebarSections.filter(
    (key) => emphasis[key] !== "hidden"
  );
  const visibleMainSections = sectionOrder.filter(
    (key) =>
      mainSections.includes(key) &&
      (key === "education" || emphasis[key] !== "hidden")
  );
  if (visibleMainSections.length === 0) {
    const fallback = mainSections.filter((k) => emphasis[k] !== "hidden");
    visibleMainSections.push(...fallback);
  }

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "system-ui, -apple-system, sans-serif",
        lineHeight: 1.5,
        display: "flex",
        color: MAIN_TEXT,
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "30%",
          background: SIDEBAR_BG,
          color: SIDEBAR_TEXT,
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {visibleSidebarSections.map((key) => (
          <div key={key}>{sidebarRenderers[key]?.()}</div>
        ))}
      </div>
      <div
        style={{
          width: "70%",
          padding: "24px 24px 20px",
        }}
      >
        {visibleMainSections.map((key) => (
          <div key={key}>{mainRenderers[key]?.()}</div>
        ))}
      </div>
    </div>
  );
}