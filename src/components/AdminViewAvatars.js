import React, { useEffect, useState } from 'react';
import AdminNavBar from './AdminNavBar.js';
import AvatarEditor from 'react-avatar-editor';
import "../styles/admin_viewavatars.css";
import axios from 'axios';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

const AdminViewAvatars = () => {
    const [avatarList, setAvatarList] = useState([]);
    const [newAvatar, setNewAvatar] = useState(null);
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);
    
    useEffect(() => {
        fetchAvatarList();
    }, []);

    const fetchAvatarList = async () => {
        try {
            const response = await axios.get(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/getAvatarlist`);
            setAvatarList(response.data.avatarsData);
        } catch (error) {
            console.error('Error fetching user list:', error);
        }
    };

    const handleNewAvatarChange = (event) => {
        const file = event.target.files[0];
        setNewAvatar(file);
    };

    const handleUploadAvatar = async () => {
        try {             
            if (newAvatar == null) return;
            const avatarName = `avatars/${newAvatar.name + v4()}`;
            const imageRef = ref(storage, avatarName);
            uploadBytes(imageRef, newAvatar).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (url) => {
                    const payload = {
                        avatarURL: url,
                        avatarName: avatarName,
                    };
                    const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/uploadAvatar`, payload);
                    console.log(response.data)
                    // Fetch the updated avatar list after the new avatar is uploaded
                    fetchAvatarList();
                    // Reset the newAvatar state to clear the file input
                    setNewAvatar(null);
                });
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    const handleDeleteAvatar = async (avatar) => {
        try{
            const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/deleteAvatar`, avatar);
            console.log(response)
            // Fetch the updated avatar list after the new avatar is uploaded
            fetchAvatarList();
        }catch (error) {
            console.error('Error deleting avatar:', error);
        }
    }

    return (
        <div className="admin-container">
            <div className="admin-navbar">
                <AdminNavBar/>
            </div>
            <div className="admin-viewavatars-div">
                <h2 className='avatarlist_title'>Avatar List</h2>
                <div className='avatarlist'>          
                    {avatarList.map((avatar) => (
                        <div key={avatar.avatarID}>
                            {/* Assuming each avatar has an 'imageURL' property */}
                            <img src={avatar.avatarURL} alt={`Avatar ${avatar.avatarID}`} />
                            <button className="avatar_delete_button"  onClick={() => handleDeleteAvatar(avatar)}>
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <div className='admin-addAvatar'>
                    <h2>Add New Avatar</h2>
                    <input type="file" accept="image/*" onChange={handleNewAvatarChange} />
                {newAvatar && (
                    <div>
                        <AvatarEditor
                            ref={(editorInstance) => setEditor(editorInstance)}
                            image={newAvatar}
                            width={120}
                            height={120}
                            border={5}
                            color={[0, 0, 0, 0.6]} // RGBA color for the editor border
                            scale={scale}
                            onImageChange={() => console.log('Image changed')}
                        />
                        <div>
                            <label>Scale:</label>
                            <input
                                type="range"
                                min="1"
                                max="2"
                                step="0.01"
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                            />
                        </div>
                        <button onClick={handleUploadAvatar}>Upload Avatar</button>
                    </div>
                )}
                </div>
            </div>
        </div>
    )
};

  
export default AdminViewAvatars;