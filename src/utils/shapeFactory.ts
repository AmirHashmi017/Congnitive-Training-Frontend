import type { ShapeAttributes, ShapeType } from '../types';
import { getRandomColor } from './shapeUtils';

const SHAPE_TYPES: ShapeType[] = [
    'triangle',
    'square',
    'rectangle',
    'circle',
    'hexagon',
    'pentagon',
    'star'
];

/**
 * Factory class to generate procedural shapes
 */
export const ShapeFactory = {
    /**
     * Generates a completely random shape
     */
    generateRandomShape(): ShapeAttributes {
        return {
            type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
            color: getRandomColor(),
            rotation: Math.floor(Math.random() * 360),
            size: 0.8 + Math.random() * 0.4, // size between 0.8 and 1.2
            value: Math.floor(Math.random() * 9) + 1, // random value 1-9
        };
    },

    /**
     * Generates a shape with specific constraints (useful for rules)
     */
    generateShape(overrides: Partial<ShapeAttributes>): ShapeAttributes {
        return {
            ...this.generateRandomShape(),
            ...overrides
        };
    }
};
