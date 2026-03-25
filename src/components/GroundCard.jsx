import { Link } from "react-router-dom";

export default function GroundCard({ ground }) {
  const nextSlot = ground.availableSlots?.[0];
  return (
    <article className="card">
      <h3>{ground.name}</h3>
      <p>{ground.area}</p>
      <p>Ball Types: {ground.ballTypeSupported.join(", ")}</p>
      <p>Starting Price: ₹{ground.pricePerHour}/hr</p>
      <p>
        Next Slot:{" "}
        {nextSlot ? `${nextSlot.date} ${nextSlot.start}-${nextSlot.end}` : "Not listed"}
      </p>
      {ground.isVerified && <span className="badge">Verified</span>}
      <div className="card-actions">
        <Link to={`/grounds/${ground.id}`} className="btn btn-outline">
          View Details
        </Link>
      </div>
    </article>
  );
}