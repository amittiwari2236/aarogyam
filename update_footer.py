import os
import re

footer_target = r"<!-- Footer -->.*?</footer>"
footer_new = """<!-- Footer -->
    <footer class="site-footer">
        <div class="footer-grid">
            <div class="footer-section brand-section">
                <h2>Aarogyam</h2>
                <p>Find inner peace, balance, and harmony through the timeless practice of yoga.</p>
            </div>
            <div class="footer-section links-section">
                <h3>Quick Links</h3>
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="services.html">Services</a>
                <a href="booking.html">Booking</a>
                <a href="contact.html">Contact</a>
            </div>
            <div class="footer-section contact-section">
                <h3>Contact Info</h3>
                <p><i class="fas fa-envelope"></i> hello@aarogyam.com</p>
                <p><i class="fas fa-phone-alt"></i> +1 234 567 890</p>
                <p><i class="fas fa-map-marker-alt"></i> 123 Tranquil Lane, Wellness City</p>
            </div>
            <div class="footer-section social-section">
                <h3>Follow Us</h3>
                <div class="socials">
                    <a href="https://www.facebook.com/dsvvofficial/" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="https://x.com/dsvvofficial" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com/dsvvofficial/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
        <div class="copyright">
            &copy; 2026 Aarogyam. All rights reserved.
        </div>
    </footer>"""

for file in ["index.html", "about.html", "services.html", "booking.html", "contact.html"]:
    path = os.path.join("frontend", file)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = re.sub(footer_target, footer_new, content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
