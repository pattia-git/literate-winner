import React, { useState, useContext, useEffect } from "react";



export const NewBlogPost = () => {
    
    const [header, setheader] = useState('');
    const [content, setcontent] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/newBlogPost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ Header: header,
                Post: content})
        });
    }
    
    
    return(
        <div id="Page">
            <h2>NewBlogPost</h2>
            <div>
                <div id="newPostLayout">
                    <form>
                        <p>Header</p>
                        <input
                            value={header}
                            onChange={(e) => setheader(e.target.value)}
                            type="Text"
                        />
                        <p>Content</p>
                        <textarea
                            id="contentField"
                            value={content}
                            onChange={(e) => setcontent(e.target.value)}
                        />
                    </form>
                    <button id="newPostBtn" onClick={handleSubmit}>Post this</button>
                </div>
            </div>

        </div>
    )
};
