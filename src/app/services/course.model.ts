export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  instructor: string;
  price: number;
  imageUrl: string;
  duration: string; // e.g., "6 Weeks", "Self-paced"
  category: string; // e.g., "Parenting", "Well-being", "Career"
  rating?: number; // Optional
  studentCount?: number; // Optional
}
