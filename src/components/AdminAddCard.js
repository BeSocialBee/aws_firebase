import React,{useState,useEffect} from "react";
import AdminNavBar from './AdminNavBar.js';
import axios from 'axios';
import "../styles/admin_addcard.css";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { createCanvas, loadImage } from "canvas";

const AdminAddCard = () => {

    /* collection */
    const [collections, setCollections] = useState([]);

    /* card infos */
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(""); 
    const [price, setPrice] = useState(1);
    const [previewUrl, setPreviewUrl] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [rarity, setRarity] = useState("");

    useEffect(()=>{
        const fetcaysnc = async () => {
            await fetchCollections();
            };  
        fetcaysnc(); // Call the async function
    },[])

    const fetchCollections = async () => {
        setCollectionName('');
        try {
            const response = await axios.get(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/getCollectionNames`);
            //console.log(response.data.collectionsData);
            setCollections(response.data.collectionsData);      
        } catch (error) {
            console.error('Error fetching collection names:', error);
        }
    };
    
    const insertCard = async (card) =>{
        try {   
            if (image == null ||title === "" ||description === "" ||price<0 ||collectionName === "" ||quantity <1 ||rarity === "") return;          
            const imageName = `cards/${image.name + v4()}`;
            const imageRef = ref(storage, imageName);
            uploadBytes(imageRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (url) => {        
                    const payload = {
                        cardURL: url,
                        cardImageName: imageName,
                        cardTitle: title,
                        cardDescription: description,
                        cardPrice: price,
                        cardCollectionName: collectionName,
                        cardQuantity: quantity,
                        cardRarity: rarity,                        
                    };
                    console.log(payload)
                    const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/addCard`, payload);
                    console.log(response.data)
                    // Clear the form fields after inserting the card
                    setTitle("");
                    setDescription("");
                    setPrice("");
                    setImage(null);
                    setPreviewUrl(""); 
                    setCollectionName("");
                    setQuantity(1);
                    setRarity("");
                });
            });
        }catch (error) {
            console.error("Error inserting card:", error);
        }
    };

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        // Resize the image to 500x500 pixels using canvas
        const resizedImage = await resizeImage(selectedFile, 500, 500);

        setImage(resizedImage);
        setPreviewUrl(URL.createObjectURL(resizedImage));
    };

    const resizeImage = async (file, maxWidth, maxHeight) => {
        return new Promise(async (resolve) => {
          const image = await loadImage(URL.createObjectURL(file));
          const canvas = createCanvas(maxWidth, maxHeight);
          const ctx = canvas.getContext("2d");
    
          // Ensure the image is drawn within the canvas dimensions
          ctx.drawImage(image, 0, 0, maxWidth, maxHeight);
    
          // Convert the canvas to a Blob
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
    
            resolve(resizedFile);
          }, file.type);
        });
      };

    const handleIncrement = () => {
        if (quantity >= 0) {
            setQuantity(prevQuantity => prevQuantity + 1);
        }
      };
    
      const handleDecrement = () => {
        if (quantity > 1) {
          setQuantity(prevQuantity => prevQuantity - 1);
        }
      };    

    return (
    <div className="admin-container">

        <div className="admin-navbar">
            <AdminNavBar/>
        </div>
        
        <div className="admin-addcard-div">
            <div className="form_container">
            <div className='form'>
                {/* Close button with a cross sign */}
                <label htmlFor="image" className='form-label'>Image</label>
                <input
                type="file"
                className="form-control"
                placeholder="Choose a file"
                width={150}
                height={150}
                border={50}
                onChange={(e) => { handleImageChange(e); }}
                required
                accept="image/*"
                />

                <label htmlFor="collectionName" className='form-label'>Collection Name</label>
                <select
                className="form-coll-select"
                id="selectedCollection"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                >
                <option value="" disabled> Select a collection </option>
                {collections.map((collection) => ( 
                    <option key={collection.collectionID} value={collection.collectionName}>
                    {collection.collectionName}
                    </option>
                ))}
                </select>

                <label htmlFor="title" className='form-label'>Title</label>
                <input
                type="text"
                className="form-control"
                placeholder="Please Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />

                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                rows="2"
                className="form-control"
                placeholder="Please Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />

                <label htmlFor="price" className='form-label'>Price</label>
                <input
                type="number"
                className="form-control"
                placeholder="Please Enter price"
                value={price}
                min={0}
                pattern="\d*"  // Regular expression to allow only numeric digits
                onChange={(e) => setPrice(e.target.value)}
                required
                />

                <label htmlFor="quantity" className='form-label'>Quantity</label>
                <div className="quantity-input">
                    <input
                    type="number"
                    className="form-control"
                    placeholder="Please Enter Quantity"
                    value={quantity}
                    min={0}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    required
                    />
                    <button type="quantity_button" onClick={handleDecrement}>-</button>
                    <button type="quantity_button" onClick={handleIncrement}>+</button>
                </div>
                
                <label htmlFor="rarity" className='form-label'>Rarity</label>
                <select
                className="form-coll-select"
                id="selectedRarity"
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                >
                <option value="" disabled> Rarity </option>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="legendary">Legendary</option>
                </select>

                <div className='addcard-div'>
                <button onClick={insertCard} className="admin-addcard-button">Add Card</button>
                </div>

            </div>

            <div className='show-prewiewUrl'>
                {previewUrl === "" || previewUrl === null ? "" : (
                <img
                    src={previewUrl}
                    alt=''
                    className="card_show"
                    
                />
                )}
            </div>
            </div>
        </div>
    </div>
    );
};
  
export default AdminAddCard;