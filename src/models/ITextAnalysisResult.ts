export interface ITextAnalysisResult {
  score: number;
  magnitude: number;
  categories: ICategoryConfidence[];
}

export interface ICategoryConfidence {
  name: string;
  confidence: number;
}
