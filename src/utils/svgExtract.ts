import { parse } from 'node-html-parser';

export const extractSvgContents = (svg:string, prompt:string) => {
    const svgContents = parse(svg).getElementsByTagName('svg').map(tag => {
        tag.getElementsByTagName('text').forEach(text => {
            tag.removeChild(text);
        });
        tag.insertAdjacentHTML('afterbegin', `<desc>${prompt}</desc>`);
        return tag.innerHTML;
    });
    return svgContents.map(svg => `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">${svg}</svg>`);
}


// const training = [
//     `-->
//     <svg><circle /></svg>`,
//     `\`\`\`
//     <svg><circle /></svg>`
// ];

// const extracted = training.map(extractSvgContents);

// console.log(extracted);

