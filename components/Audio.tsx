import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useDebounce } from 'use-debounce';

export default function Audio() {
  const [skippedTime, setSkippedTime] = useState(0);
  const [value] = useDebounce(skippedTime, 300);

  useEffect(() => {
    console.log(`The time you skipped to: ${value}s (debounced 300ms)`);

    // TODO: database operation
  }, [value]);

  const handleOnPause = () => {
    console.log('paused song')

    // TODO: database operation
  }

  const handleOnPlay = () => {
    console.log('playing song')

    // TODO: database operation
  }

  const handleOnSeeked = (e: SyntheticEvent<HTMLAudioElement>) => {
    // What time the user skips to
    setSkippedTime(e.target.currentTime);
  }

  return (
    <div>
      <audio controls src="/audio.mp3" onPause={handleOnPause} onPlay={handleOnPlay} onSeeked={handleOnSeeked}></audio>
    </div>
  );
}