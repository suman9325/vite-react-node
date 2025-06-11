import React, { Fragment, useState } from "react";
import ButtonWithLoader from "../../components/Buttons/ButtonWithLoader";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const formFields = [
        {
            label: "Email",
            name: "email",
            type: "email",
            value: "",
            placeholder: "Enter your email",
            required: true
        },
        {
            label: "Password",
            name: 'password',
            type: 'password',
            value: '',
            placeholder: 'Enter your password',
            required: true
        }
    ]

    const submitForm = () => {
        setIsLoading(true);
        console.log();
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);

    }

    return (
        <Fragment>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <h3>Login Form</h3>
                    </div>
                    <div className="card-body">
                    </div>
                </div>
                <div className="card-footer">
                    <ButtonWithLoader style={'btn btn-primary'} onClick={submitForm} isLoading={isLoading} >Login</ButtonWithLoader>
                </div>
            </div>
        </Fragment>
    )
}