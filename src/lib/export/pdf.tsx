"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import type { ResumeData, SectionKey, SectionEmphasis, TemplateName } from "@/types";

Font.register({
  family: "Noto",
  fonts: [
    { src: "/NotoSansSC-Regular.ttf", fontWeight: 400 },
    { src: "/NotoSansSC-Bold.ttf", fontWeight: 700 },
  ],
});

interface PDFProps {
  data: ResumeData;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
  template: TemplateName;
}

function getText(b: { zh: string; en: string } | undefined | null, lang: "zh" | "en"): string {
  if (!b) return "";
  return lang === "zh" ? b.zh || b.en : b.en || b.zh;
}

const SECTION_LABELS: Record<SectionKey, { zh: string; en: string }> = {
  personalInfo: { zh: "基本信息", en: "Personal Info" },
  education: { zh: "教育背景", en: "Education" },
  honors: { zh: "荣誉奖项", en: "Honors & Awards" },
  experience: { zh: "实习经历", en: "Internship" },
  projects: { zh: "项目经历", en: "Projects" },
  campusActivities: { zh: "校园经历", en: "Campus Activities" },
  skills: { zh: "技能特长", en: "Skills" },
};

function label(key: SectionKey, lang: "zh" | "en") {
  return lang === "zh" ? SECTION_LABELS[key].zh : SECTION_LABELS[key].en;
}

export function createResumePDF({ data, sectionOrder, emphasis, language, template }: PDFProps) {
  const visibleSections = sectionOrder.filter(
    (key) => key === "personalInfo" || emphasis[key] !== "hidden"
  );

  switch (template) {
    case "modern":
      return createModernPDF(data, visibleSections, emphasis, language);
    case "minimal":
      return createMinimalPDF(data, visibleSections, emphasis, language);
    case "compact":
      return createCompactPDF(data, visibleSections, emphasis, language);
    default:
      return createClassicPDF(data, visibleSections, emphasis, language);
  }
}

