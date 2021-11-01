import { IconDefinition, IconName } from '@fortawesome/free-solid-svg-icons';

const prefix = 'fas';
const iconName = 'arrow-from-left' as IconName;
const width = 496;
const height = 512;
const ligatures: string[] = [];
const unicode = 'xxxx';
const svgPathData = 'm 24,19.099609 c -13.3,0 -24,10.7 -24,24 0,141.266931 0,282.533851 0,423.800781 0,13.3 10.7,24 24,24 h 32 c 13.3,0 24,-10.7 24,-24 V 296 h 230 l -100,94 c -9.7,9.3 -9.90039,24.80078 -0.40039,34.30078 L 231.80078,446.5 c 9.3,9.4 24.49033,9.39188 33.89844,0 L 439.59961,272.90039 c 9.4,-9.3 9.4,-24.50039 0,-33.90039 L 265.69922,63.5 c -9.3,-9.4 -24.49844,-9.4 -33.89844,0 L 209.59961,85.699219 C 199.99961,95.199219 200.2,110.7 210,120 l 100,96 H 80 V 43.099609 c 0,-13.3 -10.7,-24 -24,-24 z';

export const arrowFromLeft: IconDefinition =
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
