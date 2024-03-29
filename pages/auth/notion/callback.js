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
        redirect_uri:'https://notion-cms-jade.vercel.app/auth/notion/callback'
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