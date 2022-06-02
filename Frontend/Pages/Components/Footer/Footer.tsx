import React from "react"
import { Link } from "react-router-dom"

export default function Footer (){
    return (
        <div className="footer">
                <div className="up-footer">
                    <div>
                        <a href="https://about.instagram.com/" target="_blank">
                            About
                        </a>
                    </div>
                    <div>
                        <a href="https://about.instagram.com/en_US/blog" target="_blank">
                            Blog
                        </a>
                    </div>
                    <div>
                        <a href="https://about.instagram.com/about-us/careers" target="_blank">
                            Jobs
                        </a>
                    </div>
                    <div>
                        <a href="https://help.instagram.com/" target="_blank">
                            Help
                        </a>
                    </div>
                    <div>
                        <a href="https://developers.facebook.com/docs/instagram" target="_blank">
                            API
                        </a>
                    </div>
                    <div>
                        <a href="https://help.instagram.com/519522125107875" target="_blank">
                            Privacy
                        </a>
                    </div>
                    <div>
                        <a href="https://help.instagram.com/581066165581870">
                            Terms
                        </a>
                    </div>
                    <div>
                        <a href="https://www.instagram.com/directory/profiles/">
                            Top Accounts
                        </a>
                    </div>
                    <div>
                        <a href="https://www.instagram.com/directory/hashtags/">
                            Hashtags
                        </a>
                    </div>
                    <div>
                        <a href="https://www.instagram.com/explore/locations/">
                            Locations
                        </a>
                    </div>
                </div>  

                <div className="bot-footer">
                    <div>
                        <select name="" id="">
                        <option value="volvo">English</option>
                        <option value="saab">Indonesia</option>
                        <option value="mercedes">Brazil</option>
                        <option value="audi">Portuguese</option>
                        </select>
                    </div>
                    <div className="text">
                        &copy; 2012 InSOgram
                    </div>
                </div>
            </div>
    )
}