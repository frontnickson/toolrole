// Типы для landing страницы
export interface LandingSection {
  id: string;
  title: string;
  component: React.ComponentType;
}

export interface LandingProps {
  className?: string;
}
