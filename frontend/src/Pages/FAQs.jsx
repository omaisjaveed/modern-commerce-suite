import { useState } from 'react'
import { Helmet } from "react-helmet-async";
import Faqs from '../Components/Faqs';
import InnerBanner from '../Components/InnerBanner';




function FaqsInner() {


    return (
        <>
            <Helmet>
                <title>FAQs | Jewelery For All Occassions</title>
                <meta name="description" content="This is the home page of my website." />
            </Helmet>
            <InnerBanner InnerBannerText="FAQS"/>
            <Faqs />
        </>
    )
}

export default FaqsInner;