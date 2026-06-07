import "./Plumber.css";

function PlumberBlog() {
  return (
    <div className="plumber-page">

      {/* Hero */}
      <section className="plumber-hero">
        <h1>Professional Plumbing Services</h1>
        <p>Reliable solutions for all plumbing problems</p>
      </section>

      {/* About */}
      <section className="plumber-section">
        <h2>About Our Plumbing Services</h2>
        <p>
          We provide installation and repair of pipelines, water systems,
          drainage systems, and bathroom fittings using modern equipment.
        </p>
      </section>

      {/* Problems */}
      <section className="plumber-section">
        <h2>Common Plumbing Problems</h2>

        <div className="plumber-problems">
          <div>Water Leakage</div>
          <div>Blocked Drain</div>
          <div>Broken Taps</div>
          <div>Low Water Pressure</div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="plumber-section">
        <h2>Our Working Process</h2>

        <div className="plumber-timeline">
          <div className="timeline-item">
            <h3>Inspection</h3>
            <p>Checking pipelines and fittings.</p>
          </div>

          <div className="timeline-item">
            <h3>Problem Detection</h3>
            <p>Finding the root cause of leakage or blockage.</p>
          </div>

          <div className="timeline-item">
            <h3>Repair</h3>
            <p>Fixing pipes using durable materials.</p>
          </div>

          <div className="timeline-item">
            <h3>Testing</h3>
            <p>Ensuring proper water flow.</p>
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="plumber-emergency">
        <h2>Emergency Plumbing Available</h2>
        <p>Fast response for urgent water leakage and drainage issues.</p>
      </section>

    </div>
  );
}

export default PlumberBlog;