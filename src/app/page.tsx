import { HeroField } from "@/component/hero-field";
import { QuizField } from "@/component/quiz-field";
import { TagMenu } from "@/component/tag-menu";
import { HOME_TAGS } from "@/constants/constants";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";


export default function HomePage() {
  const [sections, setSections] = useState<HomeSections>({
        newest: { data: [], total: 0, title: 'Mới cập nhật' },
        topRated: { data: [], total: 0, title: 'Phổ biến nhất' },
        tagSections: []
    });

    const getQuizzesBySection = async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            
            const response = await apiFetch(`/quiz?${queryString}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                skipAuth: true,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Fetch failed for ${queryString}:`, errorData);
                return null;
            }

            const result = await response.json();
            return result;
        }
        catch(e) {
            console.error('Lỗi khi gọi API:', e);
            return null;
        }
    }

    const loadHomeData = async () => {
        const [newData, ratedData] = await Promise.all([
            getQuizzesBySection({ sort: 'createdAt', limit: 6 }),
            getQuizzesBySection({ sort: 'rating', limit: 6 })
        ]);

        const tagRequests = HOME_TAGS.map(tag => getQuizzesBySection({ tag, limit: 6 }));
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