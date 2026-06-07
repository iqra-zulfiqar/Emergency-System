import React from "react";
import "./Services.css";
import { Link } from "react-router-dom";

import painter from "../../assets/painterservice.jpg";
import carpenter from "../../assets/carpenterservice.jpg";
import electrician from "../../assets/electricservice.jpg";
import plumber from "../../assets/plumber.jpg";

function Services() {
  const services = [
    {
      title: "Plumber",
      desc: "Expert plumbing solutions for leaks, repairs, and pipe maintenance.",
      img: plumber,
      link: "/plumber",
    },
    {
      title: "Electrician",
      desc: "Professional electrical services for safe and reliable power repairs.",
      img: electrician,
      link: "/electrician",
    },
    {
      title: "Painter",
      desc: "Quality painting services to refresh and brighten your home.",
      img: painter,
      link: "/painter",
    },
    {
      title: "Carpenter",
      desc: "Skilled carpentry work for furniture repair and custom wood designs.",
      img: carpenter,
      link: "/carpenter",
    },
  ];

  return (
    <section className="services-section">
      <h2 className="services-title">Our Services</h2>

      <div className="services-grid">
        {services.map((item, index) => (
          <div className="service-card" key={index}>
            <img src={item.img} alt={item.title} />

            <h3>{item.title}</h3>
            <p>{item.desc}</p>

            <Link to={item.link}>
              <button>See More</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;