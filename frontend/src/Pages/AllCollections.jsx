import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InnerBanner from "../Components/InnerBanner";

// Dummy category images (replace with your actual imports)
const ringsImg =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop";
const necklaceImg =
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop";
const braceletsImg =
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop";
const earringsImg =
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&h=500&fit=crop";
const pendantsImg =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop";
const ankletsImg =
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop";
const broochesImg =
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop";
const cufflinksImg =
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&h=500&fit=crop";
const hairAccessoriesImg =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop";
const toeRingsImg =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop";
const nosePinsImg =
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop";
const mensJewelryImg =
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop";

const allCategories = [
  { id: 1, image: ringsImg, title: "Rings", link: "/shop?category=rings" },
  {
    id: 2,
    image: necklaceImg,
    title: "Necklaces",
    link: "/shop?category=necklaces",
  },
  {
    id: 3,
    image: braceletsImg,
    title: "Bracelets",
    link: "/shop?category=bracelets",
  },
  {
    id: 4,
    image: earringsImg,
    title: "Earrings",
    link: "/shop?category=earrings",
  },
  {
    id: 5,
    image: pendantsImg,
    title: "Pendants",
    link: "/shop?category=pendants",
  },
  {
    id: 6,
    image: ankletsImg,
    title: "Anklets",
    link: "/shop?category=anklets",
  },
  {
    id: 7,
    image: broochesImg,
    title: "Brooches",
    link: "/shop?category=brooches",
  },
  {
    id: 8,
    image: cufflinksImg,
    title: "Cufflinks",
    link: "/shop?category=cufflinks",
  },
  {
    id: 9,
    image: hairAccessoriesImg,
    title: "Hair Accessories",
    link: "/shop?category=hair",
  },
  {
    id: 10,
    image: toeRingsImg,
    title: "Toe Rings",
    link: "/shop?category=toerings",
  },
  {
    id: 11,
    image: nosePinsImg,
    title: "Nose Pins",
    link: "/shop?category=nosepins",
  },
  {
    id: 12,
    image: mensJewelryImg,
    title: "Men's Jewelry",
    link: "/shop?category=mens",
  },
];

function AllCollections() {
  const collectionRefs = useRef([]);

  // Hover animations (same logic, different class names)
  useEffect(() => {
    collectionRefs.current.forEach((box, idx) => {
      if (!box) return;
      const img = box.querySelector(".all-collection-img img");
      const content = box.querySelector(".all-collection-content");
      const btn = box.querySelector(".all-collection-btn a");

      const handleMouseEnter = () => {
        gsap.to(img, {
          scale: 1.12,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(content, {
          y: -10,
          duration: 0.4,
          ease: "back.out(1)",
          overwrite: true,
        });
        gsap.to(btn, {
          scale: 1.05,
          backgroundColor: "#fff",
          color: "#000",
          paddingLeft: "28px",
          paddingRight: "28px",
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(box, {
          boxShadow: "0 20px 30px -10px rgba(0,0,0,0.3)",
          duration: 0.3,
          overwrite: true,
        });
      };
      const handleMouseLeave = () => {
        gsap.to(img, {
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to(content, {
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(btn, {
          scale: 1,
          backgroundColor: "transparent",
          color: "#fff",
          paddingLeft: "24px",
          paddingRight: "24px",
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(box, { boxShadow: "none", duration: 0.3, overwrite: true });
      };
      box.addEventListener("mouseenter", handleMouseEnter);
      box.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        box.removeEventListener("mouseenter", handleMouseEnter);
        box.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    gsap.set(collectionRefs.current, { y: 70, opacity: 0, scale: 0.95 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: collectionRefs.current[0]?.closest(".all-collections-grid"),
        start: "top 85%",
        once: true,
        toggleActions: "play none none none",
      },
    });
    tl.to(collectionRefs.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      overwrite: true,
    });
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((tr) => {
        if (
          tr.vars.trigger ===
          collectionRefs.current[0]?.closest(".all-collections-grid")
        )
          tr.kill();
      });
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>All Collections | Jewelery For All Occasions</title>
        <meta
          name="description"
          content="Browse our complete collection of fine jewelry including rings, necklaces, earrings, bracelets and more."
        />
      </Helmet>
      <InnerBanner InnerBannerText="Our Collections" />

      <section className="all-collections-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="all-collections-heading">
                <h6>Shop By Collection</h6>
                <h2>Discover All Collections</h2>
              </div>
            </div>
          </div>

          <div className="all-collections-grid">
            {allCategories.map((item, index) => (
              <div
                className="all-collection-card"
                key={item.id}
                ref={(el) => (collectionRefs.current[index] = el)}
              >
                <div className="all-collection-inner">
                  <div className="all-collection-img">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="all-collection-content">
                    <div className="all-collection-title">
                      <h5>{item.title}</h5>
                    </div>
                    <div className="all-collection-btn">
                      <NavLink to={item.link}>View More</NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AllCollections;
