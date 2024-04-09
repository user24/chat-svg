"use client";
import {useState, useEffect, FormEvent} from 'react';
import logoSvg from '../../public/logo.svg';
import loadingSvg from '../../public/loading4.svg';
import styles from "./chat.module.css";
import Image from 'next/image';
import {extractSvgContents} from '../utils/svgExtract';
import {pickRandom} from '../utils/random';

const adjectives = ['cute', 'angry', 'happy'];
const prompts = [
  'robot',
  'single tetris block',
  'tree',
  'animal',
  'spaceship',
  'program icon'
];

const suggestRandom = () => {
  return `${pickRandom(adjectives)} ${pickRandom(prompts)}`;
};

export default function Chat () {

  const LoadingSpinner = () => <Image
    priority
    src={loadingSvg}
    alt={'loading'}
  />;
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [topic, setTopic] = useState('');

  useEffect(() => {
    handleRandom();
  }, []);

  const handleRandom = () => {
    setTopic(suggestRandom());
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await fetch(`/api/ai?topic=${topic}`)
    const data = await response.json()
    const svg = extractSvgContents(data.answer);
    setLoading(false);
    setResult(svg);
  };

  return <div className={styles.main}>
    <Image
      priority
      src={logoSvg}
      alt={'ChatSVG logo, a cute yellow bear, possibly grumpy.'}
    />
    <h1>Chat SVG</h1>

    {process.env.NEXT_PUBLIC_MOCK_AI ? 'Dev mode - AI functions are mocked' : null}

    {loading ? <LoadingSpinner /> : <div dangerouslySetInnerHTML={{__html: result}} />}

    <form onSubmit={handleSubmit}>
      <label>
          SVG topic&nbsp;
          <input type='text' name='topic' value={topic} onChange={e => setTopic(e.currentTarget.value)}></input>
      </label>
      <button type="button" onClick={handleRandom}>Suggest one</button>
      <br />
      <button>Create</button>
    </form>

    <code className={styles.code}>{loading ? <LoadingSpinner /> : result}</code>

  </div>;
}