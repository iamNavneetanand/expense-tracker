import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import styled from "styled-components";
import axios from "axios";

function UPIPayment({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [description, setDescription] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingTxnId, setPendingTxnId] = useState(null);
  const [loading, setLoading] = useState(false);

  const name = "BudgetWise";
  const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

  // ✅ Restore pending transaction on page load
  useEffect(() => {
    const savedTxnId = localStorage.getItem("pendingUpiTxnId");
    if (savedTxnId) {
      setPendingTxnId(savedTxnId);
      setShowConfirm(true);
    }
  }, []);

  const detectCategory = (note = "") => {
    const lower = note.toLowerCase();
    if (lower.includes("zomato") || lower.includes("swiggy")) return "takeaways";
    if (lower.includes("amazon") || lower.includes("flipkart")) return "shopping";
    if (lower.includes("netflix") || lower.includes("spotify")) return "subscriptions";
    return "other";
  };

  /* Log transaction to backend */
  const logTransaction = async () => {
    if (!amount || !upiId) return alert("Enter amount and UPI ID first!");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/v1/upi-log", {
        amount,
        upiId,
        description,
      });
      const txnId = res.data.txn._id;
      setPendingTxnId(txnId);
      localStorage.setItem("pendingUpiTxnId", txnId); // ✅ save to localStorage
      return txnId;
    } catch (err) {
      console.log(err);
      alert("Failed to log transaction. Try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* Pay with UPI app */
  const handlePayment = async () => {
    const txnId = await logTransaction();
    if (!txnId) return;
    window.location.href = upiLink;
    setTimeout(() => setShowConfirm(true), 4000);
  };

  /* QR flow */
  const handleQRConfirm = async () => {
    const txnId = await logTransaction();
    if (!txnId) return;
    setShowConfirm(true);
  };

  /* Confirm payment success */
  const confirmSuccess = async () => {
    const txnId = pendingTxnId || localStorage.getItem("pendingUpiTxnId"); // ✅ fallback
    console.log("pendingTxnId:", txnId);
    if (!txnId) return alert("No pending transaction found!");

    try {
      const res = await axios.post("http://localhost:5000/api/v1/upi-success", {
        id: txnId,
        category: detectCategory(description),
      });
      console.log("Response:", res.data);

      localStorage.removeItem("pendingUpiTxnId"); // ✅ clean up
      onSuccess && onSuccess();
      setShowConfirm(false);
      setShowQR(false);
      setAmount("");
      setUpiId("");
      setDescription("");
      setPendingTxnId(null);
    } catch (err) {
      console.log("Error:", err);
      alert("Failed to confirm payment. Try again.");
    }
  };

  return (
    <Wrapper>
      <h3>Make UPI Payment</h3>

      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="UPI ID (e.g. name@okaxis)"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description (e.g. Zomato order)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="btn-row">
        <button className="pay-btn" onClick={handlePayment} disabled={loading}>
          💸 Pay with UPI
        </button>
        <button className="qr-btn" onClick={() => setShowQR(!showQR)}>
          {showQR ? "Hide QR" : "📷 Scan QR"}
        </button>
      </div>

      {showQR && upiId && amount && (
        <div className="qr-box">
          <QRCodeCanvas value={upiLink} size={200} />
          <p>Scan with GPay / PhonePe / Paytm</p>
          <button className="qr-confirm-btn" onClick={handleQRConfirm} disabled={loading}>
            {loading ? "Processing..." : "✅ I've Paid, Confirm"}
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="popup">
          <p>Did your payment succeed?</p>
          <button onClick={confirmSuccess}>✅ Yes, it went through</button>
          <button onClick={() => setShowConfirm(false)}>❌ No, it failed</button>
        </div>
      )}
    </Wrapper>
  );
}

export default UPIPayment;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  h3 {
    margin-bottom: 5px;
    color: rgba(34, 34, 96, 0.9);
    font-size: 1.2rem;
  }

  input {
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #fff;
    background: transparent;
    font-size: 14px;
    outline: none;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);
    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }
  }

  .btn-row {
    display: flex;
    gap: 10px;
    margin-top: 5px;
  }

  .pay-btn {
    background: linear-gradient(135deg, #6a00f4, #b721ff);
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0px 4px 15px rgba(106, 0, 244, 0.3);
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.85; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .qr-btn {
    background: #00c853;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0px 4px 15px rgba(0, 200, 83, 0.3);
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.85; }
  }

  .qr-box {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    p {
      font-size: 13px;
      color: rgba(34, 34, 96, 0.6);
    }
  }

  .qr-confirm-btn {
    background: linear-gradient(135deg, #00c853, #00e676);
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0px 4px 15px rgba(0, 200, 83, 0.3);
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.85; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .popup {
    background: #fff;
    border-radius: 15px;
    padding: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
      font-weight: 600;
      color: rgba(34, 34, 96, 0.9);
    }

    button {
      padding: 8px 14px;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s ease;
      &:hover { opacity: 0.85; }
    }

    button:first-of-type { background: #00c853; color: white; }
    button:last-of-type { background: #ff1744; color: white; }
  }
`;