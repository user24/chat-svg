import { parse } from 'node-html-parser';

export const extractSvgContents = (svg:string) => {
    const svgContents = parse(svg).getElementsByTagName('svg')[0]?.innerHTML;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">${svgContents}</svg>`;
}


// const training = [
//     `-->
//     <svg><circle /></svg>`,
//     `\`\`\`
//     <svg><circle /></svg>`
// ];

// const extracted = training.map(extractSvgContents);

// console.log(extracted);

