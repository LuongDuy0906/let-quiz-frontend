import { HeroField } from "@/component/hero-field";
import { QuizField } from "@/component/quiz-field";
import { TagMenu } from "@/component/tag-menu";

export default function HomePage() {
  return (
    <div >
      <TagMenu />
      <HeroField />
      <QuizField />
    </div>
  );
}