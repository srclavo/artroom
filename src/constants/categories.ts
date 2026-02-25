export interface Category {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

export const CATEGORIES: Category[] = [
  { id: 'branding', label: 'Branding', color: '#ffafd9', textColor: '#0a0a0a' },
  { id: 'ui-ux', label: 'UI / UX', color: '#6e87f2', textColor: '#fff' },
  { id: 'typography', label: 'Typography', color: '#e0eb3a', textColor: '#0a0a0a' },
  { id: 'motion', label: 'Motion', color: '#2ec66d', textColor: '#fff' },
  { id: 'illustration', label: 'Illustration', color: '#f07e41', textColor: '#fff' },
  { id: '3d', label: '3D', color: '#d5d1ff', textColor: '#0a0a0a' },
  { id: 'template', label: 'Template', color: '#98c7f3', textColor: '#0a0a0a' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);
