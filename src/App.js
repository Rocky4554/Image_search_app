import React, { useRef, useEffect, useState, useCallback } from "react";
import "./index.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = process.env.REACT_APP_API_KEY;
const Images_per_page = 20;
// const apiKey = "noWAbyCuSXQBMGOcoD7Xgf8TOXezqOQogbiijiKOkWc";

function App() {
  // console.log("API key:", apiKey);
  // console.log("key", API_KEY);
  const searchInput = useRef();
  const [images, setimages] = useState([]);
  const [totalpages, settotalpages] = useState(0);
  const [page, setpage] = useState(1);
  const [errormsg,seterrormsg]=useState(false);

  const fetchresult = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        seterrormsg(false)
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${Images_per_page}&client_id=${API_KEY}`
        );
        console.log(data);
        setimages(data.results);
        settotalpages(data.total_pages);
      }
    } catch (error) {
      console.log("Error Occured");
      seterrormsg(true);
    }
  }, [page]);

  useEffect(() => {
    fetchresult();
  }, [fetchresult, page]);

  const handlesearch = (event) => {
    event.preventDefault();
    console.log(searchInput);
    fetchresult();
    setpage(1);
  };

  const handleonClick = (selection) => {
    searchInput.current.value = selection;
    fetchresult();
    setpage(1);
  };

  return (
    <div className="container" onSubmit={handlesearch}>
      <h1 className="title">Image Search Text</h1>
      <div className="search-section">
        <Form>
          <Form.Control
            className="search-input"
            type="search"
            placeholder="search"
            ref={searchInput}
          ></Form.Control>
        </Form>
      </div>
      
      
      {errormsg && <p className="error-msg">Error occured! Please check the link</p>}
      

      <div className="filters">
        <Button variant="primary" onClick={() => handleonClick("bird")}>
          Birds
        </Button>{" "}
        <Button variant="primary" onClick={() => handleonClick("animal")}>
          Animals
        </Button>{" "}
        <Button variant="primary" onClick={() => handleonClick("plant")}>
          Plants
        </Button>{" "}
        <Button variant="primary" onClick={() => handleonClick("nature")}>
          Nature
        </Button>
      </div>

      <div className='images'>
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className='image'
          />
        ))}
      </div>

      <div className="buttons">
        {page > 1 && (
          <Button onClick={() => setpage(page - 1)}>Previous</Button>
        )}
        {page < totalpages && (
          <Button onClick={() => setpage(page + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}

export default App;
