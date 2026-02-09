import React from 'react';
import type { ShapeAttributes } from '../types';
import { getShapePath } from '../utils/shapeUtils';
import {
    Car, Bird, Bus, Cat, Dog, Fish, PawPrint,
    Zap, Star, Heart, Cloud, Sun, Moon,
    Target, Award, Badge, Hexagon, Shield,
    Apple, Banana, Cherry, Grape, Citrus,
    Book, Clock, Flower, House, Key, Pencil, Phone, Plane, Umbrella, Watch,
    Anchor, Aperture, Atom, Axe, Bell, Bomb, Bone, Camera, Cast,
    CircleDot, Compass, Crown, Diamond, Droplet, Eye, Feather, Flag, Flame, Flashlight,
    Ghost, Globe, Hammer, Leaf, Lightbulb, Magnet, Map, Mic, Mountain, Music, Palette,
    Paperclip, Rocket, Scissors, Skull, Snowflake, Spade, Sword, Thermometer, Trophy
} from 'lucide-react';

interface ShapeRendererProps {
    attributes: ShapeAttributes;
    className?: string;
    width?: number | string;
    height?: number | string;
}

const ICON_MAP: Record<string, React.FC<any>> = {
    car: Car,
    bus: Bus,
    bird: Bird,
    cat: Cat,
    dog: Dog,
    fish: Fish,
    animal: PawPrint,

    // Fruit
    apple: Apple,
    banana: Banana,
    cherry: Cherry,
    grape: Grape,
    lemon: Citrus,
    orange: Citrus,
    strawberry: Cherry,

    // Objects
    ball: CircleDot,
    book: Book,
    clock: Clock,
    cloud: Cloud,
    flower: Flower,
    house: House,
    key: Key,
    moon: Moon,
    pencil: Pencil,
    phone: Phone,
    plane: Plane,
    star: Star,
    sun: Sun,
    umbrella: Umbrella,
    watch: Watch,

    // Complex
    target: Target,
    heart: Heart,
    award: Award,
    badge: Badge,
    hexagon: Hexagon,
    shield: Shield,
    zap: Zap,
    anchor: Anchor,
    aperture: Aperture,
    atom: Atom,
    axe: Axe,
    bell: Bell,
    bomb: Bomb,
    bone: Bone,
    camera: Camera,
    cast: Cast,
    'circle-dot': CircleDot,
    compass: Compass,
    crown: Crown,
    diamond: Diamond,
    droplet: Droplet,
    eye: Eye,
    feather: Feather,
    flag: Flag,
    flame: Flame,
    flash: Flashlight,
    ghost: Ghost,
    globe: Globe,
    hammer: Hammer,
    leaf: Leaf,
    lightbulb: Lightbulb,
    magnet: Magnet,
    map: Map,
    mic: Mic,
    mountain: Mountain,
    music: Music,
    palette: Palette,
    paperclip: Paperclip,
    rocket: Rocket,
    scissors: Scissors,
    skull: Skull,
    snowflake: Snowflake,
    spade: Spade,
    sword: Sword,
    thermometer: Thermometer,
    trophy: Trophy
};

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
    attributes,
    className = "",
    width = "100%",
    height = "100%"
}) => {
    const { type, color, rotation, size, opacity = 1, value, contentValue, iconName, count, subShapes } = attributes;

    const containerStyle = {
        width,
        height,
        opacity,
        transform: `scale(${size})`,
        transition: 'all 0.3s ease'
    };

    // 1. TEXT RENDERER (Level 8 & 10 Options) - IMPROVED
    if (type === 'text') {
        return (
            <div
                className={`flex items-center justify-center font-black text-center select-none leading-tight ${className}`}
                style={{ 
                    ...containerStyle, 
                    fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)', 
                    color: color,
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    padding: '0.25rem'
                }}
            >
                {contentValue || value}
            </div>
        );
    }

    // 2. ICON RENDERER (Level 10 Target & Level 11) - WITH INNER PATTERN VARIATIONS
    if (type === 'icon') {
        const IconComponent = ICON_MAP[iconName?.toLowerCase() || ''] || Star;
        
        return (
            <div className={`flex items-center justify-center relative ${className}`} style={containerStyle}>
                {/* Main icon */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <IconComponent
                        size="70%"
                        color={color}
                        style={{ transform: `rotate(${rotation}deg)` }}
                        strokeWidth={attributes.strokeWidth || 2}
                    />
                    
                    {/* Inner pattern variations */}
                    {attributes.innerPattern && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {attributes.innerPattern === '1-dot' && (
                                <div
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                        opacity: 0.8
                                    }}
                                />
                            )}
                            {attributes.innerPattern === '2-dots' && (
                                <div className="flex gap-2">
                                    <div
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            opacity: 0.8
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            opacity: 0.8
                                        }}
                                    />
                                </div>
                            )}
                            {attributes.innerPattern === '3-dots' && (
                                <div className="flex gap-1.5">
                                    <div
                                        style={{
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            opacity: 0.8
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            opacity: 0.8
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            opacity: 0.8
                                        }}
                                    />
                                </div>
                            )}
                            {attributes.innerPattern === 'thick-ring' && (
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        border: `3px solid ${color}`,
                                        borderRadius: '50%',
                                        opacity: 0.8
                                    }}
                                />
                            )}
                            {attributes.innerPattern === 'thin-ring' && (
                                <div
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        border: `1px solid ${color}`,
                                        borderRadius: '50%',
                                        opacity: 0.8
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 3. PATTERN RENDERER (Level 9) - COMPACT VERSION
    if (type === 'pattern') {
        const itemsToRender = subShapes || Array(count || 1).fill({ ...attributes, type: 'circle' });

        // Compact grid layout - size based on number of items
        const gridCols = itemsToRender.length > 4 ? 3 : itemsToRender.length > 1 ? 2 : 1;
        const itemSize = itemsToRender.length > 4 ? '1.5rem' : itemsToRender.length > 2 ? '1.75rem' : '2rem';

        return (
            <div
                className={`grid gap-1 items-center justify-center ${className}`}
                style={{
                    opacity,
                    gridTemplateColumns: `repeat(${gridCols}, ${itemSize})`,
                    transform: 'scale(1)',
                    width: 'fit-content',
                    height: 'fit-content',
                    margin: 'auto'
                }}
            >
                {itemsToRender.map((attr, i) => (
                    <div key={i} style={{ width: itemSize, height: itemSize }}>
                        <ShapeRenderer attributes={{ ...attr, type: attr.type || 'circle', size: 1 }} />
                    </div>
                ))}
            </div>
        );
    }

    // 4. STANDARD SHAPE RENDERER (Levels 1-7)
    return (
        <svg
            viewBox="0 0 100 100"
            width={width}
            height={height}
            className={`transition-all duration-300 ${className}`}
            style={{
                transform: `scale(${size})`,
                opacity: opacity,
            }}
        >
            <path
                d={getShapePath(attributes)}
                fill={color}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="2"
                className="transition-all duration-300"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                }}
            />
            {value !== undefined && (
                <text
                    x="50"
                    y="50"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fill="white"
                    fontSize="28"
                    fontWeight="900"
                    className="select-none pointer-events-none"
                    style={{
                        paintOrder: 'stroke',
                        stroke: 'rgba(0,0,0,0.4)',
                        strokeWidth: '4px',
                        strokeLinejoin: 'round'
                    }}
                >
                    {value}
                </text>
            )}
        </svg>
    );
};

export default ShapeRenderer;