function createClassicPDF(data: ResumeData, sections: SectionKey[], emphasis: Partial<Record<SectionKey, SectionEmphasis>>, language: "zh" | "en") {
  const s = StyleSheet.create({
    page: { padding: "28px 36px", fontFamily: "Noto", fontSize: 11, color: "#1a1a1a", lineHeight: 1.5 },
    name: { fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 2 },
    title: { fontSize: 13, color: "#555", textAlign: "center", marginBottom: 2 },
    contacts: { flexDirection: "row", justifyContent: "center", gap: 10, fontSize: 11, color: "#555", marginTop: 4, flexWrap: "wrap" },
    summary: { fontSize: 11, color: "#555", lineHeight: 1.5 },
    sectionHead: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginTop: 14, marginBottom: 4, paddingBottom: 3, borderBottomWidth: 1.5, borderBottomColor: "#000" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    bold: { fontWeight: 700, fontSize: 12 },
    secondary: { fontSize: 11, color: "#555" },
    muted: { fontSize: 11, color: "#999" },
    mutedSmall: { fontSize: 10.5, color: "#999" },
    body11: { fontSize: 11, color: "#555", lineHeight: 1.5 },
    bullet: { flexDirection: "row", marginLeft: 14, marginBottom: 0 },
    bulletDot: { width: 10, fontSize: 11, color: "#555" },
    bulletText: { flex: 1, fontSize: 11, color: "#555", lineHeight: 1.5 },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 2 },
    tag: { fontSize: 10, paddingHorizontal: 4, paddingVertical: 0, borderRadius: 2, backgroundColor: "#f5f5f5", color: "#555", borderWidth: 0.5, borderColor: "#e0e0e0" },
    skillCat: { fontWeight: 700, fontSize: 11 },
    divider: { height: 0.5, backgroundColor: "#ccc", marginTop: 4 },
  });

  const info = data.personalInfo;
  const name = getText(info.name, language);

  const renderPersonalInfo = () => {
    if (!name && !info.email) return null;
    return (
      <View style={{ marginBottom: 6, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
        {name ? <Text style={s.name}>{name}</Text> : null}
        {getText(info.title, language) ? <Text style={s.title}>{getText(info.title, language)}</Text> : null}
        <View style={s.contacts}>
          {[info.gender, info.birthDate, info.politicalStatus, info.phone, info.email, getText(info.location, language), info.website].filter(Boolean).map((t, i) => <Text key={i}>{t}</Text>)}
        </View>
        {getText(info.summary, language) ? <Text style={s.summary}>{getText(info.summary, language)}</Text> : null}
      </View>
    );
  };

  const renderEducation = () => {
    if ((data.education?.length ?? 0) === 0) return null;
    return (
      <View>
        <Text style={s.sectionHead}>{label("education", language)}</Text>
        {data.education.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 6 }}>
            <View style={s.row}>
              <Text><Text style={s.bold}>{getText(edu.school, language)}</Text>{getText(edu.major, language) ? <Text style={s.secondary}> · {getText(edu.major, language)}</Text> : null}{getText(edu.degree, language) ? <Text style={s.secondary}> · {getText(edu.degree, language)}</Text> : null}</Text>
              {edu.period ? <Text style={s.muted}>{edu.period}</Text> : null}
            </View>
            {(edu.gpa || (edu.courses?.length ?? 0) > 0) ? (
              <Text style={s.secondary}>{edu.gpa ? `GPA: ${edu.gpa}` : ""}{edu.gpa && (edu.courses?.length ?? 0) > 0 ? " | " : ""}{(edu.courses?.length ?? 0) > 0 ? `${language === "zh" ? "主修" : "Core"}: ${edu.courses.join("、")}` : ""}</Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderHonors = () => {
    if ((data.honors?.length ?? 0) === 0) return null;
    return (
      <View>
        <Text style={s.sectionHead}>{label("honors", language)}</Text>
        {data.honors.map((h) => (
          <View key={h.id} style={{ marginBottom: 3 }}>
            <View style={s.row}>
              <Text><Text style={{ fontWeight: 600, fontSize: 11 }}>{getText(h.title, language)}</Text>{h.level ? <Text style={s.mutedSmall}> [{h.level}]</Text> : null}</Text>
              {h.period ? <Text style={s.muted}>{h.period}</Text> : null}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderExperience = () => {
    if ((data.experience?.length ?? 0) === 0) return null;
    return (
      <View>
        <Text style={s.sectionHead}>{label("experience", language)}</Text>
        {data.experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 6 }}>
            <View style={s.row}>
              <Text><Text style={s.bold}>{getText(exp.company, language)}</Text><Text style={{ fontSize: 12, fontWeight: 400 }}> · {getText(exp.role, language)}</Text></Text>
              {exp.period ? <Text style={s.muted}>{exp.period}</Text> : null}
            </View>
            {getText(exp.description, language) ? <Text style={s.body11}>{getText(exp.description, language)}</Text> : null}
            {(exp.highlights?.length ?? 0) > 0 ? exp.highlights.map((h, i) => (
              <View key={i} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{getText(h, language)}</Text>
              </View>
            )) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if ((data.projects?.length ?? 0) === 0) return null;
    return (
      <View>
        <Text style={s.sectionHead}>{label("projects", language)}</Text>
        {data.projects.map((proj) => (
          <View key={proj.id} style={{ marginBottom: 6 }}>
            <View style={s.row}>
              <Text style={s.bold}>{getText(proj.name, language)}</Text>
              {proj.period ? <Text style={s.muted}>{proj.period}</Text> : null}
            </View>
            {(proj.tech?.length ?? 0) > 0 ? (
              <View style={s.tagRow}>
                {proj.tech.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}
              </View>
            ) : null}
            {getText(proj.description, language) ? <Text style={s.body11}>{getText(proj.description, language)}</Text> : null}
          </View>
        ))}
      </View>
    );
  };

  const renderCampusActivities = () => {
    if ((data.campusActivities?.length ?? 0) === 0) return null;
    return (
      <View>
        <Text style={s.sectionHead}>{label("campusActivities", language)}</Text>
        {data.campusActivities.map((act) => (
          <View key={act.id} style={{ marginBottom: 5 }}>
            <View style={s.row}>
              <Text><Text style={s.bold}>{getText(act.organization, language)}</Text><Text style={{ fontSize: 12, fontWeight: 400 }}> · {getText(act.role, language)}</Text></Text>
              {act.period ? <Text style={s.muted}>{act.period}</Text> : null}
            </View>
            {getText(act.description, language) ? <Text style={s.body11}>{getText(act.description, language)}</Text> : null}
            {(act.highlights?.length ?? 0) > 0 ? act.highlights.map((h, i) => (
              <View key={i} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{getText(h, language)}</Text>
              </View>
            )) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if ((data.skills?.length ?? 0) === 0) return null;
    return (
      <View>
        <Text style={s.sectionHead}>{label("skills", language)}</Text>
        {data.skills.map((cat) => (
          <View key={cat.id} style={{ marginBottom: 3 }}>
            <Text><Text style={s.skillCat}>{getText(cat.category, language)}：</Text><Text style={s.secondary}>{(cat.items ?? []).join(" | ")}</Text></Text>
          </View>
        ))}
      </View>
    );
  };

  const renderers: Record<SectionKey, () => React.ReactNode> = {
    personalInfo: renderPersonalInfo, education: renderEducation, honors: renderHonors,
    experience: renderExperience, projects: renderProjects, campusActivities: renderCampusActivities, skills: renderSkills,
  };

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {sections.map((key) => <View key={key}>{renderers[key]?.()}</View>)}
      </Page>
    </Document>
  );
}

function createModernPDF(data: ResumeData, sections: SectionKey[], emphasis: Partial<Record<SectionKey, SectionEmphasis>>, language: "zh" | "en") {
  const s = StyleSheet.create({
    page: { fontFamily: "Noto", fontSize: 10.5, color: "#2c3e50", lineHeight: 1.5 },
    row: { flexDirection: "row" },
    sidebar: { width: "30%", backgroundColor: "#2c3e50", padding: "24px 16px" },
    sidebarText: { color: "#ecf0f1" },
    sidebarMuted: { color: "#bdc3c7" },
    main: { width: "70%", padding: "24px 24px 20px" },
    sidebarName: { fontSize: 20, fontWeight: 700, color: "#ecf0f1", textAlign: "center", lineHeight: 1.3 },
    sidebarTitle: { fontSize: 11, color: "#bdc3c7", textAlign: "center", marginTop: 3 },
    sidebarDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginTop: 10, marginBottom: 10 },
    sidebarContact: { fontSize: 10, color: "#bdc3c7", lineHeight: 1.8 },
    sidebarHeading: { fontSize: 13, fontWeight: 700, color: "#ecf0f1", paddingBottom: 4, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: "#3498db" },
    sidebarCat: { fontSize: 10, fontWeight: 700, color: "#bdc3c7", marginBottom: 3 },
    sidebarItems: { fontSize: 10, color: "#ecf0f1", lineHeight: 1.6, marginBottom: 8 },
    mainHeading: { fontSize: 13, fontWeight: 700, color: "#2c3e50", marginBottom: 6, paddingBottom: 3, borderBottomWidth: 2, borderBottomColor: "#3498db" },
    mainBold: { fontWeight: 700, fontSize: 11, color: "#2c3e50" },
    mainSecondary: { fontSize: 11, color: "#555" },
    mainMuted: { fontSize: 10, color: "#7f8c8d" },
    mainBody: { fontSize: 10.5, color: "#555", lineHeight: 1.6 },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 3 },
    tag: { fontSize: 9, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3, backgroundColor: "#eaf2f8", color: "#2980b9" },
    itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    bullet: { flexDirection: "row", marginLeft: 14, marginBottom: 0 },
    bulletDot: { width: 10, fontSize: 10.5, color: "#555" },
    bulletText: { flex: 1, fontSize: 10.5, color: "#555", lineHeight: 1.6 },
    itemDivider: { height: 0.5, backgroundColor: "#e0e4e8", marginTop: 8, marginBottom: 8 },
    honorBadge: { fontSize: 9, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3, fontWeight: 700 },
  });

  const info = data.personalInfo;
  const name = getText(info.name, language);
  const HONOR_COLORS: Record<string, { bg: string; color: string }> = {
    national: { bg: "#c0392b", color: "#ffffff" },
    "国家级": { bg: "#c0392b", color: "#ffffff" },
    provincial: { bg: "#e67e22", color: "#ffffff" },
    "省级": { bg: "#e67e22", color: "#ffffff" },
    university: { bg: "#2980b9", color: "#ffffff" },
    "校级": { bg: "#2980b9", color: "#ffffff" },
  };

  const renderSidebar = () => (
    <View style={s.sidebar}>
      {info.avatarUrl ? (
        <Image src={info.avatarUrl} style={{ width: 72, height: 72, borderRadius: 36, marginBottom: 10, alignSelf: "center" }} />
      ) : name ? (
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(255,255,255,0.15)", marginBottom: 10, alignSelf: "center", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 28, color: "#bdc3c7", fontWeight: 300 }}>{name.charAt(0)}</Text>
        </View>
      ) : null}
      {name ? <Text style={s.sidebarName}>{name}</Text> : null}
      {getText(info.title, language) ? <Text style={s.sidebarTitle}>{getText(info.title, language)}</Text> : null}
      <View style={s.sidebarDivider} />
      <View style={s.sidebarContact}>
        {[info.gender, info.birthDate, info.politicalStatus].filter(Boolean).join(" · ") ? <Text>{[info.gender, info.birthDate, info.politicalStatus].filter(Boolean).join(" · ")}</Text> : null}
        {info.phone ? <Text>📱 {info.phone}</Text> : null}
        {info.email ? <Text>✉ {info.email}</Text> : null}
        {getText(info.location, language) ? <Text>📍 {getText(info.location, language)}</Text> : null}
        {info.website ? <Text>🔗 {info.website}</Text> : null}
      </View>

      {(data.skills?.length ?? 0) > 0 ? (
        <View style={{ marginTop: 16 }}>
          <Text style={s.sidebarHeading}>{label("skills", language)}</Text>
          {data.skills.map((cat) => (
            <View key={cat.id} style={{ marginBottom: 8 }}>
              <Text style={s.sidebarCat}>{getText(cat.category, language)}</Text>
              <Text style={s.sidebarItems}>{(cat.items ?? []).join(" · ")}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );

  const mainSectionKeys = ["education", "honors", "experience", "projects", "campusActivities"] as SectionKey[];
  const visibleMainSections = sections.filter(k => mainSectionKeys.includes(k));

  const renderMain = () => (
    <View style={s.main}>
      {visibleMainSections.map((key) => {
        switch (key) {
          case "education":
            return (data.education?.length ?? 0) === 0 ? null : (
              <View key="education" style={{ marginBottom: 12 }}>
                <Text style={s.mainHeading}>{label("education", language)}</Text>
                {data.education.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 8 }}>
                    <View style={s.itemRow}>
                      <Text><Text style={s.mainBold}>{[getText(edu.school, language), getText(edu.degree, language), getText(edu.major, language)].filter(Boolean).join(" · ")}</Text>{edu.gpa ? <Text style={{ fontSize: 10, fontWeight: 700, color: "#3498db", marginLeft: 8 }}> GPA: {edu.gpa}</Text> : null}</Text>
                      {edu.period ? <Text style={s.mainMuted}>{edu.period}</Text> : null}
                    </View>
                    {(edu.courses?.length ?? 0) > 0 ? (
                      <View style={s.tagRow}>
                        {edu.courses.map((c, i) => <Text key={i} style={s.tag}>{c}</Text>)}
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          case "honors":
            return (data.honors?.length ?? 0) === 0 ? null : (
              <View key="honors" style={{ marginBottom: 12 }}>
                <Text style={s.mainHeading}>{label("honors", language)}</Text>
                {data.honors.map((h) => {
                  const lc = HONOR_COLORS[h.level] || { bg: "#7f8c8d", color: "#ffffff" };
                  return (
                    <View key={h.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={{ fontWeight: 700, fontSize: 11, color: "#2c3e50" }}>{getText(h.title, language)}</Text>
                        {h.level ? <Text style={[s.honorBadge, { backgroundColor: lc.bg, color: lc.color }]}>{h.level}</Text> : null}
                      </View>
                      {h.period ? <Text style={s.mainMuted}>{h.period}</Text> : null}
                    </View>
                  );
                })}
              </View>
            );
          case "experience":
            return (data.experience?.length ?? 0) === 0 ? null : (
              <View key="experience" style={{ marginBottom: 12 }}>
                <Text style={s.mainHeading}>{label("experience", language)}</Text>
                {data.experience.map((exp, idx) => (
                  <View key={exp.id}>
                    <View style={s.itemRow}>
                      <Text><Text style={s.mainBold}>{getText(exp.company, language)}</Text><Text style={s.mainSecondary}> · {getText(exp.role, language)}</Text></Text>
                      {exp.period ? <Text style={s.mainMuted}>{exp.period}</Text> : null}
                    </View>
                    {(exp.highlights?.length ?? 0) > 0 ? exp.highlights.map((h, i) => (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{getText(h, language)}</Text>
                      </View>
                    )) : null}
                    {idx < data.experience.length - 1 ? <View style={s.itemDivider} /> : null}
                  </View>
                ))}
              </View>
            );
          case "projects":
            return (data.projects?.length ?? 0) === 0 ? null : (
              <View key="projects" style={{ marginBottom: 12 }}>
                <Text style={s.mainHeading}>{label("projects", language)}</Text>
                {data.projects.map((proj, idx) => (
                  <View key={proj.id}>
                    <View style={s.itemRow}>
                      <Text><Text style={s.mainBold}>{getText(proj.name, language)}</Text>{getText(proj.role, language) ? <Text style={s.mainSecondary}> · {getText(proj.role, language)}</Text> : null}</Text>
                      {proj.period ? <Text style={s.mainMuted}>{proj.period}</Text> : null}
                    </View>
                    {(proj.tech?.length ?? 0) > 0 ? (
                      <View style={s.tagRow}>
                        {proj.tech.map((t, i) => <Text key={i} style={s.tag}>{t}</Text>)}
                      </View>
                    ) : null}
                    {getText(proj.description, language) ? <Text style={s.mainBody}>{getText(proj.description, language)}</Text> : null}
                    {idx < data.projects.length - 1 ? <View style={s.itemDivider} /> : null}
                  </View>
                ))}
              </View>
            );
          case "campusActivities":
            return (data.campusActivities?.length ?? 0) === 0 ? null : (
              <View key="campusActivities" style={{ marginBottom: 12 }}>
                <Text style={s.mainHeading}>{label("campusActivities", language)}</Text>
                {data.campusActivities.map((act, idx) => (
                  <View key={act.id}>
                    <View style={s.itemRow}>
                      <Text><Text style={s.mainBold}>{getText(act.organization, language)}</Text><Text style={s.mainSecondary}> · {getText(act.role, language)}</Text></Text>
                      {act.period ? <Text style={s.mainMuted}>{act.period}</Text> : null}
                    </View>
                    {(act.highlights?.length ?? 0) > 0 ? act.highlights.map((h, i) => (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{getText(h, language)}</Text>
                      </View>
                    )) : null}
                    {idx < data.campusActivities.length - 1 ? <View style={s.itemDivider} /> : null}
                  </View>
                ))}
              </View>
            );
          default:
            return null;
        }
      })}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.row}>
          {renderSidebar()}
          {renderMain()}
        </View>
      </Page>
    </Document>
  );
}

function createMinimalPDF(data: ResumeData, sections: SectionKey[], emphasis: Partial<Record<SectionKey, SectionEmphasis>>, language: "zh" | "en") {
  const s = StyleSheet.create({
    page: { padding: "24px 32px", fontFamily: "Noto", fontSize: 10, color: "#1a1a1a", lineHeight: 1.5 },
    nameRow: { flexDirection: "row", alignItems: "baseline", gap: 8, marginBottom: 0 },
    name: { fontSize: 20, fontWeight: 700 },
    titleInline: { fontSize: 12, fontWeight: 400, color: "#666" },
    contacts: { fontSize: 10, color: "#666", marginTop: 3, lineHeight: 1.5 },
    summary: { fontSize: 10, color: "#999", marginTop: 4, lineHeight: 1.6 },
    sectionLine: { height: 0.5, backgroundColor: "#ddd", marginTop: 16, marginBottom: 4 },
    sectionHead: { fontSize: 13, fontWeight: 700, color: "#1a1a1a", letterSpacing: 0.3, marginBottom: 6 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    bold600: { fontWeight: 700, fontSize: 11, color: "#1a1a1a" },
    secondary: { fontSize: 11, color: "#666", fontWeight: 400 },
    muted: { fontSize: 10, color: "#999" },
    body10: { fontSize: 10, color: "#999", lineHeight: 1.6 },
    bullet: { flexDirection: "row", marginLeft: 14, marginBottom: 0 },
    bulletDot: { width: 10, fontSize: 10, color: "#999" },
    bulletText: { flex: 1, fontSize: 10, color: "#999", lineHeight: 1.6 },
    techRow: { fontSize: 10, color: "#999", marginTop: 1 },
    skillRow: { marginBottom: 4 },
    skillCat: { fontWeight: 700, fontSize: 11, color: "#1a1a1a" },
    skillItems: { fontWeight: 400, fontSize: 11, color: "#666" },
  });

  const info = data.personalInfo;
  const name = getText(info.name, language);

  const renderPersonalInfo = () => {
    if (!name && !info.email) return null;
    const contactParts: string[] = [];
    const identityParts = [info.gender, info.birthDate, info.politicalStatus].filter(Boolean);
    if (identityParts.length > 0) contactParts.push(identityParts.join(" · "));
    if (info.phone) contactParts.push(info.phone);
    if (info.email) contactParts.push(info.email);
    if (getText(info.location, language)) contactParts.push(getText(info.location, language));
    if (info.website) contactParts.push(info.website);
    return (
      <View style={{ marginBottom: 6 }}>
        <View style={s.nameRow}>
          {name ? <Text style={s.name}>{name}</Text> : null}
          {getText(info.title, language) ? <Text style={s.titleInline}>{getText(info.title, language)}</Text> : null}
        </View>
        {contactParts.length > 0 ? <Text style={s.contacts}>{contactParts.join(" | ")}</Text> : null}
        {getText(info.summary, language) ? <Text style={s.summary}>{getText(info.summary, language)}</Text> : null}
      </View>
    );
  };

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: renderPersonalInfo,
    education: () => (data.education?.length ?? 0) === 0 ? null : (
      <View>
        <View style={s.sectionLine} />
        <Text style={s.sectionHead}>{label("education", language)}</Text>
        {data.education.map((edu) => {
          const parts = [getText(edu.degree, language), getText(edu.major, language)].filter(Boolean);
          return (
            <View key={edu.id} style={{ marginTop: 6 }}>
              <View style={s.row}>
                <Text><Text style={s.bold600}>{getText(edu.school, language)}</Text>{parts.length > 0 ? <Text style={s.secondary}> · {parts.join(" · ")}</Text> : null}</Text>
                {edu.period ? <Text style={s.muted}>{edu.period}</Text> : null}
              </View>
              {(edu.gpa || (edu.courses?.length ?? 0) > 0) ? <Text style={s.muted}>{edu.gpa ? `GPA: ${edu.gpa}` : ""}{edu.gpa && (edu.courses?.length ?? 0) > 0 ? "; " : ""}{(edu.courses?.length ?? 0) > 0 ? `${language === "zh" ? "课程" : "Courses"}: ${edu.courses.join(", ")}` : ""}</Text> : null}
            </View>
          );
        })}
      </View>
    ),
    honors: () => (data.honors?.length ?? 0) === 0 ? null : (
      <View>
        <View style={s.sectionLine} />
        <Text style={s.sectionHead}>{label("honors", language)}</Text>
        {data.honors.map((h) => (
          <View key={h.id} style={{ marginTop: 4 }}>
            <View style={s.row}>
              <Text><Text style={{ fontSize: 11, color: "#1a1a1a" }}>{getText(h.title, language)}{h.level ? <Text style={{ fontSize: 10, color: "#999" }}> [{h.level}]</Text> : null}</Text></Text>
              {h.period ? <Text style={s.muted}>{h.period}</Text> : null}
            </View>
          </View>
        ))}
      </View>
    ),
    experience: () => (data.experience?.length ?? 0) === 0 ? null : (
      <View>
        <View style={s.sectionLine} />
        <Text style={s.sectionHead}>{label("experience", language)}</Text>
        {data.experience.map((exp) => (
          <View key={exp.id} style={{ marginTop: 6 }}>
            <View style={s.row}>
              <Text><Text style={s.bold600}>{getText(exp.company, language)}</Text>{getText(exp.role, language) ? <Text style={s.secondary}> · {getText(exp.role, language)}</Text> : null}</Text>
              {exp.period ? <Text style={s.muted}>{exp.period}</Text> : null}
            </View>
            {getText(exp.description, language) ? <Text style={s.body10}>{getText(exp.description, language)}</Text> : null}
            {(exp.highlights?.length ?? 0) > 0 ? exp.highlights.map((h, i) => (
              <View key={i} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{getText(h, language)}</Text>
              </View>
            )) : null}
          </View>
        ))}
      </View>
    ),
    projects: () => (data.projects?.length ?? 0) === 0 ? null : (
      <View>
        <View style={s.sectionLine} />
        <Text style={s.sectionHead}>{label("projects", language)}</Text>
        {data.projects.map((proj) => (
          <View key={proj.id} style={{ marginTop: 6 }}>
            <View style={s.row}>
              <Text><Text style={s.bold600}>{getText(proj.name, language)}</Text>{getText(proj.role, language) ? <Text style={s.secondary}> · {getText(proj.role, language)}</Text> : null}</Text>
              {proj.period ? <Text style={s.muted}>{proj.period}</Text> : null}
            </View>
            {(proj.tech?.length ?? 0) > 0 ? <Text style={s.techRow}>Tech: {proj.tech.join(", ")}</Text> : null}
            {getText(proj.description, language) ? <Text style={s.body10}>{getText(proj.description, language)}</Text> : null}
          </View>
        ))}
      </View>
    ),
    campusActivities: () => (data.campusActivities?.length ?? 0) === 0 ? null : (
      <View>
        <View style={s.sectionLine} />
        <Text style={s.sectionHead}>{label("campusActivities", language)}</Text>
        {data.campusActivities.map((act) => (
          <View key={act.id} style={{ marginTop: 6 }}>
            <View style={s.row}>
              <Text><Text style={s.bold600}>{getText(act.organization, language)}</Text>{getText(act.role, language) ? <Text style={s.secondary}> · {getText(act.role, language)}</Text> : null}</Text>
              {act.period ? <Text style={s.muted}>{act.period}</Text> : null}
            </View>
            {getText(act.description, language) ? <Text style={s.body10}>{getText(act.description, language)}</Text> : null}
            {(act.highlights?.length ?? 0) > 0 ? act.highlights.map((h, i) => (
              <View key={i} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{getText(h, language)}</Text>
              </View>
            )) : null}
          </View>
        ))}
      </View>
    ),
    skills: () => (data.skills?.length ?? 0) === 0 ? null : (
      <View>
        <View style={s.sectionLine} />
        <Text style={s.sectionHead}>{label("skills", language)}</Text>
        {data.skills.map((cat) => (
          <View key={cat.id} style={s.skillRow}>
            <Text><Text style={s.skillCat}>{getText(cat.category, language)}: </Text><Text style={s.skillItems}>{(cat.items ?? []).join(" | ")}</Text></Text>
          </View>
        ))}
      </View>
    ),
  };

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {sections.map((key) => <View key={key}>{sectionRenderers[key]?.()}</View>)}
      </Page>
    </Document>
  );
}

function createCompactPDF(data: ResumeData, sections: SectionKey[], emphasis: Partial<Record<SectionKey, SectionEmphasis>>, language: "zh" | "en") {
  const s = StyleSheet.create({
    page: { padding: "20px 30px", fontFamily: "Noto", fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.45 },
    nameLine: { fontSize: 18, fontWeight: 700, marginBottom: 2, lineHeight: 1.3 },
    contacts: { fontSize: 10, color: "#4a4a4a", lineHeight: 1.4, marginTop: 2 },
    summary: { fontSize: 10, color: "#4a4a4a", lineHeight: 1.45, fontStyle: "italic", marginTop: 2 },
    sectionHead: { fontSize: 11, fontWeight: 700, color: "#1a1a1a", borderLeftWidth: 2, borderLeftColor: "#2563eb", paddingLeft: 6, marginTop: 6, marginBottom: 4, lineHeight: 1.3 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    bold600: { fontWeight: 700, fontSize: 10.5 },
    secondary: { fontSize: 10.5, color: "#4a4a4a" },
    muted: { fontSize: 10, color: "#888" },
    bullet: { flexDirection: "row", marginLeft: 14 },
    bulletDot: { width: 10, fontSize: 10.5, color: "#4a4a4a" },
    bulletText: { flex: 1, fontSize: 10.5, color: "#4a4a4a", lineHeight: 1.45 },
  });

  const info = data.personalInfo;
  const name = getText(info.name, language);

  const renderPersonalInfo = () => {
    if (!name && !info.email) return null;
    const title = getText(info.title, language);
    const headerLine = title ? `${name} | ${title}` : name;
    const contactParts: string[] = [];
    if (info.gender) contactParts.push(info.gender);
    if (info.birthDate) contactParts.push(info.birthDate);
    if (info.politicalStatus) contactParts.push(info.politicalStatus);
    if (info.phone) contactParts.push(info.phone);
    if (info.email) contactParts.push(info.email);
    if (getText(info.location, language)) contactParts.push(getText(info.location, language));
    if (info.website) contactParts.push(info.website);
    return (
      <View style={{ marginBottom: 8 }}>
        {headerLine ? <Text style={s.nameLine}>{headerLine}</Text> : null}
        {contactParts.length > 0 ? <Text style={s.contacts}>{contactParts.join(" | ")}</Text> : null}
        {getText(info.summary, language) ? <Text style={s.summary}>{getText(info.summary, language)}</Text> : null}
      </View>
    );
  };

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: renderPersonalInfo,
    education: () => (data.education?.length ?? 0) === 0 ? null : (
      <View>
        <Text style={s.sectionHead}>{label("education", language)}</Text>
        {data.education.map((edu) => {
          const parts = [getText(edu.school, language), getText(edu.degree, language), getText(edu.major, language)].filter(Boolean);
          return (
            <View key={edu.id} style={{ marginBottom: 4 }}>
              <View style={s.row}>
                <Text style={s.bold600}>{parts.join(" · ")}</Text>
                {edu.period ? <Text style={s.muted}>{edu.period}</Text> : null}
              </View>
              {(edu.gpa || (edu.courses?.length ?? 0) > 0) ? <Text style={s.secondary}>{edu.gpa ? `GPA: ${edu.gpa}` : ""}{edu.gpa && (edu.courses?.length ?? 0) > 0 ? " " : ""}{(edu.courses?.length ?? 0) > 0 ? `${language === "zh" ? "核心课程" : "Core"}: ${edu.courses.join(", ")}` : ""}</Text> : null}
            </View>
          );
        })}
      </View>
    ),
    honors: () => (data.honors?.length ?? 0) === 0 ? null : (
      <View>
        <Text style={s.sectionHead}>{label("honors", language)}</Text>
        {data.honors.map((h) => (
          <View key={h.id} style={{ marginBottom: 2 }}>
            <View style={s.row}>
              <Text style={s.bold600}>{getText(h.title, language)}{h.level ? ` [${h.level}]` : ""}</Text>
              {h.period ? <Text style={s.muted}>{h.period}</Text> : null}
            </View>
          </View>
        ))}
      </View>
    ),
    experience: () => (data.experience?.length ?? 0) === 0 ? null : (
      <View>
        <Text style={s.sectionHead}>{label("experience", language)}</Text>
        {data.experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 4 }}>
            <View style={s.row}>
              <Text style={s.bold600}>{getText(exp.company, language)} · {getText(exp.role, language)}</Text>
              {exp.period ? <Text style={s.muted}>{exp.period}</Text> : null}
            </View>
            {(exp.highlights?.length ?? 0) > 0 ? exp.highlights.slice(0, 3).map((h, i) => (
              <View key={i} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{getText(h, language)}</Text>
              </View>
            )) : null}
          </View>
        ))}
      </View>
    ),
    projects: () => (data.projects?.length ?? 0) === 0 ? null : (
      <View>
        <Text style={s.sectionHead}>{label("projects", language)}</Text>
        {data.projects.map((proj) => (
          <View key={proj.id} style={{ marginBottom: 4 }}>
            <View style={s.row}>
              <Text style={s.bold600}>{getText(proj.name, language)}{getText(proj.role, language) ? ` · ${getText(proj.role, language)}` : ""}</Text>
              {proj.period ? <Text style={s.muted}>{proj.period}</Text> : null}
            </View>
            {(proj.tech?.length ?? 0) > 0 ? <Text style={{ fontSize: 9.5, color: "#888" }}>{language === "zh" ? "技术" : "Tech"}: {proj.tech.join(", ")}</Text> : null}
            {getText(proj.description, language) ? <Text style={s.secondary}>{getText(proj.description, language)}</Text> : null}
          </View>
        ))}
      </View>
    ),
    campusActivities: () => (data.campusActivities?.length ?? 0) === 0 ? null : (
      <View>
        <Text style={s.sectionHead}>{label("campusActivities", language)}</Text>
        {data.campusActivities.map((act) => (
          <View key={act.id} style={{ marginBottom: 4 }}>
            <View style={s.row}>
              <Text style={s.bold600}>{getText(act.organization, language)} · {getText(act.role, language)}</Text>
              {act.period ? <Text style={s.muted}>{act.period}</Text> : null}
            </View>
            {(act.highlights?.length ?? 0) > 0 ? act.highlights.slice(0, 2).map((h, i) => (
              <View key={i} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{getText(h, language)}</Text>
              </View>
            )) : null}
          </View>
        ))}
      </View>
    ),
    skills: () => (data.skills?.length ?? 0) === 0 ? null : (
      <View>
        <Text style={s.sectionHead}>{label("skills", language)}</Text>
        <Text style={{ fontSize: 10.5, lineHeight: 1.5 }}>
          {data.skills.map((cat, i) => (
            <Text key={cat.id}>
              <Text style={{ fontWeight: 700 }}>{getText(cat.category, language)}</Text>
              <Text style={{ color: "#4a4a4a" }}>: {cat.items.join(", ")}</Text>
              {i < data.skills.length - 1 ? <Text style={{ color: "#888" }}> | </Text> : null}
            </Text>
          ))}
        </Text>
      </View>
    ),
  };

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {sections.map((key) => <View key={key}>{sectionRenderers[key]?.()}</View>)}
      </Page>
    </Document>
  );
}