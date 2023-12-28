import React,{useState,useEffect} from "react";
import AdminNavBar from './AdminNavBar.js';
import "../styles/admin_home.css";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch} from '@fortawesome/free-solid-svg-icons'


const AdminHome = () => {
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null); // Track the selected card for update
    const [updateMode, setUpdateMode] = useState(false);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isselectedCard, setIsSelectedCard] = useState(false);  
    const [searchTerm, setSearchTerm] = useState("");  

    useEffect(()=>{
        const fetcaysnc = async () => {
            await fetchAllCards(); // Wait for fetchCollections to complete before calling fetchDataAllCards
        };  
        fetcaysnc(); // Call the async function
    },[])

    const fetchAllCards = async () => {
        try {
          //setSelectedCards([]);
          //setSelectedCard([]);
          const response = await axios.get(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/getAllCards`);
          //console.log(response.data.cardsData)
          setCards(response.data.cardsData);
        } catch (error) {
          console.error('Error searching for card:', error);
        }
    };
 
    const handleCardClick = async (cardID) => {
      if (deleteMode) {
        setSelectedCards((prevSelected) => {
          if (prevSelected.includes(cardID)) {
            return prevSelected.filter((id) => id !== cardID);
          } else {
            return [...prevSelected, cardID];
          }
        });
      } else if(updateMode){
        // Select the card for update
        setSelectedCard(cardID);
        try {
          console.log("card_id", cardID);
          const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/getCardbyId`, cardID); 
          setSelectedCard(response.data.cardData);
          //console.log("response.data", response.data.cardData);
          setIsSelectedCard(true);
          setDescription(response.data.cardData.cardDescription);
          setPrice(response.data.cardData.cardPrice);
          setQuantity(response.data.cardData.cardQuantity);
        } catch (error) {
          console.error('Error searching for card:', error);
        }
      }
    };
  
    const handleDelete = () => {
      setDeleteMode(true);
    };

    const handleDeleteSelected = async () => {
      try {
        console.log(selectedCards)
        // Send a request to your server to delete the selected cards
        const response = await axios.post("https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/deleteSelectedCards",selectedCards);
        console.log(response.data);
        fetchAllCards();
        setDeleteMode(false);
        setUpdateMode(false);
        setIsSelectedCard(false);
        setSelectedCards([]);
        setSelectedCard([]);
      } catch (error) {
        console.error("Error deleting selected cards:", error);
      }
    };

    const handleCancel = () => {
      setDeleteMode(false);
      setUpdateMode(false);
      setIsSelectedCard(false);
      setSelectedCards([]);
      setSelectedCard([]);
    };

    const handleSelectAll = () => {
      setSelectedCards((prevSelected) =>
        prevSelected.length === cards.length ? [] : cards.map((card) => card.cardID)
      );
    };

    const formatDate = (dateString) => {
      const [datePart, timePart] = dateString.split('T');
      const [day, month, year] = datePart.split('.');
      const [hour, minute, second] = timePart.split(':');
    
      return `${month}.${day}.${year} at ${hour}:${minute}:${second}`;
    };

    const handleUpdate = () => {
      setUpdateMode(true);
      setDeleteMode(false);
    };

    const handleAllCards = () => {
      setUpdateMode(false);
      setDeleteMode(false);
      setIsSelectedCard(false);
      fetchAllCards();
    };


    const handleUpdateSelected = async (card) => {
      try {
        const payload = {
          cardID: card.cardID,
          cardDescription: description,
          cardPrice: price,
          cardQuantity: quantity,
      };

        const response = await axios.post(`https://27igjfcj05.execute-api.us-east-1.amazonaws.com/adminStage/updateCard`, payload);
        //console.log(response.data);
        fetchAllCards();
        setSelectedCards([]);
        setSelectedCard([]);
        setIsSelectedCard(false);
      } catch (error) {
        console.error("Error updating card:", error);
      }
    };
  

    const handleDecrement = () => {
      if (quantity > 1) {
        setQuantity(prevQuantity => prevQuantity - 1);
      }
    }; 
    const handleIncrement = () => {
      if (quantity >= 0) {
          setQuantity(prevQuantity => prevQuantity + 1);
      }
    };

    // Filter the admin list based on the search term
    const filteredCards = cards.filter(user =>
      Object.values(user).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const cardsByCollection = filteredCards.reduce((acc, card) => {
      if (!acc[card.collectionName]) {
        acc[card.collectionName] = [];
      }
      acc[card.collectionName].push(card);
      return acc;
    }, {});

    const renderedCollections = Object.keys(cardsByCollection).map(collectionName => (
      <div key={collectionName} className="scrollable-cards-container-admin">
        <h2 className='collectionNameHeader'>{collectionName}</h2>
        <div className="rendered_card_container">
          {cardsByCollection[collectionName].map((card) => (
           <div className={`admin_Cards_home ${selectedCards.includes(card.cardID) ? "selected" : ""}`}key={card.cardID} onClick={() => handleCardClick(card.cardID)}>
              
              <div className="card__content">
                      {deleteMode && (
                        <input type="checkbox" checked={selectedCards.includes(card.cardID)} onChange={(e) => e.stopPropagation()} />
                      )}
                      <div className="card__content_left">
                        <img src={card.cardURL} alt=""/>
                      </div>
                      
                      <div className="card__content_right">
                        <h2 className="card__title">{card.cardTitle}</h2>
                        <h4 className="card__collectionName">
                          {card.cardCollectionName}
                        </h4>
                        <h4 className="card__price">Price: ${card.cardPrice}</h4>
                        <h4 className="card__rarity">Rarity: {card.cardRarity}</h4>
                        <h4 className="card__quantity">Quantity: {card.cardQuantity}</h4>
                      </div>
              </div>

              <div className="card__body">
                <p className="card__description">{card.cardDescription}</p>
                <h3 className="card__date">{formatDate(card.cardDate)}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));


    return (
      <div className="admin-container">
      <div className="admin-navbar">
        <AdminNavBar />
      </div>
  
      <div className="wrapper_admin">
        <div className="bulk-actions">
          {deleteMode || updateMode ? (
            <div>
              {deleteMode ? (
                <>
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectedCards.length === cards.length}
                    onChange={handleSelectAll}
                    style={{ opacity: 0 }}
                  />
  
                  <label htmlFor="selectAll">Select All</label>
                  <button onClick={handleDeleteSelected}>Delete Selected</button>
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <>
                  {isselectedCard ? (
                    <button
                      type="button"
                      className="updateSelected_button"
                      onClick={() => handleUpdateSelected(selectedCard)}
                    >
                      Update Card
                    </button>
                  ) : null}
                  <button onClick={handleCancel}>Cancel</button>
                  
                </>
              )}
            </div>
          ) : (
            <div className="header_buttons">
              <button className="delete_before" onClick={handleDelete}>
                Delete
              </button>
              <button className="update_button" onClick={handleUpdate}>
                Update
              </button>
              {searchTerm ? (
                    <button type="button" className="allCards_button" onClick={() => handleAllCards()}>All Cards </button>) : null}
                <input type="text" placeholder=" Search..." className='mycollections_search_button' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                <FontAwesomeIcon icon={faSearch} className="icon"/>

            </div>

          )}
        </div>
        
        {searchTerm && renderedCollections.length > 0 ?  (
          renderedCollections
        ):(
          <>
          {!isselectedCard ? (
            <div className="scrollable-cards-container-admin">
              {cards &&
                cards.map((card) => (
                  <div className={`admin_Cards_home ${selectedCards.includes(card.cardID) ? "selected" : ""}`}key={card.cardID} onClick={() => handleCardClick(card.cardID)}>
                    <div className="card__content">
                      {deleteMode && (
                        <input type="checkbox" checked={selectedCards.includes(card.cardID)} onChange={(e) => e.stopPropagation()} />
                      )}
                      <div className="card__content_left">
                        <img src={card.cardURL} alt=""/>
                      </div>
                      
                      <div className="card__content_right">
                        <h2 className="card__title">{card.cardTitle}</h2>
                        <h4 className="card__collectionName">
                          {card.cardCollectionName}
                        </h4>
                        <h4 className="card__price">Price: ${card.cardPrice}</h4>
                        <h4 className="card__rarity">Rarity: {card.cardRarity}</h4>
                        <h4 className="card__quantity">Quantity: {card.cardQuantity}</h4>
                      </div>
                    </div>

                    <div className="card__body">
                      <p className="card__description">{card.cardDescription}</p>
                      <h3 className="card__date">{formatDate(card.cardDate)}</h3>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="update-form">
              <div className="update-left-part">
                <h2 className="update_card_title">{selectedCard.cardTitle}: {selectedCard.cardCollectionName}</h2>
                <img src={selectedCard.cardURL} alt="" className="update_card_image" />
                <div className="update_card_details">
                  
                  <h4 className="card__price">Price: ${selectedCard.cardPrice}</h4>
                  <h4 className="card__rarity">Rarity: {selectedCard.cardRarity}</h4>
                  <h4 className="card__quantity">Quantity: {selectedCard.cardQuantity}</h4> 
                  <h4 className="card__date">Date: {formatDate(selectedCard.cardDate)}</h4>
                </div>
              </div>

              <div className="update-form-fields">
                <h2 className="update_form_h2">Update Form</h2>
                <h3 style={{ color: "black" }}>Description</h3>
                <textarea
                  rows="7"
                  className="form-control"
                  placeholder="Please Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
    
                <h3 style={{ color: "black" }}>Price</h3>
                <label htmlFor="price" className="form-label"></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Please Enter price"
                  pattern="\d*"  // Regular expression to allow only numeric digits
                  min={0}
                  value={price}
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
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    required
                    />
                    <button type="quantity_button" onClick={handleDecrement}>-</button>
                    <button type="quantity_button" onClick={handleIncrement}>+</button>
                </div>
                

              </div>
            </div>
        )}
        </>
        )}         
      </div>
    </div>
    );    
}; 
  
export default AdminHome;