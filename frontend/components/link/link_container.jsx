import React from 'react';
import { Link } from 'react-router-dom';


const LinksContainer = () => {
  return(
    <div>
      <p>The links goes here</p>
      <Link to="/businesses">Businesses</Link>
    </div>
  );
};


export default LinksContainer;
