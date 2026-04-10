import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';
import UPIPayment from "../UPIPayment";

function ExpenseForm() {
    const { addExpense, error, setError } = useGlobalContext()

    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    })

    const { title, amount, date, category, description } = inputState;

    // 🔥 handle input
    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value })
        setError('')
    }

    // 🔥 validation
    const validateForm = () => {
        if (!title || !amount || !date || !category) {
            setError("Please fill all required fields")
            return false
        }
        if (Number(amount) <= 0) {
            setError("Amount must be greater than 0")
            return false
        }
        return true
    }

    // 🔥 cash submit
    const handleSubmit = e => {
        e.preventDefault()

        if (!validateForm()) return

        addExpense({
            ...inputState,
            amount: Number(amount)
        })

        setInputState({
            title: '',
            amount: '',
            date: '',
            category: '',
            description: '',
        })
    }

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>

            {error && <p className='error'>{error}</p>}

            <div className="input-control">
                <input
                    type="text"
                    value={title}
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                />
            </div>

            <div className="input-control">
                <input
                    value={amount}
                    type="number"
                    placeholder="Expense Amount"
                    onChange={handleInput('amount')}
                />
            </div>

            <div className="input-control">
                <DatePicker
                    placeholderText="Enter a Date"
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({ ...inputState, date })
                    }}
                />
            </div>

            <div className="selects input-control">
                <select required value={category} onChange={handleInput('category')}>
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
                    value={description}
                    placeholder="Add a reference"
                    rows="4"
                    onChange={handleInput('description')}
                />
            </div>

            {/* 🔥 CASH PAYMENT */}
            <div className="submit-btn">
                <Button
                    name={'Add Expense (Cash)'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                />
            </div>

            {/* 🔥 UPI PAYMENT */}
            <div className="upi-btn">
                <UPIPayment
                    amount={amount}
                    onSuccess={() => {
                        if (!validateForm()) return

                        addExpense({
                            ...inputState,
                            amount: Number(amount)
                        })

                        alert("UPI Payment Successful 🎉")

                        setInputState({
                            title: '',
                            amount: '',
                            date: '',
                            category: '',
                            description: '',
                        })
                    }}
                />
            </div>

        </ExpenseFormStyled>
    )
}

const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    input, textarea, select{
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .7rem 1rem;
        border-radius: 10px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
    }

    .submit-btn, .upi-btn{
        display: flex;
        justify-content: center;
    }

    .upi-btn{
        margin-top: 10px;
    }

    .error{
        color: red;
        text-align: center;
    }
`;

export default ExpenseForm