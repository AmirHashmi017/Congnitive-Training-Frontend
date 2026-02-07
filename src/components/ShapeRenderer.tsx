import React from 'react';
import type { ShapeAttributes } from '../types';
import { getShapePath } from '../utils/shapeUtils';
import {
    Car, Bird, Bus, Cat, Dog, Fish, PawPrint,
    Zap, Star, Heart, Cloud, Sun, Moon,
    Target, Award, Badge, Hexagon, Shield,
    Apple, Banana, Cherry, Grape, Citrus,  // Lemon/Orange map to Citrus/etc? No, need specific
    // Let's use generic lucide names
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

// Map for "lemon", "orange", "strawberry" which might not be in Lucide 
// We will Map them to closest or remove from constants if not available.
// Lucide has: Apple, Banana, Cherry, Grape, Citrus (use for lemon/orange)
// Strawberry? No.
// Ball? "Circle"?
// Flower? "Flower" or "Flower2"?

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
    lemon: Citrus, // Approximate
    orange: Citrus, // Approximate
    strawberry: Cherry, // Fallback or remove? Let's use Cherry for now or remove from constants

    // Objects
    ball: CircleDot, // Fallback
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

    // 1. TEXT RENDERER (Level 8 & 10 Options)
    if (type === 'text') {
        return (
            <div
                className={`flex items-center justify-center font-black text-center select-none ${className}`}
                style={{ ...containerStyle, fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: color }}
            >
                {contentValue || value}
            </div>
        );
    }

    // 2. ICON RENDERER (Level 10 Target & Level 11)
    if (type === 'icon') {
        const IconComponent = ICON_MAP[iconName?.toLowerCase() || ''] || Star;
        return (
            <div className={`flex items-center justify-center ${className}`} style={containerStyle}>
                <IconComponent
                    size="100%"
                    color={color}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    strokeWidth={attributes.strokeWidth || 2}
                />
            </div>
        );
    }

    // 3. PATTERN RENDERER (Level 9)
    if (type === 'pattern') {
        // If subShapes provided, use them (complex composition)
        // If count provided, repeat the main shape attributes
        const itemsToRender = subShapes || Array(count || 1).fill({ ...attributes, type: 'circle' }); // fallback

        // Grid layout calculation based on count
        const gridCols = itemsToRender.length > 4 ? 3 : itemsToRender.length > 1 ? 2 : 1;

        return (
            <div
                className={`grid gap-1 items-center justify-center ${className}`}
                style={{
                    ...containerStyle,
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    transform: 'scale(1)' // Reset scale for container, scale items instead? or keep?
                }}
            >
                {itemsToRender.map((attr, i) => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10">
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
