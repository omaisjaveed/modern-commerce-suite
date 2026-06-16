import { useState } from 'react'
import { Helmet } from "react-helmet-async";
import ContactForm from '../Components/ContactForm';
import InnerBanner from '../Components/InnerBanner';




function ContactUs() {


    return (
        <>
            <Helmet>
                <title>Contact Us | Jewelery For All Occassions</title>
                <meta name="description" content="This is the home page of my website." />
            </Helmet>
            <InnerBanner InnerBannerText="Contact Us"/>
            <ContactForm />
        </>
    )
}

export default ContactUs;