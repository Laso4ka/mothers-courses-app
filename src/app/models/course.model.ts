export interface CourseDetailBlock { // Для блоків "фото зліва, текст справа"
  imageUrl: string;
  text: string;
  title?: string; // Опціональний заголовок для блоку
}

export interface Course {
  id?: string;
  title: string;         // Залишається (для заголовка на фоні)
  tagline: string;       // Можна використовувати як підзаголовок
  description: string;   // Основний опис курсу (пункт 3)
  price: number;         // Залишається (для ціни)
  imageUrl: string;      // Головне зображення курсу (для фону в пункті 1)
  isFeatured?: boolean;
  slug?: string;
  longDescription?: string; // Довший опис, якщо потрібно (альтернатива або доповнення до description)
  whatsIncluded?: string[]; // Список того, що входить в курс (для одного з текстових блоків 7-9)
  targetAudience?: string; // Цільова аудиторія (для одного з текстових блоків 7-9)
  learningOutcomes?: string[]; // Результати навчання (для одного з текстових блоків 7-9)

  additionalImage?: { // Для пункту 5 (ще 1 фото і текст опис його)
    imageUrl: string;
    caption: string;
    descriptionText: string;
    descriptionTag: string;
  };

  detailBlocks?: CourseDetailBlock[]; // Для пункту 6 (масив фото та тексту)
}
