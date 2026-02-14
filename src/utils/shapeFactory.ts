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

const IRREGULAR_SHAPE_TYPES: ShapeType[] = [
    'irregular_l',
    'irregular_arrow',
    'irregular_zigzag',
    'irregular_step',
    'irregular_cross'
];


export const ShapeFactory = {

    generateRandomShape(): ShapeAttributes {
        return {
            type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
            color: getRandomColor(),
            rotation: 0,
            size: 0.8 + Math.random() * 0.4,
            value: Math.floor(Math.random() * 9) + 1,
        };
    },

    generateShape(overrides: Partial<ShapeAttributes>): ShapeAttributes {
        return {
            ...this.generateRandomShape(),
            ...overrides
        };
    },


    generateRandomIrregularShape(): ShapeAttributes {
        return {
            type: IRREGULAR_SHAPE_TYPES[Math.floor(Math.random() * IRREGULAR_SHAPE_TYPES.length)],
            color: getRandomColor(),
            rotation: Math.random() < 0.5 ? 0 : 180,
            size: 0.9 + Math.random() * 0.2,
        };
    }
};
