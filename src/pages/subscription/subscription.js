/* eslint-disable prettier/prettier */
import React from 'react'
import './subscription.css'
const Subscription = () => {

    const plans = [
        {
            planName: 'Basic Hospital Plan',
            description: ' Max 2 device user access (admin user,receptionist)',
            monthlyPrice: 1499,
            yearlyPrice: 14999

        },
        {
            planName: 'Basic Medical Plan',
            description: 'Max 1 device user access(medical)',
            monthlyPrice: 499,
            yearlyPrice: 4999

        },
        {
            planName: 'Basic Clinic Plan',
            description: ' Max 1 device user access(OPD)',
            monthlyPrice: 699,
            yearlyPrice: 6999

        },
        {
            planName: 'Silver Hospital Plan',
            description: 'Max 3 device user access(admin, receptionist & medical)',
            monthlyPrice: 1999,
            yearlyPrice: 19999

        },
        {
            planName: 'Basic Hospital Plan',
            description: ' Max 2 device user access (admin user,receptionist)',
            monthlyPrice: 1499,
            yearlyPrice: 14999

        },
        {
            planName: 'Gold Hospital Plan ',
            description: 'Max 4 device user access (admin,receptionist,medical & laboratory)',
            monthlyPrice: 2499,
            yearlyPrice: 24999

        },
        {
            planName: 'Platinum Plan Hospital',
            description: 'Max 4 device user access (admin,receptionist,medical & laboratory)',
            monthlyPrice: 2499,
            yearlyPrice: 24999

        }
    ]
    return (<>
        <div className="container">
            <div className="text-center mb-5">
                <h2>Choose Your Perfect Plans</h2>
            </div>
            <div className="row mt-3">
                {plans.map((plan, i) => (
                    <div className="col-lg-3 col-md-6 mt-3" key={i}>
                        <div className="card card1 h-100 d-flex flex-column justify-content-between">
                            <div className="ribbon">
                                <span className="fas fa-spray-can"></span>
                            </div>

                            <div className="text-center">
                                <h3>{plan.planName}</h3>
                                <ul className="list-unstyled text-muted">
                                    <li>
                                        <span className="fa fa-check me-2"></span>
                                        {plan.description}
                                    </li>
                                </ul>
                                <div className="price-wrapper">
                                    <button className="btn btn-monthly">
                                        {/* <sup className="sup">₹</sup> */}
                                        <span className="number">₹{plan.monthlyPrice} </span>
                                        <span className="frequency"> monthly</span>
                                    </button>
                                    <button className="btn btn-yearly">
                                        {/* <sup className="sup">₹</sup> */}
                                        <span className="number">₹{plan.yearlyPrice} </span>
                                        <span className="frequency"> yearly</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
    )
}

export default Subscription