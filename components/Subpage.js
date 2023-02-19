import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { Spotifyembed } from './Spotifyembed';
import { Tweetembed } from './Tweetembed';
import {Youtubeembed} from './Youtubeembed';
import {Loomembed} from './Loomembed'
import {Googlemapsembed} from './Googlemapsembed'
import Toggle from './Toggle';

function Subpage({pageId,access_token}) {
 
  console.log('pdid',pageId)
  console.log('acc',access_token)
    
    const [page,setPage]=useState([]);
    const [pageblock,setPageBlock]=useState([]);
    const [child,setChild]=useState([]);
    
    
    useEffect(()=>{
     getPageData();
    },[])
  
  //https://calico-grass-ed1.notion.site/Samplepage-5b6bb34170ff491cb83038a2b1cd7f3c
  async function getPageData(){
    const data = await axios.post(`/api/pages`,
       {
        pageId:pageId,
        pageblockId:pageId,
        token:access_token
      });
      console.log('data',data)
      setChild(data.data.child)
      setPageBlock(data.data.pageblock)
      setPage(data.data.pagedata)
  }
  console.log('page',page)
  console.log('pgblock',pageblock)
  console.log('child',child)
  
    // console.log("defined block", definedBlock)
    const something = child.map((child,index) => {
      return child.type === "table_row"
        ? child?.table_row?.cells.map((item,i) => (
          <div key={i}>{item[0]?.text.content}</div>
        ))
        : "";
    });
    // const rows = something.map((row) => {
    //   return row.map((cell) => cell);
    // });
  
    // console.log("type", rows);
  
    // console.log("something", something);
    // const datasOfPage = pageblock;
    // const items = datasOfPage || [];
    const codeBlocks = pageblock.map((block) => {
      if (block.type == "callout") {
        return (
          <div
            key={block?.id}
            className="px-4 py-2 text-black my-5 bg-[#F1F1EF] rounded-lg"
          >
            <div>
              {" "}
              <span key={block?.id} className="inline-block mr-2">
                {block?.callout?.icon?.type == "emoji"
                  ? block?.callout?.icon?.emoji
                  : ""}
              </span>
              {block?.callout?.rich_text.map((item) => item?.text?.content)}
            </div>
          </div>
        );
      } else if (block.type == "code") {
        console.log("-->code", block);
        return (
          <div className=' bg-[#F1F1EF] p-2'  key={block?.id}>
            <span className=' flex justify-end text-[#19171199] text-sm'>{block?.code?.language}</span>
            <pre
            className={`p-2 overflow-x-auto grid  rounded-md`}
            key={block.id}
          >
            {block?.code?.rich_text.map((item,i) => (
              <div className='' key={i}>{item?.text?.content}</div>
            ))}
          </pre>
          </div>
        );
      } else if (block.type == "heading_3") {
        return (
          <div
            key={block?.id}
            className="md:my-5 my-2 md:text-3xl text-lg font-medium text-gray-800 capitalize "
          >
            {block?.heading_3?.rich_text.map((item) => item?.text?.content)}
          </div>
        );
      } else if (block.type == "heading_2") {
        return (
          <div
            key={block?.id}
            className="md:my-5 my-2 md:text-5xl text-xl font-semibold text-gray-800 capitalize "
          >
            {block?.heading_2?.rich_text.map((item) => item?.text?.content)}
          </div>
        );
      } else if (block.type == "heading_1") {
        return (
          <div key={block?.id} className="md:my-6 my-3 md:text-6xl text-3xl font-bold mt-5">
            {block?.heading_1?.rich_text.map((item) => item?.text?.content)}
          </div>
        );
      } else if (block.type == "paragraph") {
       
        return (
          <div className="text-base leading-relaxed md:text-lg lg:text-xl" key={block?.id}>
            {block?.paragraph?.rich_text.map((item) => item?.text?.content)}
          </div>
        );
      } else if (block.type == "quote") {
       
        return (
          <div
            key={block?.id}
            className={`w-full my-5 caret-color-black-500 px-3 py-2 max-w-full text-base border-gray-800 white-space-pre-wrap word-break-break-word text-md border-l-4`}
          >
            {block?.quote?.rich_text.map((item) => item?.text?.content)}
          </div>
        );
      } 
      else if (block?.type == "toggle") {
        return <Toggle block={block} child={child}/>
      } 
      else if (block.type == "to_do") {
        // const [colorToDo, setColorToDo] = useState(
        //   block?.to_do?.color == "default" ? "gray" : "black"
        // );
        // useEffect(() => {
        //   setColorToDo(block?.to_do?.color);
        // }, [block]);
        const classNameCheck =
          block?.to_do?.checked == true ? "line-through" : "";
        
        return (
          <div
            key={block?.id}
            className={` my-5 flex items-center font-normal text-base  ${classNameCheck} leading-relaxed mb-4`}
          >
            <input
              type="checkbox"
              checked={block?.to_do?.checked}
              readOnly={true}
            />
            <div className="ml-3 ">
              {block?.to_do?.rich_text.map((item,i) => (
                <div key={i}>{item?.text?.content}</div>
              ))}
            </div>
          </div>
        );
      } else if (block.type == "numbered_list_item") {
        return (
          <li className="my-5 list-decimal text-md " key={block.id}>
            {block.numbered_list_item.rich_text.map(
              (item,i) => (
                <span key={i}>{item?.text?.content}</span>
              )
            )}
          </li>
        );
      } else if (block.type == "video") {
        return (
          <div className="my-5 text-sm md:text-base lg:text-lg "  key={block?.id}>
           
            <a href={`${block.video.external.url}`}>{block.video.external.url}</a>
          </div>
        );
      } else if (block.type == "image") {
        return (
          <div className="my-5 "  key={block?.id}>
            <img src={`${block.image.file.url}`} alt="" />
          </div>
        );
      } else if (block.type == "embed") {
        const url = block?.embed?.url;
        const spliturl = url.split("/");
       
        if (spliturl[2] === "open.spotify.com") {
          return <Spotifyembed trackUrl={spliturl} key={block.id}/>;
        } else if (spliturl[2] === "twitter.com") {
          return <Tweetembed tweet={spliturl} key={block.id} />;
        } 

        // else if (spliturl[2] === "goo.gl") {
        //     return <Googlemapsembed place={spliturl} />;
        //   }
      } else if (
        block &&
        block.type === "paragraph" &&
        block.paragraph &&
        block.paragraph.rich_text &&
        block.paragraph.rich_text[0] &&
        block.paragraph.rich_text[0].type === "equation" &&
        block.paragraph.rich_text[0].equation
      ) {
        return (
          <div className="my-5 " key={block.id}>
            {block.paragraph.rich_text[0].equation.expression}
          </div>
        );
      } else if (block.type == "bulleted_list_item") {
        return (
          <ul className="max-w-md my-5 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400"  key={block?.id}>
            <li className="text-md">
              {block.bulleted_list_item.rich_text[0].text.content}
            </li>
          </ul>
        );
       
      }
     
    });
    let properties;
    {
      properties = page?.properties && Object.values(page?.properties);
    }
  
    return (
      <div className="flex flex-col bg-white">
        {/* <div>
          <Navbar />
        </div> */}
        <div className="w-full block justify-center items-center">
        {page?.cover?.external?.url ? (
          <div className="w-full max-w-[1000px] mx-auto">
          <img
            src={page?.cover?.external?.url}
            className=' object-cover max-h-48 w-full'
          ></img>
        </div>
        ):null} 
          <div className="w-full max-w-[800px] p-5 mx-auto">{codeBlocks}</div>
        </div>
      </div>
    );
  }

export default Subpage

