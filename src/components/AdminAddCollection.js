import React,{useState,useEffect} from "react";
import AdminNavBar from './AdminNavBar.js';
import "../styles/admin_addCollection.css";
import axios from 'axios';

const AdminAddCollection = () => {
    /* collection */
    const [collectionName, setCollectionName] = useState("");
    const [collectionNames, setCollectionNames] = useState([]);

    useEffect(() => {
      fetchData(); // Call the async function
  }, []);
  


  const fetchData = async () => {
        setCollectionName('');
        try {
            const response = await axios.get(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/getCollectionNames`);
            console.log(response.data.collectionsData);
            setCollectionNames(response.data.collectionsData);      
        } catch (error) {
            console.error('Error fetching collection names:', error);
        }
    };


    const insertCollection = async (collection) =>{
        try {
          const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/addCollection`, collectionName);
          //window.location.reload();
          fetchData();
          setCollectionName("");
        } catch (error) {
          console.error("Error inserting collection:", error);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-navbar">
                <AdminNavBar/>
            </div>
            <div className="admin-collectionpage-div">
                
              <div className="form_container_collection">
                 
                {collectionNames ? (<div className="collection-names-container">
                    <h2>Collection Names:</h2>
                    <ul>
                        {collectionNames.map((item, index) => (
                            <li key={index}>{index+1}.  {typeof item === 'object' ? item.collectionName : item}</li>
                        ))}
                    </ul>
                </div>):(null)}
                
                
                <div className='form'>
                    <label htmlFor = "collectionName" className='form-label'>Title</label>
                    <input type="text" className="form-control" 
                    placeholder ="Please Enter Name for Collection"
                    value={collectionName}
                    onChange={(e)=>setCollectionName(e.target.value)}
                    required
                    />

                    <div className='addcard-div'>
                        <button  onClick={insertCollection} className="btn btn-success mt-3">Add Collection</button>
                    </div>
                </div>
              </div>

            </div>
        </div>
    )
};

  
export default AdminAddCollection;