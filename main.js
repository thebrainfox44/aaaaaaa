const ytdl = require('ytdl-core-discord');
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const fs = require('fs');

const downloadYouTubeVideo = async (url, output) => {
  try {
    if (!ytdl.validateURL(url)) {
      console.error('Invalid URL');
      return;
    }

    console.log(`Fetching video info for URL: ${url}`);
    const info = await ytdl.getInfo(url);
    console.log('Video info fetched successfully');

    const audioStream = await ytdl(url, { quality: 'highestaudio' });

    const ffmpegProcess = cp.spawn(ffmpeg, [
      '-i', 'pipe:3',
      '-q:a', '0',
      '-map', 'a',
      output,
    ], {
      stdio: [
        'inherit', 'inherit', 'inherit',
        'pipe'
      ]
    });

    audioStream.pipe(ffmpegProcess.stdio[3]);

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Downloaded and converted: ${output}`);
      } else {
        console.error(`FFmpeg process exited with code: ${code}`);
      }
    });

    ffmpegProcess.on('error', (error) => {
      console.error(`Error in FFmpeg process: ${error.message}`);
    });

    audioStream.on('error', (error) => {
      console.error(`Error in audio stream: ${error.message}`);
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

// Replace with the desired YouTube URL and output file name
const url = 'https://www.youtube.com/watch?v=uNMmS_GAkLU';
const output = 'output.mp3'

downloadYouTubeVideo(url, output);
