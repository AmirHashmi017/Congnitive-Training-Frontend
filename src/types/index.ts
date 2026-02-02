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
    value?: number; // Numeric value inside the shape
    strokeWidth?: number;
    pattern?: string;
    opacity?: number;
}

export interface GameRule {
    id: string;
    description: string;
    matchType:
    | 'color'
    | 'shape'
    | 'size'
    | 'pattern'
    | 'word'
    | 'not_color'
    | 'not_shape'
    | 'same_shape_diff_color'
    | 'same_color_diff_shape'
    | 'same_shape_same_color'
    | 'same_value'
    | 'not_value'
    | 'same_color_diff_value'
    | 'same_value_diff_color'
    | 'same_shape_diff_value'
    | 'same_value_diff_shape'
    | 'same_color_same_shape_diff_value'
    | 'same_shape_same_value_diff_color'
    | 'same_color_same_value_diff_shape'
    | 'triple_match'; // same shape, color, and value
}

export interface PuzzleRound {
    target: ShapeAttributes;
    options: ShapeAttributes[];
    correctIndex: number;
    rule: GameRule;
}
