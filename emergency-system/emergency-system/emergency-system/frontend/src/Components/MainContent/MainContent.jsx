import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainContent.css";
import Services from "../Services/Services";
import WhyChooseUs from "../Whywe/Why";
import ImageSlider from "../ImageSlider/ImageSlider";

function MainContent() {

    const navigate = useNavigate();

    const handleBookNow = () => {
        navigate("/booking-options");
    };

    return(
        <>
        <div className="maincontent">
            <div className="left">
                <h1 className="header">
                  Fast, Reliable, and Professional Emergency Services
                </h1>
                <h5 className="para">
                  Our skilled professionals ensure quick, safe, and reliable service at your doorstep.
                </h5>
                <button onClick={handleBookNow}>
                  Book Now
                </button>
            </div>
            <div className="right">
                <ImageSlider/>
            </div>
        </div>

        <Services/>
        <WhyChooseUs/>
        </>
    )
}

export default MainContent;
