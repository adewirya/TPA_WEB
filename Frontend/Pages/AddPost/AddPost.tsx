import React, {useState, useContext, useEffect} from "react";
import UserNavbar from "../Components/Navbars/UserNavbar";
import { FirebaseAppContext } from "../../App";
import { useHistory } from "react-router";
import { ADD_POST } from "../../postgre/Mutation";
import { useMutation } from "@apollo/client";
import { ReadFiles } from "../../Code/ReadFile";
import { v4 as uuidv4 } from "uuid";
import ReactLoading from "react-loading"
import Popup from "react-animated-popup";

export default function AddPost(){
    const [path, setPath] = useState("")
    const [carousel, setCarousel] = useState(false)
    const [inputted, setInputted ] = useState(false)

    var [imageIdx, setImageIdx] = useState(0)
    const [progress, setProgress] = useState(0)

    const [uploaded, setUpload] = useState({datas: []})

    const firebase = useContext(FirebaseAppContext)

    const [caption, setCaption] = useState("")

    const [post, postResult] = useMutation(ADD_POST)

    const [errorLbl, setErrorLbl] = useState("")

    const history = useHistory()

    const [visible, setVisible] = useState(false)

    const [isChecked , setChecked] = useState(false)

    function togglePopup(){
        setVisible(!visible)
    }


    function toggleInputted(){
        setInputted(!inputted)
    }

    function toggleCarousel(){
        setCarousel(!carousel)
    }

    async function handleUpload(files : FileList){
        console.log('masuk')
        setInputted(true)

        setProgress(0)

        const fileTypes = Array.from(files).map(file => file.type.split("/")[0])
        if (fileTypes.some(fileType => fileType !== "image" && fileType !== "video")) {
            return
        }

        const posts = await ReadFiles(files)
        setProgress(33)

        const refs = posts.map(fd => firebase.storage().ref(uuidv4()));
        const uploadPromises = posts.map((fd, index) => refs[index].putString(fd, "data_url"));
        await Promise.all(uploadPromises)

        setProgress(66)

        const urlPromises = refs.map(ref => ref.getDownloadURL());
        const urls = (await Promise.all(urlPromises)) as string[];
        setProgress(100);

        setUpload({
            datas: urls.map((path, index) => {
                return {
                    id: uuidv4(),
                    previewType: fileTypes[index],
                    preview: path,
                };
            }),
        });

    }

    async function handleSubmit() {
        if (progress < 100) {   
            setErrorLbl("Upload progress isn't done")
            return
        }
        else if (caption === "") {
            setErrorLbl("Caption must be filled")
            return
        }

        const input = {
            username: localStorage.getItem("username"),
            caption: caption,
            contents: uploaded.datas.map(data => {
                return {
                    path: data.preview,
                    type: data.previewType,
                }
            })
        }

        post({
            variables: {
                input: input
            }
        })



        history.push("/profile")
        setProgress(0)
        setCaption("")
        // setVisible(true)

    }

    useEffect(() => {
        if(postResult.data != undefined){
            setVisible(true)

            if (isChecked){
                window.open(`http://www.twitter.com/share?url=${location.host}/postdetails/${postResult.data.addNewPost.id}`, "_blank");
            }
        }

    }, [postResult.data]);

    const AddButton = ()=>  <button onClick={handleSubmit}>
    Add Post
</button>

    const LoadingButton = ()=> 
<button >
     <ReactLoading type={"spokes"} color={'white'} height={'50%'} width={'5%'}/>
</button>

    
    function addIdx(){
        if(uploaded.datas.length == imageIdx){
            return
        }else{
            setImageIdx(imageIdx++)
        }
    }

    function minIdx(){
        if(imageIdx==0){
            return
        }else{
            setImageIdx(--imageIdx)
        }
    }


    const ChevronLeft = () =>                 <div className="chevron-left" onClick={minIdx}>
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
</div>

    const ChevronRight = () =>                 <div className="chevron-right" onClick={addIdx}>
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
</div>

    const Inputted = () =>  
    <div className="inputFile" onDragOver={e => e.preventDefault()} onDrop={e => { handleUpload(e.dataTransfer.files); e.preventDefault() }}>
        <label htmlFor="file">
            <img src="./profile.png" alt="" />
        </label>
        {
            (uploaded.datas.length > 1) ?<ChevronLeft/> : <div></div>
        }
        {
            (uploaded.datas.length > 1) ? <ChevronRight/> : <div></div>
        }
    </div>


    const Uninputted = () =>  <div className="inputFile"  onDragOver={e => e.preventDefault()} onDrop={e => { handleUpload(e.dataTransfer.files); e.preventDefault() }}>
    <label htmlFor="file">
        <svg fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
    </label>
</div>

    const Prog1 = ()=><div className="progress-bar-1">
    <hr />
</div>


    const Prog2 = ()=><div className="progress-bar-2">
    <hr />
    </div>


    const Prog3 = ()=><div className="progress-bar-3">
    <hr />
    </div>


    useEffect(() => {

        if (progress == 100){
            togglePopup()
        }

    }, [progress]);
        

    return (
        <div className="new-post-form">
            <UserNavbar></UserNavbar>
            <div className="form">

                <div className="title">
                    Add new Post
                </div>
                

                <div className="input-container">
                    {
                        (inputted) ? uploaded.datas.map((data,idx)=>{

                            return(
                            <div className="inputFile"onDragOver={e => e.preventDefault()} onDrop={e => { handleUpload(e.dataTransfer.files); e.preventDefault() }}>   
                                <label htmlFor="file">

                                    {
                                        (idx == imageIdx && data.previewType == "image") ?  
                                        <img src={data.preview} className ="show" alt="" /> : 
                                        <img src={data.preview} className="hidden" alt="" />
                                    }

                                    {
                                        (idx == imageIdx && data.previewType == "video") ? 
                                        <video src={data.preview} className="show" controls preload="auto"></video> : 
                                        <video src={data.preview} className="hidden" controls preload="auto"></video>
                                    }

                                </label>

                                {
                                            (uploaded.datas.length > 1 && imageIdx != 0) ?
                                            <ChevronLeft></ChevronLeft> :
                                            null
                                }

                                {
                                            (uploaded.datas.length > 1 && imageIdx != uploaded.datas.length-1) ?
                                            <ChevronRight></ChevronRight> :
                                            null
                                }
                            </div>
                            )
                        }) : <Uninputted/>
                    }
                </div>

                <Popup visible={visible} onClose={togglePopup}>
                                <div className="popup-progress">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke="lightgreen">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3>
                                        Uploaded Succesfully
                                    </h3>
                                    <div className="btn-container">
                                        <button onClick={togglePopup} className="button">
                                            OK
                                        </button>
                                    </div>
                                </div>
                        </Popup>

                <div className="input-file">
                    <input type="file" name="file" id="file" accept="image/* , video/*" multiple={true} onChange={(e) => handleUpload(e.currentTarget.files!)}  />
                </div>

                {
                    (progress == 33 ) ? <Prog1/> : <div></div>
                }

                {
                    (progress == 66 ) ? <Prog2/> : <div></div>
                }

                {
                    (progress == 100) ? <Prog3/> : <div></div>
                }
            

                <div className="input">
                    Caption 
                    <textarea name="" placeholder="Caption" id="" cols={65} rows={10} onChange={(e) => setCaption(e.target.value)}></textarea>
                </div>
 
                <div id="errorLbl" style={{color : 'red'}}>
                    {errorLbl}
                </div>

                <div className="btn">
                    Share to social media
                    <input type="checkbox" name="chkbox" id="chkbox" checked={isChecked} onChange= {(e)=> setChecked(e.currentTarget.checked)}/>
                </div>

                <div className="btn-container">
                    {
                        (postResult.loading) ? <LoadingButton/> : <AddButton/>
                    }
                </div>

            </div>
        </div>
    )
}