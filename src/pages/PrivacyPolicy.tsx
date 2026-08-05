import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-australis-aqua/40 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-16 right-12 w-60 h-60 bg-gradient-to-xl from-white/20 to-australis-indigo/10 rounded-full blur-2xl"></div>
            <div className="container-custom relative z-10">
                <div className="flex items-center mb-6">
                    <button
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-colors shadow border border-white/30"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                    >
                        <ArrowLeft size={20} className="text-australis-navy" />
                        <span className="text-australis-navy font-medium text-base">Back</span>
                    </button>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-australis-navy mb-6">Privacy Policy</h1>

                <div className="prose max-w-none text-gray-700">
                    <p className="text-sm text-gray-600">Last Updated: 26 October 2025</p>
                    <p className="text-sm text-gray-600">Company: Australis Technologies Limited (Company No. 16178505)</p>
                    <p className="text-sm text-gray-600">Registered in: England and Wales</p>
                    <p className="text-sm text-gray-600">Email: <a href="mailto:hello@australis.energy" className="text-australis-indigo">hello@australis.energy</a></p>
                    <br />
                    <h2>1. Introduction</h2>
                    <p>
                        Australis Technologies Limited (“Australis”, “we”, “us”, “our”) is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our websites (australis.energy, portal.australis.energy), APIs, and related services (collectively, the “Services”).
                    </p>

                    <p>By using our Services, you agree to the terms of this Privacy Policy.</p>

                    <br />
                    <h2>2. Information We Collect</h2>
                    <p>We collect the following categories of information:</p>

                    <br />
                    <h3>2.1 Information You Provide</h3>
                    <ul>
                        <li>Account details: name, email address, and authentication data (via Azure AD B2C).</li>
                        <li>Organisation and project information you create or upload.</li>
                        <li>Files and reports you submit to our platform.</li>
                        <li>Communications: support requests or other correspondence.</li>
                    </ul>

                    <br />
                    <h3>2.2 Automatically Collected Information</h3>
                    <ul>
                        <li>Device, browser, and log data (IP address, operating system, timestamps).</li>
                        <li>Usage data through Google Analytics and Azure Application Insights.</li>
                        <li>Cookie and session data used for authentication and analytics.</li>
                    </ul>

                    <br />
                    <h3>2.3 Third-Party Sources</h3>
                    <p>
                        Microsoft Azure AD B2C for user identity management.
                        Azure Maps, OpenAI, and other Azure services used within our platform.
                    </p>

                    <br />
                    <h2>3. How We Use Your Information</h2>
                    <p>We use personal data to:</p>
                    <ul>
                        <li>Provide and improve the Australis platform and reports.</li>
                        <li>Authenticate and authorise user access.</li>
                        <li>Process geospatial and environmental data via Azure and AI services.</li>
                        <li>Communicate with you regarding account, support, or platform updates.</li>
                        <li>Monitor performance, detect issues, and enhance security.</li>
                        <li>Comply with legal obligations under UK law and applicable regulations.</li>
                    </ul>

                    <br />
                    <h2>4. Legal Bases for Processing</h2>
                    <p>We process your information under one or more of the following legal bases:</p>
                    <ul>
                        <li>Contractual necessity: to provide Services you request.</li>
                        <li>Legitimate interests: to improve, secure, and maintain the platform.</li>
                        <li>Legal compliance: to meet UK and EU data protection requirements.</li>
                        <li>Consent: for optional features such as analytics and marketing.</li>
                    </ul>

                    <br />
                    <h2>5. How We Share Information</h2>
                    <p>Your data may be shared with:</p>
                    <ul>
                        <li>Microsoft Azure (hosting, authentication, and data storage).</li>
                        <li>SendGrid (transactional emails).</li>
                        <li>Google Analytics (usage tracking).</li>
                        <li>OpenAI (data processing within AI-driven report generation).</li>
                        <li>Trusted service providers under appropriate data protection agreements.</li>
                    </ul>
                    <p>We do not sell your personal data.</p>

                    <br />
                    <h2>6. International Data Transfers</h2>
                    <p>Data is primarily stored in the United Kingdom and European Union within Azure regions. Where data is transferred outside the UK/EU, we rely on adequacy decisions or Standard Contractual Clauses (SCCs) to protect it.</p>

                    <br />
                    <h2>7. Data Retention</h2>
                    <p>We retain your data only as long as necessary to provide our Services, comply with legal obligations, or resolve disputes. When data is no longer required, it is securely deleted or anonymised.</p>

                    <br />
                    <h2>8. Data Security</h2>
                    <p>We implement industry-standard measures, including:</p>
                    <ul>
                        <li>Encryption at rest and in transit.</li>
                        <li>Azure-managed identity and role-based access control.</li>
                        <li>Continuous monitoring via Application Insights.</li>
                        <li>Secure development and deployment pipelines.</li>
                    </ul>

                    <br />
                    <h2>9. Your Rights</h2>
                    <p>Under UK GDPR, you have the right to:</p>
                    <ul>
                        <li>Access your personal data.</li>
                        <li>Request correction or deletion.</li>
                        <li>Restrict or object to processing.</li>
                        <li>Data portability.</li>
                        <li>Withdraw consent at any time.</li>
                    </ul>
                    <p>Requests may be sent to <a href="mailto:hello@australis.energy" className="text-australis-indigo">hello@australis.energy</a>. We will respond within one month.</p>

                    <br />
                    <h2>10. Cookies</h2>
                    <p>Our website uses cookies to enhance functionality, authentication, and analytics. You can manage or disable cookies via your browser settings. For more details, see our <Link to="/cookie-policy" className="text-australis-indigo">Cookie Policy</Link>.</p>

                    <br />
                    <h2>11. Children’s Privacy</h2>
                    <p>Our Services are not intended for individuals under 16 years of age, and we do not knowingly collect their data.</p>

                    <br />
                    <h2>12. Updates to This Policy</h2>
                    <p>We may update this Privacy Policy periodically. The revised version will be posted on this page with an updated “Last Updated” date.</p>

                    <br />
                    <h2>13. Contact</h2>
                    <p>If you have questions or concerns about this Privacy Policy or your data, please contact:</p>
                    <p>
                        Australis Technologies Limited<br />
                        Registered in England and Wales (No. 16178505)<br />
                        Email: <a href="mailto:hello@australis.energy" className="text-australis-indigo">hello@australis.energy</a><br />
                        Website: <a href="https://australis.energy" target="_blank" rel="noreferrer" className="text-australis-indigo">https://australis.energy</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
