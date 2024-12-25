"use client";

import React, { useState } from 'react';

const ForgotPass: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    const sendOtp = async () => {
        try {
            // Simulate sending OTP via email
            // Replace this with actual API call to send OTP
            console.log(`Sending OTP to phone number: ${phoneNumber}`);
            setIsOtpSent(true);
            setError(null);
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const verifyOtp = async () => {
        try {
            // Simulate OTP verification
            // Replace this with actual API call to verify OTP
            console.log(`Verifying OTP: ${otp}`);
            // Handle OTP verification logic here
            setError(null);
        } catch (err) {
            setError('Failed to verify OTP. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* {error && <p className="text-red-500">{error}</p>} */}
            {!isOtpSent ? (
                <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Phone Number:
                        <input
                            type="number"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </label>
                    <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700">
                        Send OTP
                    </button>
                </form>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Enter OTP:
                        <input
                            type="number"
                            value={otp}
                            onChange={handleOtpChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </label>
                    <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700">
                        Verify OTP
                    </button>
                </form>
            )}
        </div>
    );
};

export default ForgotPass;