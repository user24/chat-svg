"use client";
import {useState, useEffect, FormEvent} from 'react';
import logoSvg from '../../public/logo.svg';
import loadingSvg from '../../public/loading4.svg';
import css from "./chat.module.css";
import Image from 'next/image';
import {extractSvgContents} from '../utils/svgExtract';
import {pickRandom} from '../utils/random';

const adjectives = ['blocky', 'bubbly'];
const prompts = [
  'robot',
  'tree',
  'stick man',
  'caterpillar',
  'chess icon',
  'cat',
  'animal face',
  'app icon',
  'green frog'
];

const standalonePrompts = [
  'computer icon',
  'angular spaceship',
  'solar system',
  'car',
  'national flag'
];

function upperFirst(str:string) {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
}

const suggestRandom = () => {
  const weight = standalonePrompts.length / prompts.length;
  if (Math.random() > weight) {
    return `${pickRandom(adjectives)} ${pickRandom(prompts)}`;
  } else {
    return pickRandom(standalonePrompts);
  }
};


export default function Chat () {

  const LoadingSpinner = () => <Image
    priority
    src={loadingSvg}
    alt={'loading'}
  />;
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [topic, setTopic] = useState('');
  const [numSubmits, setNumSubmits] = useState(0);
  const submissionSoftLimit = 10;
  const submissionWarnLimit = 20;
  const submissionLockout = 50;

  useEffect(() => {
    handleRandom();
  }, []);

  const handleRandom = () => {
    setTopic(suggestRandom());
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setNumSubmits(numSubmits+1);
    
    const response = await fetch(`/api/ai?topic=${topic}`);
    const data = await response.json();
    data.answers.forEach((answer:string, i:number) => console.log(`Raw ChatGPT output ${i}`, answer));
    const svgs = extractSvgContents(data.answers.join(' '), `${upperFirst(topic.trim())}. Generated by ChatSVG.`);
    setLoading(false);
    setResult(svgs);
  };

  return <div className={css.main}>
    <Image
      priority
      src={logoSvg}
      alt={'ChatSVG logo, a cute yellow bear, possibly grumpy.'}
    />
    <h1>ChatSVG</h1>

    {numSubmits > submissionSoftLimit && (
      <blockquote className={css.warning}>
        <strong>Hey!</strong> I love that you are experimenting with this so much, let's have a chat about your experiences?<br />
        {numSubmits > submissionWarnLimit && <p>Please don&apos;t hammer it too much, every query costs me a fraction of a cent - it adds up quick!</p>}
        {numSubmits > submissionLockout && <strong>Reached query limit - account disabled</strong>}
      </blockquote>
      )}

    {process.env.NEXT_PUBLIC_MOCK_AI && <p>Dev mode - AI functions are mocked</p>}

    {loading ? <LoadingSpinner /> : <div dangerouslySetInnerHTML={{__html: result ?? ''}} />}

    <form onSubmit={handleSubmit}>
      <label>
          SVG topic&nbsp;
          <input type='text' name='topic' value={topic} onChange={e => setTopic(e.currentTarget.value)}></input>
      </label>
      <button type="button" onClick={handleRandom}>Suggest one</button>
      <br />
      <button disabled={loading || numSubmits > submissionLockout} className={css.createButton}>Create</button>
    </form>

    {result && <>
      <p>Caution: Results are generated by AI and are therefore unreliable.</p>
      <code className={css.code}>{result}</code>
    </>}

    <blockquote className={css.hello}><strong>What is this for?</strong> Right now it&apos;s just a side project to play with AI tech. The main effort has gone into layering code on top of the AI output to reliably extract SVG files without having to do much prompt engineering. A future effort will attempt to improve the quality of the generated SVGs. tldr; fun!</blockquote>

    <blockquote className={css.hello}><strong>Hello OS/Twitter folks</strong>. If you have this link it&apos;s because I&apos;ve personally shared it with you as an <strong>early preview</strong>. It&apos;s not ready for the full force of the internet, so I am trusting you not to share it with like reddit or HN just yet, please. However, I do value your individual feedback so please do reach out via whatever medium I sent you this link and let&apos;s talk :)</blockquote>

    <p>A quick and dirty side project by <a href='https://solidred.co.uk'>Howard Yeend</a>.</p>

    <p>Improve ChatSVG by <a href='https://github.com/user24/chat-svg'>submitting a PR</a> on github.</p>


  </div>;
}