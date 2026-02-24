export interface Category {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

export const CATEGORIES: Category[] = [
  { id: 'branding', label: 'Branding', color: '#FFB3C6', textColor: '#0a0a0a' },
  { id: 'ui-ux', label: 'UI / UX', color: '#1B4FE8', textColor: '#fff' },
  { id: 'typography', label: 'Typography', color: '#FFE500', textColor: '#0a0a0a' },
  { id: 'motion', label: 'Motion', color: '#1A7A3C', textColor: '#fff' },
  { id: 'illustration', label: 'Illustration', color: '#FF5F1F', textColor: '#fff' },
  { id: '3d', label: '3D', color: '#7B3FA0', textColor: '#fff' },
  { id: 'template', label: 'Template', color: '#0D1B4B', textColor: '#fff' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);
