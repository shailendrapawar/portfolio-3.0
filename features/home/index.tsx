import Spacer from "@/components/Spacer";

import Landing from "./components/Landing";

import SkillSet from "./components/SkillSet";
import Services from "./components/Services";
import AboutMe from "./components/AboutMe";
import FeaturedProjects from "../project/components/FeaturedProjects";
import LatestExperience from "../experience/components/LatestExperience";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <Landing />
      <Spacer size={2.5} />
      <AboutMe />
      <Spacer size={2.5} />
      <SkillSet />
      <Spacer size={2.5} />
      <LatestExperience />
      <Spacer size={2.5} />
      <Services />
      <Spacer size={2.5} />
      <FeaturedProjects />
    </div>
  );
}
