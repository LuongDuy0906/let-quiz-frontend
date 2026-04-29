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
  rating: number;
  name: string;
  createdAt: string;
}

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}