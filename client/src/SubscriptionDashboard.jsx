import { useEffect, useState } from "react";

const API_URL = "https://youtube-clone-internship-e5dm.onrender.com";
const TEST_USERS = {
  Free: {
    userId: "6a958aeb6d13636d631e98c3",
  },
  Bronze: {
    userId: "6a958aeb6d13636d631e98c5",
  },
  Silver: {
    userId: "6a958aeb6d13636d631e98c7",
  },
  Gold: {
    userId: "6a958aeb6d13636d631e98c9",
  },
};
function SubscriptionDashboard() {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("Bronze");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/subscriptions/plans`
      );

      const data = await response.json();

      if (response.ok) {
        setPlans(data.plans || {});
      }
    } catch (error) {
      console.error("Failed to load subscription plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const planOrder = ["Free", "Bronze", "Silver", "Gold"];

  const handleContinueToPayment = () => {
    setPaymentStatus("");
    setShowPayment(true);
  };
  const handleCancelSubscription = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/subscriptions/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: TEST_USERS[selectedPlan].userId,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
  alert(data.message);
  setSelectedPlan("Free");
}
else {
      alert(data.message || "Failed to cancel subscription");
    }
  } catch (error) {
    console.error("Cancel subscription error:", error);
    alert("Server error while cancelling subscription");
  }
};

  const handleMockPayment = (status) => {
    if (status === "success") {
      setPaymentStatus("success");
    } else if (status === "failed") {
      setPaymentStatus("failed");
    } else {
      setPaymentStatus("cancelled");
    }
  };

  if (loading) {
    return <p>Loading subscription plans...</p>;
  }

  const selectedPlanDetails = plans[selectedPlan];

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Subscription Plans</h2>

      <p>
        Compare plans and choose the membership that suits you best.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {planOrder.map((planName) => {
          const plan = plans[planName];

          if (!plan) return null;

          const isSelected = selectedPlan === planName;

          return (
            <div
              key={planName}
              onClick={() => setSelectedPlan(planName)}
              style={{
                border: isSelected
                  ? "3px solid #ff0000"
                  : "1px solid #ccc",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                background: isSelected
                  ? "#fff5f5"
                  : "#ffffff",
              }}
            >
              <h3>{planName}</h3>

              <h2>
                ₹{plan.price}
              </h2>

              <p>{plan.validity}</p>

              <hr />

              <p>
                <strong>Quality:</strong>{" "}
                {plan.streamingQuality}
              </p>

              <p>
                <strong>Premium Videos:</strong>{" "}
                {plan.premiumVideos}
              </p>

              <p>
                <strong>Watch Time:</strong>{" "}
                {plan.watchTime}
              </p>

              <p>
                <strong>Downloads:</strong>{" "}
                {plan.dailyDownloadLimit}/day
              </p>

              <p>
                <strong>Offline Downloads:</strong>{" "}
                {plan.offlineDownloads ? "✓" : "✗"}
              </p>

              <p>
                <strong>Priority Content:</strong>{" "}
                {plan.priorityContent ? "✓" : "✗"}
              </p>

              <p>
                <strong>Faster Streaming:</strong>{" "}
                {plan.fasterStreaming ? "✓" : "✗"}
              </p>

              <p>
                <strong>Exclusive Courses:</strong>{" "}
                {plan.exclusiveCourses ? "✓" : "✗"}
              </p>

              <p>
                <strong>Ad-Free:</strong>{" "}
                {plan.adFree ? "✓" : "✗"}
              </p>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedPlan(planName);
                }}
              >
                {isSelected ? "Selected" : "Select Plan"}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "25px" }}>
        <h3>Selected Plan: {selectedPlan}</h3>

        <p>
          Price: ₹{selectedPlanDetails?.price || 0}
        </p>

        <button onClick={handleContinueToPayment}>
          Continue to Payment
        </button>
        <button
  onClick={handleCancelSubscription}
  style={{ marginLeft: "10px" }}
>
  Cancel Subscription
</button>
      </div>

      {showPayment && (
        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            border: "2px solid #333",
            borderRadius: "12px",
            maxWidth: "500px",
            background: "#fafafa",
          }}
        >
          <h2>Mock Payment Checkout</h2>

          <p>
            <strong>Plan:</strong> {selectedPlan}
          </p>

          <p>
            <strong>Amount:</strong> ₹
            {selectedPlanDetails?.price || 0}
          </p>

          <p>
            <strong>Currency:</strong> INR
          </p>

          <hr />

          {!paymentStatus && (
            <>
              <p>
                This is a simulated payment gateway for
                development and testing.
              </p>

              <button
                onClick={() => handleMockPayment("success")}
                style={{ marginRight: "10px" }}
              >
                Pay Now
              </button>

              <button
                onClick={() => handleMockPayment("failed")}
                style={{ marginRight: "10px" }}
              >
                Fail Payment
              </button>

              <button
                onClick={() => handleMockPayment("cancelled")}
              >
                Cancel Payment
              </button>
            </>
          )}

          {paymentStatus === "success" && (
            <div>
              <h3>✓ Payment Successful</h3>

              <p>
                Your payment has been successfully simulated.
              </p>

              <p>
                The backend payment verification will be
                connected next.
              </p>

              <button
                onClick={() => setShowPayment(false)}
              >
                Close
              </button>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div>
              <h3>✗ Payment Failed</h3>

              <p>
                The simulated payment failed.
              </p>

              <button
                onClick={() => setPaymentStatus("")}
              >
                Try Again
              </button>

              <button
                onClick={() => setShowPayment(false)}
                style={{ marginLeft: "10px" }}
              >
                Close
              </button>
            </div>
          )}

          {paymentStatus === "cancelled" && (
            <div>
              <h3>Payment Cancelled</h3>

              <p>
                You cancelled the payment.
              </p>

              <button
                onClick={() => setPaymentStatus("")}
              >
                Try Again
              </button>

              <button
                onClick={() => setShowPayment(false)}
                style={{ marginLeft: "10px" }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SubscriptionDashboard;