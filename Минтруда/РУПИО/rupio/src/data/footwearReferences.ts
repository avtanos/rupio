import { FootwearModel, FootwearColor, FootwearMaterial, HeelMaterial, FootwearDiagnosis } from '../types/footwearOrder';
import { footwearDiagnoses as diagnoses } from './footwearDiagnoses';

export const footwearModels: FootwearModel[] = [
  'Ортопедические туфли',
  'Ортопедические ботинки',
  'Ортопедические сапоги',
  'Ортопедические кроссовки',
  'Ортопедические сандалии',
  'Ортопедические тапочки',
  'Ортопедические сапожки'
];

export const footwearColors: FootwearColor[] = [
  'Черный',
  'Красный',
  'Комбинированный',
  'Бордовый',
  'Коричневый',
  'Серый',
  'Белый',
  'Синий',
  'Зеленый'
];

export const footwearMaterials: FootwearMaterial[] = [
  'Натуральная кожа',
  'Искусственная кожа',
  'Текстиль',
  'Замша',
  'Нубук',
  'Комбинированный'
];

export const heelMaterials: HeelMaterial[] = [
  'Резина',
  'Пластик',
  'Дерево',
  'Металл',
  'Комбинированный'
];

export const technicalOperationsList = [
  'Колодка или слепок',
  'Крой модели',
  'Крой верха',
  'Наклейка',
  'Строчка',
  'Затяжка пяток',
  'Затяжка носков',
  'Пришивка ранта',
  'Простилка',
  'Пришивка подошв',
  'Установка каблука',
  'Отделка',
  'И другие'
];

export { diagnoses as footwearDiagnoses };
