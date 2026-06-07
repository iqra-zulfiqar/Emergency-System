import "./Carpenter.css"

function CarpenterBlog() {
  return (
    <div className="service-page">

      {/* Hero Section */}
      <section className="service-hero">
        <div className="hero-content">
          <h1>Professional Carpenter Services</h1>
          <p>
            Expert woodwork solutions for homes, offices, and commercial buildings.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="service-section">
        <h2>About Our Carpenter Services</h2>
        <p>
          Our professional carpenters provide high-quality woodwork solutions
          including furniture design, repair, and installation. We use modern tools
          and premium materials to ensure durability and perfect finishing.
        </p>
      </section>

      {/* Services Grid */}
      <section className="service-section">
        <h2>Our Services</h2>

        <div className="service-grid">
          <div className="service-card">
            <h3>Furniture Repair</h3>
            <p>Repair of broken beds, tables, chairs, and cupboards.</p>
          </div>

          <div className="service-card">
            <h3>Door Installation</h3>
            <p>Wooden door fitting and lock adjustment services.</p>
          </div>

          <div className="service-card">
            <h3>Kitchen Cabinets</h3>
            <p>Modern kitchen cabinet design and installation.</p>
          </div>

          <div className="service-card">
            <h3>Custom Furniture</h3>
            <p>Design furniture according to your space and style.</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="service-section">
        <h2>Our Working Process</h2>

        <div className="process-container">
          <div className="process-box">
            <span>1</span>
            <p>Inspection & Measurement</p>
          </div>

          <div className="process-box">
            <span>2</span>
            <p>Material Selection</p>
          </div>

          <div className="process-box">
            <span>3</span>
            <p>Installation</p>
          </div>

          <div className="process-box">
            <span>4</span>
            <p>Final Finishing</p>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="service-emergency">
        <h2>24/7 Emergency Carpenter Available</h2>
        <p>
          Broken door? Furniture damage? Our emergency team is ready to help anytime.
        </p>
      </section>

    </div>
  );
}

export default CarpenterBlog;