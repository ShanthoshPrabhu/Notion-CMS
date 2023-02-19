import { Client } from "@notionhq/client";
const axios = require('axios')





export default async  (req,res) =>{
  const databaseId = req.body.databaseId
 console.log('req.b',req.body.databaseId)
  const pageId = req.body.pageId
  const token = req.body.token
  const pageblockId = req.body.pageblockId
  
  const NOTION_API_URL = 'https://api.notion.com';
console.log('req.body',req.body)
  const notion = new Client({
    auth:token
  });
  console.log('token ',token )

  const getDatabase = async (databaseId) => {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results;
  };
  
  const getPage = async (pageId) => {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  };
  const getBlocks = async (blockId) => {
    const blocks = [];
    let cursor;
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        start_cursor: cursor,
        block_id: blockId,
      });
      blocks.push(...results);
      if (!next_cursor) {
        break;
      }
      cursor = next_cursor;
    }
    return blocks;
  };
  if(pageId && pageblockId){
    const pagedata = await getPage(pageId)
    const pageblock = await getBlocks(pageblockId);
    let child = [];
  for (let i = 0; i < pageblock.length; i++) {
    if (pageblock[i].parent.page_id === pageId && pageblock[i].has_children) {
      child.push(...(await getBlocks(pageblock[i].id)));
    }
  }
    res.status(200).json({ child:child,pageblock:pageblock,pagedata:pagedata})
   }
   
}