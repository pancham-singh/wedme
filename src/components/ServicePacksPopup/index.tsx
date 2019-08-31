import * as React from 'react';
import { Link } from 'react-router-dom';

interface ServicePacksPopupProps {
  isVisible: boolean;
}

interface ServicePacksPopupCallbacks {
  onClose: () => void;
}

const ServicePacksPopup = (props: ServicePacksPopupProps & ServicePacksPopupCallbacks) =>
  !props.isVisible ? null : (
    <section id="servicePackPopup">
      <span className="close" onClick={props.onClose} />
      <div className="grid">
        <div className="column">
          <div className="box">
            <h1>Great weddings Over 250 guests are invited</h1>
            <p className="amount">₪279</p>
            <p>One-time payment, including unlimited access certificates for all languages</p>
            <Link to="/user/billing/large">
              <button className="btn outline big">Just for me</button>
            </Link>
          </div>
        </div>
        <div className="column">
          <div className="box dark">
            <h1>For medium - sized weddings Up to 250 guests</h1>
            <p className="amount">₪199</p>
            <p>
              One-time payment, including 1,000 receipts, includes arrival permits in all languages
            </p>
            <Link to="/user/billing/medium">
              <button className="btn outline big">Just for me</button>
            </Link>
          </div>
        </div>
        <div className="column">
          <div className="box">
            <h1>For the little weddings Up to 100 guests</h1>
            <p className="amount">₪99</p>
            <p>One-time payment to the management system</p>
            <Link to="/user/billing/small">
              <button className="btn outline big">Just for me</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

export default ServicePacksPopup;
