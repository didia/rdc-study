export type Article = {
  content: string;
  title: string;
  date: string;
  excerpt: string;
  thumbnail: string;
  thumbnailCredits?: string;
  tags?: string[];
  slug: string;
  path: string;
  timeToRead: number;
  metaImage?: {
    src: string;
    width: number;
    height: number;
  };
};

export type Guide = {
  content: string;
  title: string;
  excerpt: string;
  slug: string;
  topic: string;
  related?: string[];
  name?: string;
  flag?: string;
  thumbnail: string;
  date?: string;
  updated?: string;
  path: string;
  draft: boolean;
  metaImage?: {
    src: string;
    width: number;
    height: number;
  };
};

export type Scholarship = {
  content: string;
  title: string;
  deadline: string;
  excerpt: string;
  thumbnail: string;
  thumbnailCredits?: string;
  startDate?: string;
  levels: string[];
  targetCountries: string[];
  tags?: string[];
  slug: string;
  path: string;
  timestamp: number;
  draft: boolean;
  metaImage?: {
    src: string;
    width: number;
    height: number;
  };
};

export type Service = {
  content: string;
  slug: string;
  title: string;
  price: number;
  excerpt: string;
  rank?: number;
  assistanceFormServiceChoiceLabel: string;
  assistanceFormConfirmationTitle: string;
  assistanceFormConfirmationFirstParagraph: string;
  assistanceFormConfirmationSecondParagraph?: string;
  assistanceRequestLink?: string;
};

export type AssistancePackage = {
  content: string;
  title: string;
  slug: string;
};

export type AssistancePackageDictionary = Record<string, AssistancePackage>;

export type FAQ = {
  question: string;
  answer: string;
};

export type TeamMember = {
  name: string;
  title: string;
  role: string;
  about: string;
  image: string;
};
