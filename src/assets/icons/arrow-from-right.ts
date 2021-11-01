import { IconDefinition, IconName } from '@fortawesome/free-solid-svg-icons';

const prefix = 'fas';
const iconName = 'arrow-from-right' as IconName;
const width = 496;
const height = 512;
const ligatures: string[] = [];
const unicode = 'xxxx';
const svgPathData = 'm 422.64961,19.099609 c 13.3,0 24,10.7 24,24 0,141.266931 0,282.533851 0,423.800781 0,13.3 -10.7,24 -24,24 h -32 c -13.3,0 -24,-10.7 -24,-24 V 296 h -230 l 100,94 c 9.7,9.3 9.90039,24.80078 0.40039,34.30078 L 214.84883,446.5 c -9.3,9.4 -24.49033,9.39188 -33.89844,0 L 7.05,272.90039 C -2.35,263.60039 -2.35,248.4 7.05,239 L 180.95039,63.5 c 9.3,-9.4 24.49844,-9.4 33.89844,0 L 237.05,85.699219 c 9.6,9.5 9.39961,25.000781 -0.40039,34.300781 l -100,96 h 230 V 43.099609 c 0,-13.3 10.7,-24 24,-24 z';

export const arrowFromRight: IconDefinition =
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
