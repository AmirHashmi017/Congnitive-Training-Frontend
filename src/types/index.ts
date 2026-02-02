export type ShapeType =
    | 'triangle'
    | 'square'
    | 'rectangle'
    | 'circle'
    | 'ellipse'
    | 'hexagon'
    | 'pentagon'
    | 'octagon'
    | 'star'
    | 'blob';

export interface ShapeAttributes {
    type: ShapeType;
    color: string; // Hex, RGB, or HSL
    rotation: number; // 0-360
    size: number; // Scale factor 0.1 to 2.0
    strokeWidth?: number;
    pattern?: string;
    opacity?: number;
}

export interface GameRule {
    id: string;
    description: string;
    matchType: 'color' | 'shape' | 'size' | 'pattern' | 'word' | 'not_color' | 'not_shape';
}

export interface PuzzleRound {
    target: ShapeAttributes;
    options: ShapeAttributes[];
    correctIndex: number;
    rule: GameRule;
}
