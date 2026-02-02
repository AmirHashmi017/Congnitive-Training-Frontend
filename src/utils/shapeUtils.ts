import type { ShapeAttributes } from '../types';

/**
 * Utility to generate SVG path/elements for various shapes
 */
export const getShapePath = (attributes: ShapeAttributes): string => {
    const { type } = attributes;

    // Base coordinates for a 100x100 viewbox
    switch (type) {
        case 'triangle':
            return 'M 50,10 L 90,90 L 10,90 Z';
        case 'square':
            return 'M 10,10 H 90 V 90 H 10 Z';
        case 'rectangle':
            return 'M 10,25 H 90 V 75 H 10 Z';
        case 'circle':
            // Using path for circle to allow uniform handling if needed
            return 'M 50,50 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0';
        case 'hexagon':
            return 'M 50,5 L 89,27.5 L 89,72.5 L 50,95 L 11,72.5 L 11,27.5 Z';
        case 'pentagon':
            return 'M 50,5 L 94,37 L 77,90 L 23,90 L 6,37 Z';
        case 'star':
            return 'M 50,5 L 63,38 L 98,38 L 70,59 L 81,92 L 50,72 L 19,92 L 30,59 L 2,38 L 37,38 Z';
        default:
            return 'M 10,10 H 90 V 90 H 10 Z'; // Fallback to square
    }
};

/**
 * Generates a random color from a curated list of vibrant colors
 */
export const getRandomColor = (): string => {
    const colors = [
        '#58cc02', // Green
        '#1cb0f6', // Blue
        '#ff4b4b', // Red
        '#ffc800', // Yellow
        '#ce82ff', // Purple
        '#ff9600', // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};
