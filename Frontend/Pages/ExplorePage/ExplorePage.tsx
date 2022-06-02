import React, {useState,useEffect, useRef} from "react";
import UserNavbar from "../Components/Navbars/UserNavbar";
import Explore from "../Components/Explore/Explore";
import PostProfile from "../Components/ProfileComponent/PostProfile";
import { SELECT_EXPLORER } from "../../postgre/Mutation";
import { useMutation, useApolloClient } from "@apollo/client";
import ReactLoading from "react-loading"

export default function ExplorePage(){

    const [posts,setPosts]=useState({data:[]})
    const [nextpost,setNextPost] = useState("")
    const postsRef = useRef<HTMLDivElement>(null)
    const nextPostTriggerRef = useRef<HTMLDivElement>(null)
    const [isLoading,setIsLoading] = useState(false)
    const [observer,setObserver] = useState<IntersectionObserver>();
    const nextPostKeyRef = useRef(nextpost)
    const apollo = useApolloClient()
    const [hasnext,SetNext] = useState(true);

    const [select, selectResult] = useMutation(SELECT_EXPLORER)


    useEffect(() => {
        nextPostKeyRef.current = nextpost 
    }, [nextpost])

    useEffect(()=>{

        // alert('masukk ')

        setObserver(new IntersectionObserver(
            (entries,observer)=>{
                if(!entries[0].isIntersecting ){
                    return;
                }
                
                observer.unobserve(nextPostTriggerRef.current!);
                setIsLoading(true)
                loadMoreItems()
            },
        ));
    },[])


    async function loadMoreItems() {

        // alert('masuk')   

        const postPagged = await apollo.mutate({
            mutation:SELECT_EXPLORER,
            variables:{
                nextpost: nextPostKeyRef.current! === "" ? null : 
                    nextPostKeyRef.current!
            },
        });

        // console.log(postPagged.data.selectPostExplorer)
        posts.data.push(...postPagged.data!.selectPostExplorer.posts);

        setPosts({data:posts.data})
        console.log(postPagged.data.selectPostExplorer.nextposts)
        setNextPost(postPagged.data.selectPostExplorer.nextposts);
        SetNext(postPagged.data.selectPostExplorer.hasnext)
        setIsLoading(false);
    }

    useEffect(() => {
        // alert('masuk observer')
        if(observer === undefined || isLoading || nextpost == null || hasnext == false){
            return;
        }
        observer!.observe(nextPostTriggerRef.current!);
        
    }, [observer,isLoading,nextpost,hasnext])


    return (
        <div className="explore">
            <UserNavbar></UserNavbar>

            <div className="content">
                
                <div className="bot" ref={postsRef}>
                    {
                        (posts.data.map (p=>{
                            // console.log(p)
                            if(p.post_contents[0].type=="image"){
                                return(
                                    <PostProfile id={p.post_contents[0].post_id}/>
                                )
                            }else{
                                return(
                                    <PostProfile id={p.post_contents[0].post_id}/>
                                )
                            }
                            // return (<img src={p.post_contents[0].path} className="w-8 h-8   " alt="" />)
                        }))
                    }
                </div>
                {
                    isLoading ? <ReactLoading type={"spokes"} color={'white'} height={'10%'} width={'5%'}/> : <div ref={nextPostTriggerRef}>&nbsp;</div>
                }

                    {/* <ReactLoading type={"spokes"} color={'white'} height={'10%'} width={'5%'}/> */}
            </div>
        </div>
    )
}