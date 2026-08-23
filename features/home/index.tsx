import Landing from "./components/Landing";

import SkillSet from "./components/SkillSet";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <Landing />
      <SkillSet />
    </div>
  );
}
