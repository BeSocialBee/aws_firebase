import React, { useEffect, useState } from 'react';
import AdminNavBar from './AdminNavBar.js';
import "../styles/admin_viewusers.css";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch} from '@fortawesome/free-solid-svg-icons'

const AdminViewUsers = () => {
    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await axios.get('https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/getuserlist');
                // Check if response.data is an object
                if (response.data && typeof response.data === 'object') {
                    // Assuming the response is an object with a "users" property
                    const usersData = response.data.users;

                    // Check if usersData is defined
                    if (usersData) {
                        // Now you can use usersData in your React component
                        console.log(usersData);
                        setUserList(usersData);
                    } else {
                        console.error('Error: "users" property is undefined in the response body.');
                    }
                } else {
                    console.error('Error: Response body is not a valid object.');
                }
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        };

        fetchUserList();
    }, []);


    const makeAdminHandler = async (user_id) => {
        try{
            const formData = new FormData();
            formData.append('user_id', user_id);
            const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/makeAdmin`, formData);
            console.log(response)
            window.location.reload();
        }catch (error) {
            console.error('Error making admin:', error);
        }
    }     

    const deleteUserHandler = async (user_id) => {
        try{
            const formData = new FormData();
            formData.append('user_id', user_id);
            const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/deleteUser`, formData);
            console.log(response)
            window.location.reload();
        }catch (error) {
            console.error('Error making admin:', error);
        }
    }  

    // Filter the user list based on the search term
    const filteredUserList = userList.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="admin-container">
            <div className="admin-navbar">
                <AdminNavBar/>
            </div>
            <div className="admin-viewusers-div">
            <div className="user_search_button_div">
                <input
                    className="user_search_button"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FontAwesomeIcon icon={faSearch} className="icon"/>
            </div>
            
            <table>
                <thead>
                    <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Date</th>
                    <th>Avatar ID</th>
                    <th>Balance</th>
                    <th>Score</th>
                    <th>Showcase Card</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUserList.map((user) => (
                    <tr className="table_row" key={user.userID}>
                        <td>{user.userID}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>{user.date}</td>
                        <td>{user.avatar_id}</td>
                        <td>{user.balance}</td>
                        <td>{user.score}</td>
                        <td>{user.showcase_card}</td>
                        <td>
                        <div className="table_row_buttons">
                            <button
                            className="table_row_button"
                            onClick={() => makeAdminHandler(user.user_id)}
                            >
                            Make Admin
                            </button>
                            <button
                            className="table_row_button"
                            onClick={() => deleteUserHandler(user.user_id)}
                            >
                            Delete User
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

  
export default AdminViewUsers;