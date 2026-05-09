export const API_BASE_URL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) || 'http://localhost:3000';

export const HERO_SECTION_DATA = [
    {
        image: "/image/hero_section_image/hero_left_image.png",
        text1: "Tạo bộ đề",
        text2: "Sáng tạo nên bộ đề của riêng mình",
        text3: "Sáng tạo"
    },
    {
        image: "/image/hero_section_image/hero_left_image.png",
        text1: "Tạo bộ đề",
        text2: "Sáng tạo nên bộ đề của riêng mình",
        text3: "Sáng tạo"
    }
]

export const HOME_TAGS = 
[
    "Entertainment",
    "Sport",
    "Art & Literature",
    "Geography",
    "History",
    "Science & Nature",
    "Trivia"
];

export const TAG_DATA = [
  { imageUrl: "/image/tag_image/home.png", title: "Trang chủ" },
  { imageUrl: "/image/tag_image/art.png", title: "Hội họa và Văn học" },
  { imageUrl: "/image/tag_image/sport.png", title: "Thể thao" },
  { imageUrl: "/image/tag_image/geography.png", title: "Địa lý" },
  { imageUrl: "/image/tag_image/history.png", title: "Lịch sử" },
  { imageUrl: "/image/tag_image/science.png", title: "Khoa học tự nhiên" },
  { imageUrl: "/image/tag_image/entertainment.png", title: "Giải trí" },
  { imageUrl: "/image/tag_image/trivia.png", title: "Đa dạng" },
];

export const createDefaultQuestion = (): any => {
    return { 
        content: "required",
        image: "", // Trường này optional nên để rỗng
        questionType: "single-choice", // Thay bằng giá trị mặc định trong Enum của bạn (ví dụ: QuestionType.SINGLE)
        timeLimit: 30, // Giá trị Min theo DTO
        point: 10,    // Giá trị Min theo DTO
        option: [
            { content: "required", isCorrect: true },
            { content: "required", isCorrect: false },
            { content: "required", isCorrect: false },
            { content: "required", isCorrect: false },
        ]
    };
};

export type EditorStep = 'setting' | 'type-selector' | 'single-choice' | 'multiple-choice';
