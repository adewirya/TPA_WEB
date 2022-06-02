import React, {useState, useEffect} from "react";
import UserNavbar from "../Components/Navbars/UserNavbar";

export default function EditAccount(){

    const [fullName, setFullName] = useState("")
    const [userName, setUserName] = useState("")
    const [bio, setBio] = useState("")
    const [email, setEmail] = useState("")

    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confPass, setConfPass] = useState("")


    return (
        <div className="edit-profiles"> 
            <UserNavbar></UserNavbar>

            <div className="form">  
                
                <div className="title">
                    Change Credentials
                </div>

                <div className="profile-picture">
                    <img src="/profile.png" className="w-8 h-8  " alt="" />
                    <div>
                        nikosidharta
                        <a href="#">Change Profile Photo</a>
                    </div>
                </div>

                <div className="input">
                    <div>
                        Full Name
                    </div>
                    <input type="text" onChange ={(e)=> setFullName(e.target.value)} />
                </div>

                <div className="input">
                    <div>
                        Username
                    </div>
                    <input type="text" onChange ={(e)=> setUserName(e.target.value)} />
                </div>

                <div className="input">
                    <div>
                        Bio
                    </div>
                    <textarea name="" id="" cols={31.5} rows={10} onChange ={(e)=> setBio(e.target.value)} ></textarea>
                </div >

                <div className="input">
                    <div>
                        Email
                    </div>
                    <input type="email" name="" id=""onChange ={(e)=> setEmail(e.target.value)}  />
                </div>

                <div className="btn-container">
                    <button>
                        Submit
                    </button>
                </div>
            </div>

            <div className="form-password">
                <div className="title" >
                    Change Password
                </div>

                <div className="input">
                    <div>
                        Old Password
                    </div> 
                    <input type="password" name="" id="" onChange ={(e)=> setOldPass(e.target.value)} />
                </div>

                <div className="input">
                    <div>
                        New Password
                    </div> 
                    <input type="password" name="" id="" onChange ={(e)=> setNewPass(e.target.value)}/>
                </div>

                <div className="input">
                   <div>
                        Confirm Password
                    </div>
                    <input type="password" name="" id=""onChange ={(e)=> setConfPass(e.target.value)} />
                </div>

                <div className="btn-container">
                    <button>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}