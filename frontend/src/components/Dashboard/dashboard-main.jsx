import React, { useEffect, useState } from 'react';
import "../Css/Main.css";
import Slider from "./slider";
import Sidebar from "./sidebar";
import axios from 'axios';

import heightimg from './assests/height-bar.png';
import attentionIcon from "./assests/attention-icon.png";
import memoryIcon from "./assests/memory-icon 3.png";
import languageIcon from "./assests/language-icon.png";
import reasoningIcon from "./assests/reasoning-icon.png";
import problemSolvingIcon from "./assests/prob-solving-icon.png";
import reflexIcon from "./assests/reaction-icon.png";

import bad from "./assests/attention-down.png";
import memfooter from "./assests/memory-down.png";
import avg from "./assests/language-down.png";
import resfooter from "./assests/reasoning-down.png";
import psfooter from "./assests/ps-down.png";
import good from "./assests/reaction-down.png";


const categoryNames = ['Attention', 'Memory', 'Language', 'Reasoning', 'Problem-Solving', 'Reflex'];

function DashboardMain() {
  const d = new Date();
  let year = d.getFullYear();
  let date = d.getDate();
  let month = d.getMonth();
  const datename = new Date(year, month, date); // 2009-11-10
  const total =
    datename.toLocaleString("default", { month: "long" }) +
    String(" " + date + " ") +
    year;
  const [averages, setAverages] = useState({}); // State to hold averages
  const [height, setHeight] = useState(0); // Initial height
  const [weight, setWeight] = useState(0); // Initial weight
  const [bmi, setBMI] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem("email");
      try {
        const response = await axios.get(`https://final-ps-backend.vercel.app/activityset/${email}`);
        console.log('Response:', response.data); // Log the response to inspect its structure

        // Assuming response.data is an array of objects containing scores
        const scoresArray = Object.values(response.data.scores);

        // Aggregate scores for each key
        const aggregatedScores = {};
        scoresArray.forEach(scoresObj => {
          for (const key in scoresObj) {
            if (scoresObj.hasOwnProperty(key)) {
              if (!aggregatedScores[key]) {
                aggregatedScores[key] = [];
              }
              aggregatedScores[key] = aggregatedScores[key].concat(scoresObj[key]);
            }
          }
        });

        // Calculate averages for each key
        const calculatedAverages = {};
        for (const key in aggregatedScores) {
          if (aggregatedScores.hasOwnProperty(key)) {
            const sum = aggregatedScores[key].reduce((acc, val) => acc + (val || 0), 0);
            calculatedAverages[key] = sum / aggregatedScores[key].length;
          }
        }

        // Update the state with the calculated averages
        setAverages(calculatedAverages);

        console.log('Averages:', calculatedAverages); // Log averages
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const calculateBMI = () => {
    const heightInMeters = height / 100; // Convert height to meters
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBMI(bmiValue);
};

// Function to handle height change
const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    calculateBMI(); // Recalculate BMI when height changes
};

// Function to handle weight change
const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
    calculateBMI(); // Recalculate BMI when weight changes
};

  return (
    <div className="d-flex flex-row">
      <div className="back my-3 ms-3">
        <div className="d-flex flex-row m-0 gap-0">
          <Sidebar />
          <div className="d-flex flex-col font1 mx-4 fw-bold">
            <div className="px-4 mt-4">Health Overview</div>
            <div className="px-4 font2 ">{total}</div>
            <div className="container">
              <div className="row row-cols-2 m-2 d-flex justify-content-center  align-items-center">
                {categoryNames.map((category, index) => (
                  <div className="font3 box mt-5 mx-3" key={index}>
                    <div>
                      <img src={getCategoryIcon(category)} alt={category} className="rounded-3 my-2 me-3" width="58px" />
                      {category}
                    </div>
                    <div className="align-items-end ab">
                      <span>{Math.ceil(averages[category]) || 0}</span>
                      <div>{Math.ceil(averages[category])>=8 ? "Good": (Math.ceil(averages[category])>=5?"Average":"Bad")}</div>
                    </div>
                    <div className="align-items-end ab">
                      <img className="footer" src={Math.ceil(averages[category])>=8 ? getCategoryfooter('Good'): ((Math.ceil(averages[category])>=5?getCategoryfooter('Avg'):getCategoryfooter('Bad')))} 
                      alt={Math.ceil(averages[category])>=8 ? "Good": (Math.ceil(averages[category])>=5?"Average":"Bad")} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="back3 d-flex  flex-column ">
        <p className="bmitext d-flex align-items-center justify-content-center  px-5 mb-1 ">BMI calculator</p>
        <div className="d-flex flex-row">
          <div className="  ">
            <div className="height d-flex m-3 align-content-center justify-content-center">
              <h6 className="mt-5 ms-4">Height</h6>
              <div className="d-flex flex-column align-items-center">
                <img src={heightimg} className="imgbar mt-3 mx-2 mb-2" alt="Height" />
                <h6 className="me-3">{height}</h6>
                {/* Input for height */}
                <input type="range" min="0" max="250" value={height} onChange={(e) => handleHeightChange(e.target.value)} />
              </div>
            </div>
            <div className="weight d-flex m-3 align-content-center justify-content-center">
              <h6 className="mt-5 ms-4">Weight</h6>
              <div className="d-flex flex-column align-items-center">
                <img src={heightimg} className="imgbar mt-3 mx-2 mb-2" alt="Weight" />
                <h6 className="me-3">{weight}</h6>
                {/* Input for weight */}
                <input type="range" min="0" max="200" value={weight} onChange={(e) => handleWeightChange(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="bmiback d-flex flex-column align-items-center  my-3 mx-0">
            <h6 className="m-3 bmitext2">Body Mass Index (BMI)</h6>
            <div></div>
            <Slider value={Math.round(bmi)} />
          </div>
        </div>
        <div className="line mx-3"></div>
        <div className="d-flex justify-content-center "></div>
      </div>
    </div>
  );
}

function getCategoryIcon(category) {
  switch (category.toLowerCase()) {
    case 'attention':
      return attentionIcon;
    case 'memory':
      return memoryIcon;
    case 'language':
      return languageIcon;
    case 'reasoning':
      return reasoningIcon;
    case 'problem-solving':
      return problemSolvingIcon;
    case 'reflex':
      return reflexIcon;
    default:
      return null;
  }
}

function getCategoryfooter(category) {
  switch (category.toLowerCase()) {
    case 'bad':
      return bad;
    case 'avg':
      return avg;
    case 'good':
      return good;
    default:
      return null;
  }
}

export default DashboardMain;
