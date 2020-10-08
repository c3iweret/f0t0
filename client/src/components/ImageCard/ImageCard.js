import React from "react";
import "./ImageCard.css";
import { Button } from "react-bootstrap";

const ImageCard = (props) => {
  return (
    <div className="imgCard">
      <div>
        <img src={props.src} alt={props.caption} data-testid="image" />
      </div>
      <div className="caption">
        <p data-testid="caption">{props.caption}</p>
      </div>
      {props.tags.length > 0 && (
        <div data-testid="tagContainer">
          {props.tags.map((tag, index) => (
            <Button
              className="tagBtn"
              variant="secondary"
              key={index}
              onClick={() => props.tagImage(tag)}
              data-testid={"tag" + index}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
      <div className="img-footer">
        {props.ownerID === props.userID && (
          <div>
            <button
              type="button"
              className="btn btn-danger delete"
              onClick={() => props.delete(props.photoID)}
              data-testid="deleteBtn"
            >
              Delete
            </button>
          </div>
        )}
        <div className="shared-container">
          <p data-testid="shared" className="shared-text">
            shared by
          </p>
          <button className="imgcardBtn" onClick={props.userImage}>
            <p data-testid="ownerName">{props.ownerName}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
