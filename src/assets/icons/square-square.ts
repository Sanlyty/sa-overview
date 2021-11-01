import { IconDefinition, IconName } from '@fortawesome/free-solid-svg-icons';

const prefix = 'fas';
const iconName = 'square-square' as IconName;
const width = 496;
const height = 512;
const ligatures: string[] = [];
const unicode = 'xxxx';
const svgPathData = 'M 48 32 C 21.5 32 0 53.5 0 80 L 0 432 C 0 458.5 21.5 480 48 480 L 400 480 C 426.5 480 448 458.5 448 432 L 448 80 C 448 53.5 426.5 32 400 32 L 48 32 z M 54 80 L 394 80 C 397.3 80 400 82.7 400 86 L 400 426 C 400 429.3 397.3 432 394 432 L 54 432 C 50.7 432 48 429.3 48 426 L 48 86 C 48 82.7 50.7 80 54 80 z M 153.3125 147.5 C 132.36438 147.5 115.5 164.36438 115.5 185.3125 L 115.5 326.6875 C 115.5 347.63562 132.36438 364.5 153.3125 364.5 L 294.6875 364.5 C 315.63562 364.5 332.5 347.63562 332.5 326.6875 L 332.5 185.3125 C 332.5 164.36438 315.63562 147.5 294.6875 147.5 L 153.3125 147.5 z';

export const squareSquare: IconDefinition =
{
    prefix: prefix,
    iconName: iconName,
    icon: [
        width,
        height,
        ligatures,
        unicode,
        svgPathData
    ]
};
