import Landing from "./components/Landing";

import SkillSet from "./components/SkillSet";
import Services from "./components/Services";
import AboutMe from "./components/AboutMe";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <Landing />
      <AboutMe />
      <SkillSet />
      <Services />
    </div>
  );
}
