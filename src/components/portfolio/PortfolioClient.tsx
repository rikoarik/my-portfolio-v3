"use client";

import { IntroChapter } from "@/components/sections/IntroChapter";
import { JourneyChapter } from "@/components/sections/JourneyChapter";
import { ProjectsChapter } from "@/components/sections/ProjectsChapter";
import { SkillsChapter } from "@/components/sections/SkillsChapter";
import { ContactChapter } from "@/components/sections/ContactChapter";
import { StoryShell } from "@/components/story/StoryShell";
import type { PortfolioPayload } from "@/types/portfolio";

export function PortfolioClient({
  data,
  offlineBanner,
}: {
  data: PortfolioPayload;
  offlineBanner: boolean;
}) {
  const panels = [
    <IntroChapter key="open" profile={data.profile} />,
    <JourneyChapter key="path" experiences={data.experiences} />,
    <ProjectsChapter key="shipped" projects={data.projects} />,
    <SkillsChapter key="stack" groups={data.skill_groups} />,
    <ContactChapter key="next" profile={data.profile} />,
  ];

  return <StoryShell offlineBanner={offlineBanner}>{panels}</StoryShell>;
}
