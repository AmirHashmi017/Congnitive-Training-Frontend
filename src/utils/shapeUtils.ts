import type { ShapeAttributes } from '../types';


export const getShapePath = (attributes: ShapeAttributes): string => {
    const { type } = attributes;

    switch (type) {
        case 'triangle':
            return 'M 50,10 L 90,90 L 10,90 Z';
        case 'square':
            return 'M 10,10 H 90 V 90 H 10 Z';
        case 'rectangle':
            return 'M 10,25 H 90 V 75 H 10 Z';
        case 'circle':
            return 'M 50,50 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0';
        case 'hexagon':
            return 'M 50,5 L 89,27.5 L 89,72.5 L 50,95 L 11,72.5 L 11,27.5 Z';
        case 'pentagon':
            return 'M 50,5 L 94,37 L 77,90 L 23,90 L 6,37 Z';
        case 'star':
            return 'M 50,5 L 63,38 L 98,38 L 70,59 L 81,92 L 50,72 L 19,92 L 30,59 L 2,38 L 37,38 Z';
        case 'irregular_l':
            
            return 'M 20,10 L 50,10 L 50,50 L 90,50 L 90,90 L 20,90 Z';
        case 'irregular_arrow':
           
            return 'M 10,35 L 60,35 L 60,10 L 95,50 L 60,90 L 60,65 L 10,65 Z';
        case 'irregular_zigzag':
            
            return 'M 10,50 L 30,20 L 50,50 L 70,20 L 90,50 L 70,80 L 50,50 L 30,80 Z';
        case 'irregular_step':
            
            return 'M 10,70 L 30,70 L 30,50 L 50,50 L 50,30 L 70,30 L 70,10 L 90,10 L 90,90 L 10,90 Z';
        case 'irregular_cross':
            
            return 'M 35,10 L 65,10 L 65,35 L 90,35 L 90,65 L 65,65 L 65,90 L 35,90 L 35,65 L 10,65 L 10,35 L 35,35 Z';
        default:
            return 'M 10,10 H 90 V 90 H 10 Z'; 
    }
};


export const getRandomColor = (): string => {
    const colors = [
        '#58cc02', 
        '#1cb0f6', 
        '#ff4b4b', 
        '#ffc800', 
        '#ce82ff',
        '#ff9600', 
        '#ff89bb', 
        '#a05a2c', 
        '#545454',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};
