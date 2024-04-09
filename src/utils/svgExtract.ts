import { parse } from 'node-html-parser';

const randomColor = (() => {
    "use strict";
  
    const randomInt = (min:number, max:number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
  
    return () => {
      var h = randomInt(0, 360);
      var s = randomInt(42, 98);
      var l = randomInt(40, 90);
      return `hsl(${h},${s}%,${l}%)`;
    };
  })();

function getPastel(){ 
    return "hsl(" + 360 * Math.random() + ',' +
            (25 + 70 * Math.random()) + '%,' + 
            (85 + 10 * Math.random()) + '%)'
};

function getColor2(){
    return `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`
}

export const extractSvgContents = (svg:string, prompt:string) => {
    const svgContents = parse(svg).getElementsByTagName('svg').map(tag => {
        tag.getElementsByTagName('text').forEach(text => {
            tag.removeChild(text);
        });
        // const colors = {};
        // const childrenWithColors = tag.childNodes.filter((child:any) => {
        //     return child.getAttribute?.('fill') !== 'none';
        // });
        // childrenWithColors.forEach((child:any) => {
        //     const fill = child.getAttribute('fill');
        //     colors[fill] = colors[fill] || [];
        // });
        // if (Object.keys(colors).length <= 2) {
        //     childrenWithColors.forEach((child:any) => {
        //         child.setAttribute('stroke', '#000000');
        //     });
        // }
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

