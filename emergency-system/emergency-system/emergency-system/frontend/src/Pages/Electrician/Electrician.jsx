import "./Electrician.css";

function ElectricianBlog() {
  return (
    <div className="electric-page">

      {/* Hero */}
      <section className="electric-hero">
        <h1>Professional Electrician Services</h1>
        <p>Safe and reliable electrical solutions for homes and offices</p>
      </section>

      {/* Intro */}
      <section className="electric-section">
        <h2>Why Electrical Safety Matters</h2>
        <p>
          Electrical systems are essential for modern living. Faulty wiring or
          damaged electrical components can cause serious risks. Our certified
          electricians ensure safe installation and repair services.
        </p>
      </section>

      {/* Services */}
      <section className="electric-section">
        <h2>Electrical Services We Provide</h2>

        <div className="electric-grid">
          <div className="electric-card">
            <h3>House Wiring</h3>
            <p>Complete wiring solutions for new and old buildings.</p>
          </div>

          <div className="electric-card">
            <h3>Short Circuit Repair</h3>
            <p>Quick fault detection and repair.</p>
          </div>

          <div className="electric-card">
            <h3>UPS & Inverter Setup</h3>
            <p>Backup power installation services.</p>
          </div>

          <div className="electric-card">
            <h3>Lighting Installation</h3>
            <p>Indoor and outdoor lighting setup.</p>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="electric-safety">
        <h2>Our Safety Standards</h2>

        <ul>
          <li>Use of certified electrical materials</li>
          <li>Proper circuit protection</li>
          <li>Testing after installation</li>
          <li>Modern tools for safe work</li>
        </ul>
      </section>

      {/* Emergency */}
      <section className="electric-emergency">
        <h2>24/7 Emergency Electrician</h2>
        <p>
          Power failure or wiring issue? Our team is available anytime for quick service.
        </p>
      </section>

    </div>
  );
}

export default ElectricianBlog;