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
    | 'blob'
    | 'text' // For Level 8 (Instruction) & Level 10 (Answer Options)
    | 'icon' // For Level 10 (Target) & Level 11
    | 'pattern' // For Level 9
    | 'irregular_l' // For Level 12 - L-shaped polygon
    | 'irregular_arrow' // For Level 12 - Arrow-like shape
    | 'irregular_zigzag' // For Level 12 - Zigzag pattern
    | 'irregular_step' // For Level 12 - Step-like shape
    | 'irregular_cross'; // For Level 12 - Cross/plus shape

export interface ShapeAttributes {
    type: ShapeType;
    color: string; // Hex, RGB, or HSL
    rotation: number; // 0-360
    size: number; // Scale factor 0.1 to 2.0
    value?: number; // Numeric value inside the shape
    strokeWidth?: number;
    pattern?: string;
    opacity?: number;
    // New properties for advanced levels
    contentValue?: string; // For 'text' type (e.g., "Blue Circle") or 'icon' name
    iconName?: string; // Specific icon identifier for 'icon' type (e.g., 'bird', 'car')
    subShapes?: ShapeAttributes[]; // For 'pattern' type (composition of shapes)
    count?: number; // For 'pattern' type (e.g., 2 Circles)
    innerPattern?: string; // For complex shapes: variation in dots/rings ('1-dot', '2-dots', '3-dots', 'thick-ring', 'thin-ring')
}

export interface GameRule {
    id: string;
    description: string;
    matchType:
    | 'color'
    | 'shape'
    | 'size'
    | 'pattern' // Level 9
    | 'word' // Level 8
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
    | 'triple_match' // same shape, color, and value
    | 'word_match' // Level 8 specific
    | 'pattern_match' // Level 9 specific
    | 'object_id' // Level 10 specific
    | 'complex_match' // Level 11 specific
    | 'simple_word_match' // Level 2 specific
    | 'irregular_shape_match'; // Level 12 specific
}

export interface PuzzleRound {
    target: ShapeAttributes;
    options: ShapeAttributes[];
    correctIndex: number;
    rule: GameRule;
    type?: 'standard' | 'word' | 'pattern' | 'object' | 'complex'; // To help UI rendering
}
