interface TagSection {
  tag: string;
  data: any[];
  total: number;
}

interface HomeSections {
  newest: { data: any[]; total: number; title: string };
  topRated: { data: any[]; total: number; title: string };
  tagSections: TagSection[];
}

interface Props {
  _id: string;
  title: string;
  image: string;
  rating?: number;
  name: string;
  createdAt: string;
  totalQuestions?: number;
  type: string;
}

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

interface UserQuizSectionProps {
  quiz: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching: boolean;
} 

interface ProfileDetailProps {
  user: any;
  totalQuiz: number;
}

interface BaseInputProps{
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isReadonly: boolean;
}

interface ResetPasswordProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface QuizSelectorProps {
  text: string;
  type: string;
  logo: string;
  onClick?: () => void;
}

interface QuestionProps{
  _id: string;
  content: string;
  image: string
  questionType: string;
  options: OptionProps[];
  timeLimit: number;
  information: string;
  showQuestions: boolean;
  showOptions: boolean;
}

interface OptionProps{
  _id: string;
  content: string;
  isCorrect: boolean;
}