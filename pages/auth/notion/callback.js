import { useRouter } from 'next/router'
import React from 'react'
// import {db} from '../../../firebase'
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {addDoc,collection,doc, getDoc, updateDoc} from "@firebase/firestore";
import { useEffect } from 'react';
import axios from 'axios';
// import { useSession } from 'next-auth/react';
import {  query, where, getDocs } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { db } from '../../../firebase';
// import { getServerSession } from 'next-auth';

function Callback({response}) {
  // const session = useSession();
  const {data:session} = useSession();
  const router =useRouter();
  console.log('session',session)
  async function updateData(){
    const docref = doc(db, "users", session?.user?.email)
    const docSnap = await getDoc(docref);
    console.log('docsnap',docSnap.data())
    const data = {
      access_token:response?.access_token,
      profileURL:response?.owner?.user?.avatar_url,
      notionusername:response?.owner?.user?.name,
      notionemail:response?.owner?.user?.person?.email
    }
    await updateDoc(docref,data);
   return
  }
 
  // useEffect(()=>{
    
  // },[])
  if(response && session){
    updateData();
    }
  
    console.log('response',response)
  
  return (
    <div className="flex flex-col space-y-4 items-center justify-center w-screen h-screen">
      {/* <div className="absolute top-0 mb-[120px] left-1/2 z-30 min-w-[400px] mt-3 sm:max-w-[600px] justify-center -translate-x-1/2 transform md:max-w-xl sm:px-0 lg:max-w-4xl xl:w-[1200px]">
      <div className="flex flex-col rounded-lg bg-white lg:w-full mb-[100px] min-h-[80vh] sm:w-full md:w-full xl:w-full lg:p-[100px] p-[30px] sm:p-[40px] overflow-y-auto">
                <div className="flex flex-col">
                 
                  <span className=" flex font-medium lg:ml-[40px] mt-4 lg:text-lg">
                    Do share your Notion page to public
                  </span>
                  <img 
                  //
                    alt=""
                    src="https://notaku.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnotion_page_copy_url.0c316447.png&w=750&q=75"
                    className=" min-h-[160px] sm:w-[420px] lg:w-[500px] xl:ml-[50px] lg:h-[280px]"
                  />
                </div>
             
                <div className="flex flex-col mt-10">
                  <span className="flex font-bold lg:text-xl">
                    Site name
                  </span>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      className=" min-w-[280px] flex-grow lg:w-[500px] max-w-[650px] border-2 border-gray-200 outline-none rounded-md p-2"
                      onChange={e=>setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-10">
                  <span className="flex font-bold lg:text-xl">
                    Notion page URL
                  </span>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      onChange={(e) => setPageUrl(e.target.value)}
                      className=" min-w-[280px] flex-grow lg:w-[400px] max-w-[650px] border-2 border-gray-200 outline-none rounded-md p-2"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-10">
                  
                  <button
                    className=" text-white bg-black rounded-md p-2 ml-[30px]"
                    onClick={validatePageUrl}
                  >
                    Create Website
                  </button>
                </div>
      </div>
      </div> */}
       <div>Authenticated successfully!</div>
        <button className=' px-2 py-1 bg-black text-white' onClick={()=>router.push('/dashboard')}>Continue to dashboard</button>
    </div>
      
    )
}

export default Callback



export async function getServerSideProps(resolvedUrl){
  const code = resolvedUrl.query.code;
  console.log('code',resolvedUrl)

  const res = await fetch(`https://api.notion.com/v1/oauth/token`,{
    method:'post',
    headers:new Headers({
        'Authorization':'Basic ' + btoa(process.env.NOTION_CLIENT_ID + ":" + process.env.NOTION_CLIENT_SECRET),
        'Content-Type':'application/json'
    }),
    body:JSON.stringify({
        grant_type:'authorization_code',
        code:code,
        redirect_uri:'http://localhost:3000/auth/notion/callback'
    })
  });

  console.log('res',res)

  const response = await res.json()

 
  // Add the data to Firebase

  return {
    props:{
      response:response
    },
  }
}