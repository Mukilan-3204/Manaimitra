import './AboutUs.css'

export default function AboutUs() {
  return (
    <div className="page page-enter">
      <section className="about-hero">
        <div className="container">
          <h1>About Manai Mitra</h1>
          <p className="about-hero-sub">Madurai's most trusted real estate platform, connecting buyers and sellers with transparency, technology, and trust.</p>
        </div>
      </section>

      <section className="about-section container">
        <div className="about-grid">
          <div className="about-content">
            <h2>Our Mission</h2>
            <p>
              Manai Mitra was founded with a simple vision: to make property transactions in Madurai district
              transparent, verified, and accessible to everyone. We leverage AI technology and a rigorous
              approval process to ensure every listing on our platform is genuine.
            </p>
            <p>
              Whether you're a first-time buyer exploring plots in Thirupparankundram, or a landowner in
              K.K. Nagar looking to sell, Manai Mitra provides the tools, reach, and trust you need.
            </p>
          </div>
          <div className="about-values">
            <div className="about-value glass-card">
              <span>🎯</span>
              <h4>Transparency</h4>
              <p>Every listing is verified through our AI pipeline and approved by our team.</p>
            </div>
            <div className="about-value glass-card">
              <span>🤝</span>
              <h4>Trust</h4>
              <p>Google-authenticated users and owner-approved listings ensure genuine transactions.</p>
            </div>
            <div className="about-value glass-card">
              <span>📍</span>
              <h4>Local Focus</h4>
              <p>Deep coverage of all 5 Madurai divisions with 50+ neighbourhoods.</p>
            </div>
            <div className="about-value glass-card">
              <span>⚡</span>
              <h4>Speed</h4>
              <p>Quick listing approval and instant search across all areas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-contact container">
        <div className="glass-card about-contact-card">
          <h2>Get in Touch</h2>
          <p>Have questions? We'd love to hear from you.</p>
          <div className="about-contact-info">
            <div><strong>Email:</strong> contact@manamitra.com</div>
            <div><strong>Phone:</strong> +91 98765 43210</div>
            <div><strong>Location:</strong> Madurai, Tamil Nadu, India</div>
          </div>
        </div>
      </section>
    </div>
  )
}
