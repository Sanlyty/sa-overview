import { IconDefinition, IconName } from '@fortawesome/free-solid-svg-icons';

const prefix = 'fas';
const iconName = 'arrow-to-left' as IconName;
const width = 496;
const height = 512;
const ligatures: string[] = [];
const unicode = 'xxxx';
const svgPathData = 'm 56,19.099609 c 13.3,0 24,10.7 24,24 V 209.12891 L 224.30078,63.5 c 9.30722,-9.392852 24.49844,-9.4 33.89844,0 l 22.20117,22.199219 C 289.95052,95.24935 289.74621,110.64364 280,120 l -100,96 h 246 c 13.3,0 24,10.7 24,24 v 32 c 0,13.3 -10.7,24 -24,24 H 180 l 100,94 c 9.7913,9.20382 9.90039,24.80078 0.40039,34.30078 L 258.19922,446.5 c -9.35013,9.35013 -24.49033,9.39188 -33.89844,0 L 80,302.44922 v 164.45117 c 0,13.3 -10.7,24 -24,24 H 24 c -13.3,0 -24,-10.7 -24,-24 0,-141.26693 0,-282.53385 0,-423.800781 0,-13.3 10.7,-24 24,-24 z';

export const arrowToLeft: IconDefinition =
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
