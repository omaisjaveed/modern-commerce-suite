import { useState } from 'react'
import { Helmet } from "react-helmet-async";
import Banner from '../Components/Banner';
import AboutComponent from '../Components/AboutComponent';
import Collections from '../Components/Collections';
import FeaturedProducts from '../Components/FeaturedProducts';
import CallToAction from '../Components/CallToAction';
import CustomJewelery from '../Components/CustomJewelery';
import Reviews from '../Components/Reviews';
import Faqs from '../Components/Faqs';
import Customized from '../Components/Customized';
import Brands from '../Components/Brands';
import Blog from '../Components/Blog';
import ContactForm from '../Components/ContactForm';




function Home() {


    return (
        <>
            <Helmet>
                <title>Home | Jewelery For All Occassions</title>
                <meta name="description" content="This is the home page of my website." />
            </Helmet>
            <Banner />
            <AboutComponent />
            <Collections />
            <FeaturedProducts />
            <CallToAction />
            <CustomJewelery />
            <Reviews />
            <Faqs />
            <Customized />
            <Brands />
            <Blog />
            <ContactForm />
        </>
    )
}

export default Home