import { TwitterTweetEmbed } from 'react-twitter-embed';

export function Tweetembed({tweet}) {
    //https://twitter.com/Shan19317228/status/1615763303887958020?s=20&t=5GUdcrbRoPUNbvDzZaInig
    // console.log('tweet',tweet)
    // const tweetsplit = tweet.split('/')[5];
    const tweetId = tweet[5].split('?')[0];
  return (
    <div className=' w-[100%] my-8'>
        <TwitterTweetEmbed
        tweetId={tweetId}
        options={{ width:'100%' }}
        />
    </div>
    
  );
}
