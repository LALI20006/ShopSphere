export interface Brand {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  logo?: string;
  description?: string;
  originCountry?: string;
  website?: string;
}
