import Fuse from 'fuse.js';

export interface SearchOptions {
  query: string;
  includePartial?: boolean;
  includeCategory?: boolean;
  includeColors?: boolean;
  fuzzyThreshold?: number;
}

export interface ProductSearchResult {
  product: any;
  score: number;
  matchDetails: {
    nameMatches: string[];
    descriptionMatches: string[];
    categoryMatches: string[];
    colorMatches: string[];
    tagMatches: string[];
  };
}

export function createAdvancedSearch(products: any[]) {
  // Configure Fuse.js for fuzzy search
  const fuseOptions = {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'description', weight: 0.2 },
      { name: 'tags', weight: 0.3 },
      { name: 'category', weight: 0.1 },
      { name: 'colors', weight: 0.1 }
    ],
    threshold: 0.4, // Lower = more strict matching
    ignoreLocation: true,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    findAllMatches: true
  };

  const fuse = new Fuse(products, fuseOptions);

  return {
    search: (query: string, options: SearchOptions = { query }): ProductSearchResult[] => {
      if (!query.trim()) return [];

      const {
        includePartial = true,
        includeCategory = true,
        includeColors = true,
        fuzzyThreshold = 0.4
      } = options;

      // Update threshold based on options
      fuseOptions.threshold = fuzzyThreshold;
      const fuseInstance = new Fuse(products, fuseOptions);

      // Get fuzzy search results
      const fuzzyResults = fuseInstance.search(query);
      
      // Get exact/partial matches for additional scoring
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(' ').filter(word => word.length > 0);

      const results: ProductSearchResult[] = products.map(product => {
        let score = 0;
        const matchDetails = {
          nameMatches: [] as string[],
          descriptionMatches: [] as string[],
          categoryMatches: [] as string[],
          colorMatches: [] as string[],
          tagMatches: [] as string[]
        };

        // Exact name matches (highest score)
        const nameLower = product.name.toLowerCase();
        if (nameLower === queryLower) {
          score += 100;
          matchDetails.nameMatches.push('exact');
        } else if (nameLower.includes(queryLower)) {
          score += 80;
          matchDetails.nameMatches.push('partial');
        }

        // Word-based name matches
        queryWords.forEach(word => {
          if (word.length >= 2) {
            if (nameLower.includes(word)) {
              score += 40;
              matchDetails.nameMatches.push('word');
            }
          }
        });

        // Description matches
        const descriptionLower = product.description.toLowerCase();
        if (descriptionLower.includes(queryLower)) {
          score += 30;
          matchDetails.descriptionMatches.push('partial');
        }
        queryWords.forEach(word => {
          if (word.length >= 3 && descriptionLower.includes(word)) {
            score += 15;
            matchDetails.descriptionMatches.push('word');
          }
        });

        // Category matches
        if (includeCategory) {
          const categoryLower = product.category.toLowerCase();
          if (categoryLower === queryLower) {
            score += 60;
            matchDetails.categoryMatches.push('exact');
          } else if (categoryLower.includes(queryLower)) {
            score += 40;
            matchDetails.categoryMatches.push('partial');
          }
          queryWords.forEach(word => {
            if (word.length >= 2 && categoryLower.includes(word)) {
              score += 20;
              matchDetails.categoryMatches.push('word');
            }
          });
        }

        // Color matches
        if (includeColors && product.colors) {
          product.colors.forEach((color: string) => {
            const colorLower = color.toLowerCase();
            if (colorLower === queryLower) {
              score += 50;
              matchDetails.colorMatches.push('exact');
            } else if (colorLower.includes(queryLower)) {
              score += 30;
              matchDetails.colorMatches.push('partial');
            }
            queryWords.forEach(word => {
              if (word.length >= 2 && colorLower.includes(word)) {
                score += 15;
                matchDetails.colorMatches.push('word');
              }
            });
          });
        }

        // Tag matches
        if (product.tags) {
          product.tags.forEach((tag: string) => {
            const tagLower = tag.toLowerCase();
            if (tagLower === queryLower) {
              score += 45;
              matchDetails.tagMatches.push('exact');
            } else if (tagLower.includes(queryLower)) {
              score += 25;
              matchDetails.tagMatches.push('partial');
            }
            queryWords.forEach(word => {
              if (word.length >= 2 && tagLower.includes(word)) {
                score += 12;
                matchDetails.tagMatches.push('word');
              }
            });
          });
        }

        // Add fuzzy search bonus
        const fuzzyResult = fuzzyResults.find(result => result.item._id.toString() === product._id.toString());
        if (fuzzyResult && fuzzyResult.score !== undefined) {
          score += (1 - fuzzyResult.score) * 20; // Convert fuzzy score to bonus points
        }

        // Keyword count bonus (more keywords matched = higher score)
        const keywordMatches = queryWords.filter(word => 
          word.length >= 2 && (
            nameLower.includes(word) ||
            descriptionLower.includes(word) ||
            (includeCategory && product.category.toLowerCase().includes(word)) ||
            (includeColors && product.colors.some((c: string) => c.toLowerCase().includes(word))) ||
            (product.tags && product.tags.some((t: string) => t.toLowerCase().includes(word)))
          )
        ).length;
        
        score += keywordMatches * 10;

        return {
          product,
          score: Math.max(0, score), // Ensure non-negative score
          matchDetails
        };
      });

      // Filter out results with no matches and sort by score
      return results
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);
    }
  };
}

// Helper function to create search suggestions
export function getSearchSuggestions(products: any[], query: string, limit: number = 5): string[] {
  if (!query || query.length < 2) return [];

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  // Extract words from product names, categories, and tags
  products.forEach(product => {
    // Name words
    product.name.toLowerCase().split(' ').forEach((word: string) => {
      if (word.includes(queryLower) && word.length > query.length) {
        suggestions.add(word);
      }
    });

    // Category
    if (product.category.toLowerCase().includes(queryLower)) {
      suggestions.add(product.category);
    }

    // Tags
    product.tags.forEach((tag: string) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    });

    // Colors
    product.colors.forEach((color: string) => {
      if (color.toLowerCase().includes(queryLower)) {
        suggestions.add(color);
      }
    });
  });

  return Array.from(suggestions).slice(0, limit);
}
