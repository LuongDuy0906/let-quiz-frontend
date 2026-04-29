"use client"

import { HeroField } from "@/component/hero-field";
import { QuizField } from "@/component/quiz-field";
import { TagMenu } from "@/component/tag-menu";
import { HOME_TAGS } from "@/constants/constants";
import { quizService } from "@/features/quiz/quiz.service";
import { useEffect, useState } from "react";


export default function HomePage() {
  const [sections, setSections] = useState<HomeSections>({
        newest: { data: [], total: 0, title: 'Mới cập nhật' },
        topRated: { data: [], total: 0, title: 'Phổ biến nhất' },
        tagSections: []
    });

    const loadHomeData = async () => {
        const [newData, ratedData] = await Promise.all([
            quizService.getQuizzes({ sort: 'createdAt'}),
            quizService.getQuizzes({ sort: 'rating'})
        ]);

        newData.title = "Mới cập nhật";
        ratedData.title = "Phổ biến nhất";

        const tagRequests = HOME_TAGS.map(tag => quizService.getQuizzes({ tag }));
        const tagsResults = await Promise.all(tagRequests);

        setSections({
            newest: newData || { data: [], total: 0, title: 'Mới cập nhật' },
            topRated: ratedData || { data: [], total: 0, title: 'Phổ biến nhất' },
            tagSections: tagsResults.map((result, index) => ({
                tag: HOME_TAGS[index],
                data: result?.data || [],
                total: result?.total || 0
            }))
        });
    };

  useEffect(() => {
    loadHomeData();
  }, []);
  
  return (
    <div >
      <TagMenu />
      <HeroField />
      <QuizField sections={sections}/>
    </div>
  );
}