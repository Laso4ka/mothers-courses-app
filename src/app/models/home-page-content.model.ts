export interface HeroSectionData {
  backgroundImageUrl: string;
  title: string;
  subtitle: string;
  coursesButtonText: string;
  telegramButtonText: string;
  telegramLink: string;
}

export interface InfoBlockData {
  title: string;
  text: string;
}

export interface AuthorData {
  id: string; // 'author1', 'author2'
  fullName: string;
  imageUrl: string;
  bio: string;
  specialization?: string;
}

export interface HomePageContent {
  id?: string; // 'main'
  heroSection: HeroSectionData;
  infoBlocks: InfoBlockData[];
  aboutUs: {
    imageUrl?: string;
    title: string;
    text: string;
    authors: AuthorData[];
  };
}
