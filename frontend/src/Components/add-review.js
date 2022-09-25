import React,{useState}from "react";
import RestaurantDataService from '../services/restaurant.js';
import {Link} from 'react-router-dom';


const AddReview = (props) => {

  let initialReviewState = '';

  let editing = false;

  if(props.location.state && props.location.state.currentReview){
    editing = true;
    initialReviewState = props.location.state.currentReview.text
  }

  const [review,setReview] = useState(initialReviewState);
  const [submitted,setSubmitted] = useState(false);

  const handleInputChange = (event) =>{
    setReview(event.target.value)
  }

  const saveReview = () =>{
    var data = {
      text : review,
      name:props.user.name,
      user_id:props.user.id,
      restaurant_id:props.match.params.id
    };

    if(editing){
      console.log("yay");
      data.review_id = props.location.state.currentReview._id
      RestaurantDataService.updateReview(data)
      .then((res)=>{
        setSubmitted(true);
      })
      .catch(e =>console.log(e))
  }
  else{
    RestaurantDataService.createReview(data)
    .then(res=>{
      console.log("yayy")
      setSubmitted(true)
    })
    .catch(e=>{
      console.log(e)
    })
  }
  }

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          {submitted?(
            <div>
              <h4>You submittted successfully!!</h4>
              <Link to ={"/restaurants?"+ props.match.params.id} className="btn">
                Back to Restaurant
              </Link>
            </div>
          ):(<div>
            <div className="form-group">
              <label htmlFor="description">{editing ? "Edit":"Create"} Review</label>
              <input
              type="text"
              className="form-control"
              id="text"
              required
              value={review}
              onChange={handleInputChange}
              name ="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
            </div>)}
        </div>
      ):(<h4>Please Log in !!</h4>)}
    </div>
  );
}

export default AddReview;