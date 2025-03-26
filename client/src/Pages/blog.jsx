
import Comment from "../Components/comment.jsx"
import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
export const Blog = () => {
    const [data, setData] = useState([]);

    const getBlogPosts = async () => {
        try {
            const response = await fetch('/api/blogpost');
            const responseData = await response.json();
            setData(responseData);
            console.log(responseData);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        }
    };

    useEffect(() => {
        getBlogPosts();
    }, []);

    return (
        <div id="Page">
            <div>
                <div id="Postlayout">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} id="singlePost">
                                <h3 id="postHeader">{item.header}</h3>
                                <p id="postContent">{item.post}</p>
                            </div>
                        ))
                    ) : null} {}
                    
                </div>
                <NavLink to="/blog/New-post" id="Link">new post</NavLink>
            </div>
        </div>
    );
};