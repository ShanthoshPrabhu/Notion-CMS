import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import Link from "next/link";
import React, { Fragment } from "react";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
import { useRouter } from "next/router";
import Subpage from "../../components/Subpage";

export const Text = ({ text }) => {
  if (!text) {
    return null;
  }
  return text.map((value,index) => {

    // console.log("value", value);

    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    // console.log('text',text)
    return (
      <span
        className={[
          bold ? "font-bold" : "",
          code ? " bg-[#F2F2F2] px-2 py-4 rounded-lg" : "",
          italic ? " italic" : "",
          strikethrough ? " line-through" : "",
          underline ? "underline" : "",
        ].join(" line-clamp-3")}
        style={color !== "default" ? { color } : {}}
        key={index}
      >
        {text?.link == null ? (
          text.content
        ) : (
          <a href={text?.link?.url}>{text?.content}</a>
        )}
      </span>
    );
  });
};

function Databasepage() {
  //  console.log("posts", posts);
  const [posts,setPosts]=useState([]);
  const router = useRouter();
  const databaseId = router.query.id[0]
  const [blogData,setBlogData]=useState([])
//   console.log('router',router)
//   console.log('posts',posts)
  const data = []
//  console.log('databaseId',databaseId)
  useEffect(()=>{
   getData()
  },[])
  console.log('router.query.id.length <3 && router.query.id.length >1',router.query.id.length <3 && router.query.id.length >1 && blogData.length != 0)

  useEffect(()=>{
    checkData()
  },[blogData])
  async function getData(){
    const docRef = doc(db, "blogs", databaseId);
    const docSnap = await getDoc(docRef);
    console.log('docsnap',docSnap.data())
    // setBlogData(docSnap.data())
    setBlogData(docSnap.data())
    //  console.log('val',data)
  }
  if(router.query.id.length <3 && router.query.id.length >1 && blogData.length != 0){
    return <Subpage pageId={router.query.id[1]} access_token={blogData?.access_token}/>
 }
//   console.log('blogData',blogData)
  // console.log('data',data)
  // console.log("user", user);
  async function checkData() {
    // console.log('blogData?.databaseid',blogData?.databaseid)
    // console.log('blogData?.access_token',blogData?.access_token)
    const getdata = await axios.post(`/api/notion`,
     {
      databaseId:blogData?.blogId,
      token:blogData?.access_token
    });
    // console.log("getdata", getdata);
    return setPosts(getdata.data.data)
  }
  const title = posts.map((post,i) => {
    const properties = Object.values(post?.properties);
    const titleProperties = properties
      .filter((property) => property?.type === "title")
      .map((property,i) => {
        return property?.title?.map((value,i) => (
          <div className="" key={i}>{value?.text?.content}</div>
        ));
      });
    return (
      <div className="font-sans text-2xl font-bold" key={i}>{titleProperties}</div>
    );
  });



  return (
    <div className="flex flex-col items-center justify-center max-w-screen-2xl sm:m-8">
      {/* <div className="z-50"><BlogNav/></div> */}
      <h2 className="mb-[70px] text-3xl">All Posts</h2>
      <div className="grid grid-flow-row-dense mx-auto xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 ">
        {posts.map((post,index) => {
          // console.log(
          //   "postingggggggggg",
          //   post?.properties?.Name?.title[0]?.text?.content
          // );
          const colorArray = ['#fee2e2', '#fce7f3', '#dbeafe', '#ede9fe', '#d1fae5', '#fef3c7', '#ffedd5', '#fef3c7', '#f5f5f5', '#d1fae5'];
          const shuffledArray = colorArray.sort(() => Math.random() - 0.5);
                //  console.log('shuffledArray',shuffledArray)
          const date = new Date(post.last_edited_time).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          const properties = Object.values(post?.properties);
          const titleProperties = properties
         .filter((property) => property?.type === "title")
         ?.map((property) => {
           return property?.title?.map((value,i) => {
           return (<div key={i}>{value?.text?.content}</div>) 
          });
      });
          const multiSelectProperties = properties
            .filter((property) => property?.type === "multi_select")
            ?.map((prop) => {
              return prop?.multi_select?.map((value,index) => {
                
                return (
                  <div className="cursor-pointer text-sm font-medium ml-4 px-2 py-[1px] flex justify-around shadow-md rounded-sm"
                  style={{ backgroundColor: shuffledArray[index % shuffledArray.length] }} key={index}>
                    {value?.name}
                  </div>
                );
              });
            });
          return (
            // <Link className="" href={`/${databaseId}/${post?.id}`}>
             
            // </Link>
            <div className="relative items-center justify-center m-8 transition duration-300 ease-in-out bg-white rounded-lg cursor-pointer hover:scale-105 hover:-translate-y-1 hover:delay-150"
            key={index}
           onClick={()=>router.push(`/${databaseId}/${post?.id}`)}>
              <div className="w-full">
                <img
                  src={post?.cover?.external?.url}
                  alt=""
                  className="w-full min-h-[210px] max-h-[210px] object-cover rounded-lg"
                />
              </div>

              <div className="px-2 py-2">
                <div className="flex items-center justify-between py-2 text-xs">
                  <div className="flex font-mono ">{multiSelectProperties}</div>
                  <span className="text-neutral-500">{date}</span>
                </div>
               <div className="flex px-3 py-2">
                <h1 className=" text-xl font-semibold ">
                    {titleProperties}
                  </h1>
               </div>
                <div className="p-3 text-lg line-clamp-3">
                  <Text text={post?.properties?.Text?.rich_text} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {}
    </div>
  );
}

export default Databasepage;



export const getServerSideProps = async (context) => {
  
  let user = []
  
  const databaseId = context.params.id;

  console.log('databaseId',databaseId)
  // const notion = new Client({
  //   auth:user.access_token
  // });
 
  // const database = await getDatabase(databaseId);
  // const datablock =await getBlocks(databaseId);
 
  // const getDatabase = async (databaseId) => {
  //   const response = await notion.databases.query({
  //     database_id: databaseId,
  //   });
  //   return response.results;
  // };
  
  //  const getBlocks = async (blockId) => {
  //   const blocks = [];
  //   let cursor;
  //   while (true) {
  //     const { results, next_cursor } = await notion.blocks.children.list({
  //       start_cursor: cursor,
  //       block_id: blockId,
  //     });
  //     blocks.push(...results);
  //     if (!next_cursor) {
  //       break;
  //     }
  //     cursor = next_cursor;
  //   }
  //   return blocks;
  // };
  // useEffect(()=>{
  //     getData();
  // },[])
  
  return {
    props: {
     user:user
    }
  };
};
