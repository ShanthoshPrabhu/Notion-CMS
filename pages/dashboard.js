import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { collection, getDocs, query, where , doc, setDoc, serverTimestamp, onSnapshot, getDoc, addDoc, orderBy, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "../components/Footer";
import Blogs from "../components/Blogs";
import Loader from "../components/Loader";
import Pages from "../components/Pages";



export default function MyModal() {
//  console.log('data',data)
const {data:session} = useSession();
  const router = useRouter();
  const [user,setUser]=useState([])
  let [isOpen, setIsOpen] = useState(false);
  let [subModalIsOpen, setSubModalIsOpen] = useState(false);
  const [pageName, setPageName] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [pageId, setPageId] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [blogs,setBlogs]=useState([]);
  const [pages,setPages]=useState([]);
  const [loading,setLoading]=useState(false)
  const [docNames,setDocNames]=useState([]);
  const [nameError,setNameError]=useState(false);
  const [urlError,setUrlError]=useState(false);

  // const [docExists]
  
  // console.log('blogs',blogs)
  // console.log('pages',pages)
//   const [user,setUser] = useState([])
// console.log('user',user)
// console.log('sess',session)
async function getUser(){
  const docRef = doc(db, "users", session?.user?.email);
  const docSnap = await getDoc(docRef);
  // console.log('data', docSnap.data())
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return setUser(docSnap.data())
  } 
}
if(session && user.length === 0){
  getUser()
}
console.log('user?.pages.length > 0  && pages.length === 0',user?.pages?.length > 0 && pages.length === 0)
// if(user?.pages.length > 0 )
if(user?.pages?.length > 0 && pages.length === 0){
  getUserPages()
}
if(user?.blogs?.length > 0 && blogs.length === 0){
  getUserBlogs();
}

  async function getNames(){
    const pageRef = collection(db, "pages");
    const value=[]
    getDocs(pageRef).then((snapshot)=>{
      snapshot.docs.forEach((doc)=>{
        value.push({...doc.data()})
      })
    })
    
   }


  async function getUserPages(){
    if(!session) return
    onSnapshot(
      query(
        collection(db, "users",session?.user?.email, "pages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setPages(snapshot.docs)
    )
  }
 
  async function getUserBlogs(){
    if(!session) return
    onSnapshot(
      query(
        collection(db, "users",session?.user?.email, "blogs"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setBlogs(snapshot.docs)
    )
  }
   
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function submodalclose() {
    setSubModalIsOpen(false);
    setIsOpen(true);
  }

  function submodalopen() {
    setSubModalIsOpen(true);
    setIsOpen(false);
  }

  function closeAll() {
    setIsOpen(false);
    setUrlError(false)
    setNameError(false)
    setSubModalIsOpen(false);
  }
 if(loading){
  return <Loader/>
 }


 async function validatePageUrl() {
  setUrlError(false)
    const path = pageUrl.split("/")[3];
    
    if (path?.split("-") && path?.split("-").length > 1) {
      const length = path.split('-').length
      console.log('length',length)
      const Id = path?.split("-")[length -1];
      console.log("pageid", Id);
      if(Id?.length != 32){
        return setUrlError(true)
      }
      console.log(Id?.length == 32);
      const docRef = doc(db, "pages", pageName + '.page');
      const docSnap = await getDoc(docRef);
      // console.log('docSnap',docSnap.data())
      if(docSnap.data()){
        return setNameError(true)
      }
      if(Id?.length == 32 && !docSnap.data() ){
        setNameError(false)
        console.log('succs')
        await setDoc(doc(db, "pages",pageName + '.page'), {
          access_token:user?.access_token,
          owner:user?.email,
          page:pageName + '.page',
          pageId:Id,
          pagename:pageName,
          pageUrl:pageUrl,
          timestamp: serverTimestamp(),
        });
        const pdata = await axios.post(`/api/notion`,
        {
          pageId:Id,
          token:user?.access_token
        });
        if(!pdata){
          return setUrlError(true)
        }
        if(pdata){
          setLoading(true)
          await addDoc(collection(db, "users", session.user.email, "pages"), {
            access_token:user?.access_token,
            owner:user?.email,
            page:pageName + '.page' ,
            pageId:Id,
            pagename:pageName,
            pageUrl:pageUrl,
            timestamp: serverTimestamp(),
          });
          const Ref = doc(db, "users", session?.user?.email)
          const data = {
          pages:arrayUnion(pageName)
          }
        await updateDoc(Ref,data);
          await setDoc(doc(db, "pages",pageName + '.page'), {
            access_token:user?.access_token,
            owner:user?.email,
            page:pageName + '.page',
            pageId:Id,
            pagename:pageName,
            pageUrl:pageUrl,
            timestamp: serverTimestamp(),
          });
          router.push(`/page/${pageName}.page`)
          setUrlError(false)
         
          console.log('sucesssssspage')
        }
      }

    }
    if (path?.split("?")) {
      const Id = path.split("?")[0];
      console.log('blogid',Id);
      console.log('Id?.length',Id?.length)
      if(Id?.length != 32){
        return setUrlError(true)
      }
      const docRef = doc(db, "blogs", pageName + '.blog');
      const docSnap = await getDoc(docRef);
      console.log('docSnap',docSnap.data())
      if(docSnap.data()){
        return setNameError(true)
      }
      if(Id?.length == 32 && !docSnap.data()){
        setNameError(false)
        const data = await axios.post(`/api/notion`,
          {
            databaseId:Id,
            token:user?.access_token
          });
          console.log(data)
          if(!data){
            return setUrlError(true)
          }
       if(data){
        setUrlError(false)
        setLoading(true)
        await addDoc(collection(db, "users", session.user.email, "blogs"), {
          access_token:user?.access_token,
          owner:user?.email,
          blog:pageName + '.blog',
          blogId:Id,
          blogname:pageName,
          blogUrl:pageUrl,
          timestamp: serverTimestamp(),
        });
        const Ref = doc(db, "users", session?.user?.email)
        const data = {
         blogs:arrayUnion(pageName)
        }
        await updateDoc(Ref,data);
        await setDoc(doc(db, "blogs",pageName + '.blog' ), {
          access_token:user?.access_token,
          owner:user?.email,
          blog:pageName + '.blog' ,
          blogId:Id,
          blogname:pageName,
          blogUrl:pageUrl,
          timestamp: serverTimestamp(),
        });
        router.push(`/${pageName}.blog`)
        setUrlError(false)
        
       }
        console.log('sucessssssdb')
      }
     
    }
  }
 
  
  
  const solutions = [
    {
      name: "Blog",
      description: "Create a blog site",
      href: "##",
      icon: IconOne,
    },
    {
      name: "Documentation",
      description: "Create a single page site",
      href: "##",
      icon: IconTwo,
    },
  ];
  return (
    <div className="">
      <div>
        <Navbar/>
      </div>
      <div className=" flex justify-end mr-7 mt-10 md:mr-14">  
        <button
          onClick={openModal}
          className="md:px-4 md:py-2 px-2 py-[6px] text-sm cursor-pointer font-medium text-white bg-black rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Create New site
        </button> 
      </div>
      <div className="bg-[#EDECE9] mx-7 rounded-md">
      <div className=" min-h-40 bg-[#EDECE9] m-5 rounded-lg pb-4">
         <div className=' p-3 '>
            <div className=' text-base flex justify-center font-semibold'>Blogs</div>
            <div className=' flex text-xs space-x-6 md:text-sm mt-3 lg:text-base justify-around'>
          <div className=' space-y-4'>
            <div className=' font-semibold'>Created by</div>
           </div>
          <div className=' space-y-4'>
            <div className=' font-semibold'>Link</div>
          </div>
          </div>
             </div>
         {blogs?.map((blog,index)=>(
          <div key={index} className='my-3'>
            <Blogs data={blog.data()}/>
          </div>
         ))}

      </div>
      <div className=" min-h-40 bg-[#EDECE9] m-5 rounded-lg pb-4">
        
          <div className=" " >
             <div className=' p-3 '>
            <div className=' text-base flex justify-center font-semibold'>Pages</div>
            <div className=' flex text-xs space-x-6 md:text-sm mt-3 lg:text-base justify-around'>
          <div className=' space-y-4'>
            <div className=' font-semibold'>Created by</div>
           </div>
          <div className=' space-y-4'>
            <div className=' font-semibold'>Link</div>
          </div>
          </div>
         </div>
           
          </div>
         {pages?.map((page,index)=>(
          <div className="  my-3" key={index}>
            <Pages data={page.data()}/>
          </div>
         ))}

      </div>
      </div>
      <Footer/>
      <div className="w-4/5 mx-auto 2xl:w-5/6 xl:w-4/6">
          
      <div className="flex items-center justify-center">
         <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      {solutions.map((item,index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg cursor-pointer hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={submodalopen}
                        >
                          <div className="flex items-center justify-center w-10 h-10 text-white shrink-0 sm:h-12 sm:w-12 ">
                            <item.icon aria-hidden="true" />
                          </div>
                          <div className="ml-4 ">
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
         </Transition>
      <Transition appear show={subModalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={submodalclose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="absolute top-[100px] mb-[120px] left-1/2 z-30 min-w-[400px] mt-3 sm:max-w-[600px] justify-center -translate-x-1/2 transform md:max-w-xl sm:px-0 lg:max-w-4xl xl:w-[1200px]">
                  <div className="flex flex-col rounded-lg bg-white lg:w-full mb-[100px] min-h-[80vh] sm:w-full md:w-full xl:w-full lg:p-[100px] p-[30px] sm:p-[40px] overflow-y-auto">
                    <div className="flex flex-col">
                      <span className="flex font-bold lg:text-xl">Step 1</span>
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
                    <div className={`mt-10 ${user.access_token ? 'opacity-30': null}`}>
                      <span className="flex font-bold lg:text-xl">Step 2</span>
                      <span className="flex font-medium lg:ml-[40px] mt-4 lg:text-lg max-w-[600px]">
                        Click the button below in order to select and authorize
                        your notion page. Ignore if you have done it already.
                      </span>
                      <div className="mt-4">
                       <div className=" p-2 bg-black text-white">
                        {user?.access_token ? (
                          // <a href={`https://api.notion.com/v1/oauth/authorize?client_id=d548655f-7faa-40a9-9503-9954997a4a7c&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotion%2Fcallback`}>Go to my notion page</a>
                          <span className=" opacity-95">You have authorized already</span>
                        ) : (
                          <a href={`https://api.notion.com/v1/oauth/authorize?client_id=d548655f-7faa-40a9-9503-9954997a4a7c&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fnotion-cms-jade.vercel.app%2Fauth%2Fnotion%2Fcallback`}>Go to my notion page</a>
                        )}
                       </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-10">
                      <span className="flex font-bold lg:text-xl">
                        Site name
                      </span>
                      <div className="flex mt-2">
                        <input
                          type="text"
                          className=" min-w-[280px] flex-grow lg:w-[500px] max-w-[650px] border-2 border-gray-200 outline-none rounded-md p-2"
                          onChange={e=>setPageName(e.target.value)}
                        />
                      </div>
                      {nameError ? ( <div className=" text-red-500 text-sm">Name already exists, choose another name</div>) : null}
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
                      {urlError ? ( <div className=" text-red-500 text-sm">Check whether you have provided the correct URL of your notion page</div>) : null}
                    </div>
                    <div className="flex justify-center mt-10">
                      <button
                        className="p-2 text-white bg-black rounded-md "
                        onClick={closeAll}
                      >
                        Cancel
                      </button>
                      <button
                        className=" text-white bg-black rounded-md p-2 ml-[30px]"
                        disabled={!user?.access_token || !pageName || !pageUrl}
                        onClick={validatePageUrl}
                      >
                        Create Website
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      </div>
         {/* <div className="mt-1 ">
           <Detailspage/>
         </div> */}
      </div> 

      
    </div>
    
  );
}

function IconOne() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconTwo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  );
}
