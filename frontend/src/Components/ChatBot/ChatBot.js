import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

function ChatBot() {
  const { incomes, expenses, totalBalance, totalExpenses } =
    useGlobalContext();

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text:
        "Hi 👋 I am your Budget Wise assistant.\nTry asking: balance, expenses, income, saving tips, most spending.",
      bot: true,
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, bot: false };
    let botReply = "Sorry, I didn’t understand 😅";

    const lower = input.toLowerCase();

    /* 🔥 GREETING */
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    ) {
      botReply =
        "Hello 👋 How can I help you with your finances today?";
    }

    /* 🔥 BALANCE */
    else if (
      lower.includes("balance") ||
      lower.includes("money left") ||
      lower.includes("remaining")
    ) {
      botReply = `Your current balance is ₹${totalBalance()}`;
    }

    /* 🔥 EXPENSE */
    else if (
      lower.includes("expense") ||
      lower.includes("spent") ||
      lower.includes("spending")
    ) {
      botReply = `Your total expenses are ₹${totalExpenses()}`;
    }

    /* 🔥 INCOME */
    else if (
      lower.includes("income") ||
      lower.includes("earn") ||
      lower.includes("salary")
    ) {
      const total = incomes.reduce((a, b) => a + b.amount, 0);
      botReply = `Your total income is ₹${total}`;
    }

    /* 🔥 CATEGORY INSIGHT */
    else if (
      lower.includes("most") &&
      (lower.includes("spend") || lower.includes("expense"))
    ) {
      if (expenses.length === 0) {
        botReply = "You don’t have enough expense data yet.";
      } else {
        const categoryMap = {};

        expenses.forEach((e) => {
          categoryMap[e.category] =
            (categoryMap[e.category] || 0) + e.amount;
        });

        const maxCategory = Object.keys(categoryMap).reduce((a, b) =>
          categoryMap[a] > categoryMap[b] ? a : b
        );

        botReply = `You spend the most on ${maxCategory}.`;
      }
    }

    /* 🔥 SAVING TIP */
    else if (
      lower.includes("saving") ||
      lower.includes("save") ||
      lower.includes("tips")
    ) {
      botReply =
        "Tip: Try the 50-30-20 rule. Save at least 20% of your income.";
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      { text: botReply, bot: true },
    ]);

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <FloatingButton onClick={() => setOpen(!open)}>💬</FloatingButton>

      {/* Chat Window */}
      {open && (
        <ChatWindow>
          <div className="header">Budget AI</div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={msg.bot ? "bot" : "user"}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your money..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </ChatWindow>
      )}
    </>
  );
}

export default ChatBot;


/* 🔥 Floating Chat Button */

const FloatingButton = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7b2ff7, #f107a3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;


/* 🔥 Chat Window */

const ChatWindow = styled.div`
  position: fixed;
  bottom: 100px;
  right: 25px;
  width: 330px;
  height: 470px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999;

  .header {
    background: linear-gradient(135deg, #2b1055, #6a00f4);
    color: white;
    padding: 1rem;
    font-weight: bold;
    text-align: center;
  }

  .chat-body {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .bot {
    background: #f1f3f6;
    padding: 8px 12px;
    border-radius: 10px;
    margin: 6px 0;
    max-width: 80%;
    font-size: 14px;
  }

  .user {
    background: linear-gradient(135deg, #7b2ff7, #f107a3);
    color: white;
    padding: 8px 12px;
    border-radius: 10px;
    margin: 6px 0;
    max-width: 80%;
    align-self: flex-end;
    font-size: 14px;
  }

  .input-box {
    display: flex;
    padding: 10px;
    border-top: 1px solid #eee;

    input {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #ddd;
      outline: none;
    }

    button {
      margin-left: 8px;
      background: #7b2ff7;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 8px 14px;
      cursor: pointer;

      &:hover {
        background: #5c21c9;
      }
    }
  }
`;