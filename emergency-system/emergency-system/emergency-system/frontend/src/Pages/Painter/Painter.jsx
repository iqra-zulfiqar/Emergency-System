import "./Painter.css";

function PainterBlog() {
  return (
    <div className="paint-page">

      {/* Hero */}
      <section className="paint-hero">
        <h1>Professional Painting Services</h1>
        <p>Make your home beautiful with modern paint designs</p>
      </section>

      {/* About */}
      <section className="paint-section">
        <h2>Interior & Exterior Painting</h2>
        <p>
          Our painters provide high-quality finishing using modern techniques
          and premium paints for long-lasting results.
        </p>
      </section>

      {/* Benefits */}
      <section className="paint-section">
        <h2>Why Choose Our Painters</h2>

        <div className="paint-benefits">
          <div className="benefit-box">
            <h3>Quality Finish</h3>
            <p>Smooth and professional painting.</p>
          </div>

          <div className="benefit-box">
            <h3>Modern Colors</h3>
            <p>Latest color combinations.</p>
          </div>

          <div className="benefit-box">
            <h3>Fast Work</h3>
            <p>On-time project completion.</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="paint-section">
        <h2>Our Painting Process</h2>

        <div className="paint-process">
          <div>Surface Preparation</div>
          <div>Primer Coating</div>
          <div>Final Paint</div>
          <div>Finishing Touch</div>
        </div>
      </section>

      {/* CTA */}
      <section className="paint-cta">
        <h2>Book Painting Service Today</h2>
        <p>Get professional painting at affordable rates.</p>
      </section>

    </div>
  );
}

export default PainterBlog;