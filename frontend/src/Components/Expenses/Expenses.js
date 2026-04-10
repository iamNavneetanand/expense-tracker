import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import ExpenseItem from '../ExpenseItem/ExpenseItem';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';
import UPIPayment from '../UPIPayment';  // ✅ Added

function Expenses() {
    const { addExpense, expenses, getExpenses, deleteExpense, totalExpenses, error, setError, loading, getUPITransactions } = useGlobalContext();

    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    });

    const [showUPI, setShowUPI] = useState(false); // ✅ Toggle UPI section

    const { title, amount, date, category, description } = inputState;

    useEffect(() => {
        getExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');
    };

    const handleSubmit = e => {
        e.preventDefault();
        addExpense({ ...inputState, amount: parseFloat(inputState.amount) });
        setInputState({
            title: '',
            amount: '',
            date: '',
            category: '',
            description: '',
        });
    };

    // ✅ Called after UPI payment confirmed
    const handleUPISuccess = () => {
        getExpenses();
        getUPITransactions();
        setShowUPI(false);
    };

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-expense">
                    Total Expense: <span>₹{totalExpenses()}</span>
                </h2>
                <div className="expense-content">
                    {/* ===== FORM ===== */}
                    <div className="form-container">
                        <FormStyled onSubmit={handleSubmit}>
                            {error && <p className='error'>{error}</p>}
                            <div className="input-control">
                                <input
                                    type="text"
                                    value={title}
                                    name="title"
                                    placeholder="Expense Title"
                                    onChange={handleInput('title')}
                                />
                            </div>
                            <div className="input-control">
                                <input
                                    type="text"
                                    value={amount}
                                    name="amount"
                                    placeholder="Expense Amount"
                                    onChange={handleInput('amount')}
                                />
                            </div>
                            <div className="input-control">
                                <DatePicker
                                    id='date'
                                    placeholderText='Enter a Date'
                                    selected={date}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                        setInputState({ ...inputState, date: date });
                                    }}
                                />
                            </div>
                            <div className="selects input-control">
                                <select
                                    required
                                    value={category}
                                    name="category"
                                    id="category"
                                    onChange={handleInput('category')}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="education">Education</option>
                                    <option value="groceries">Groceries</option>
                                    <option value="health">Health</option>
                                    <option value="subscriptions">Subscriptions</option>
                                    <option value="takeaways">Takeaways</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="travelling">Travelling</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="input-control">
                                <textarea
                                    name="description"
                                    value={description}
                                    placeholder='Add a reference'
                                    id="description"
                                    cols="30"
                                    rows="4"
                                    onChange={handleInput('description')}
                                ></textarea>
                            </div>
                            <div className="submit-btn">
                                <Button
                                    name={'Add Expense (Cash)'}
                                    icon={plus}
                                    bPad={'.8rem 1.6rem'}
                                    bRad={'30px'}
                                    bg={'var(--color-accent'}
                                    color={'#fff'}
                                />
                            </div>
                        </FormStyled>

                        {/* ✅ UPI Toggle Button */}
                        <UPIToggle onClick={() => setShowUPI(!showUPI)}>
                            {showUPI ? '✕ Hide UPI Payment' : '💸 Pay via UPI'}
                        </UPIToggle>

                        {/* ✅ UPI Payment Section */}
                        {showUPI && (
                            <UPISection>
                                <UPIPayment onSuccess={handleUPISuccess} />
                            </UPISection>
                        )}
                    </div>

                    {/* ===== EXPENSE LIST ===== */}
                    <div className="expenses">
                        {loading && <p>Loading expenses...</p>}
                        {!loading && expenses.length === 0 && (
                            <p>No expenses found. Add one to get started!</p>
                        )}
                        {expenses.map((expense) => {
                            const { _id, title, amount, date, category, description, type } = expense;
                            return (
                                <ExpenseItem
                                    key={_id}
                                    id={_id}
                                    title={title}
                                    description={description}
                                    amount={amount}
                                    date={date}
                                    type={type}
                                    category={category}
                                    indicatorColor="var(--color-red)"
                                    deleteItem={deleteExpense}
                                />
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;

    .total-expense {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-red);
        }
    }

    .expense-content {
        display: flex;
        gap: 2rem;
        .expenses {
            flex: 1;
        }
    }
`;

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    .input-control {
        input {
            width: 100%;
        }
    }

    .selects {
        display: flex;
        justify-content: flex-end;
        select {
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active {
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn {
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: var(--color-red) !important;
            }
        }
    }

    .error {
        color: red;
        font-size: 0.9rem;
        animation: shake 0.3s ease;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// ✅ UPI Toggle Button
const UPIToggle = styled.button`
    margin-top: 1rem;
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 30px;
    background: linear-gradient(135deg, #6a00f4, #b721ff);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0px 4px 15px rgba(106, 0, 244, 0.3);
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.85;
    }
`;

// ✅ UPI Section wrapper
const UPISection = styled.div`
    margin-top: 1rem;
    background: #FCF6F9;
    border: 2px solid #fff;
    border-radius: 20px;
    padding: 1.2rem;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
`;

export default Expenses;