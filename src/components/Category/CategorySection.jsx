import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import "./Category.css";

const categories = [
  { name: "Electronics", img: "https://imgs.search.brave.com/4vF5-VINQutgfUoOfouWEq3FOHwtZ5f6MuX8f_IkyQo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9nYWRn/ZXRzLWFjY2Vzc29y/aWVzLWdhZGdldHMt/YWNjZXNzb3JpZXMt/aXNvbGF0ZWQtd2hp/dGUtYmFja2dyb3Vu/ZC0xMzM0MjkwMDQu/anBn" },
  { name: "Fashion", img: "https://imgs.search.brave.com/V-n4H4OWC-iUaZxYyTiav0cyU76QgIJe34QXfmtTjhE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTIw/MTYwNzU4NC9waG90/by9jcm9wcGVkLWhh/bmQtb2YtbWFuLWhv/bGRpbmctc2hpcnQt/aW4tc2hvcC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9UDJz/cktwbkFORnBMbTlt/Um1LNjcwWERKaVdt/OEdXczZZTEM4MnBn/MmVEWT0" },
  { name: "Toys", img: "https://imgs.search.brave.com/KtizQex3MLX7SblIOsd03m6RIFbNuAZQigv0u8p9Lpc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMjU1/NTE0L3BleGVscy1w/aG90by0yNTU1MTQu/anBlZz9hdXRvPWNv/bXByZXNzJmNzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw" },
  { name: "Books", img: "https://imgs.search.brave.com/pah-LufvI_zmHn0fbxqPXQEZAi-_A_vyBxAuvKTfoy0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cHJvZHVjdHBsYW4u/Y29tL3VwbG9hZHMv/MjAxNy8wNS9ib29r/cy1mb3ItcHJvZHVj/dC1tYW5hZ2Vycy5q/cGVn" },
  { name: "Sports", img: "https://imgs.search.brave.com/QF0jmj-rs5wNieyu8W78ryi9jbjXGjw51mpALx_zalg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2I4LzA5/LzhmL2I4MDk4ZjY1/YTEzYTZiOGYyZjc2/NWE2M2MyMDU4YjRm/LmpwZw" },
  { name: "Beauty", img: "https://imgs.search.brave.com/9jicmogCW9USdbhymyRu3bL6yJ8fS5eZ675H-AlkWJI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvOTI2/MTY4NTQ4L3Bob3Rv/L21ha2V1cC1iYWct/d2l0aC12YXJpZXR5/LW9mLWJlYXV0eS1w/cm9kdWN0cy5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9d0Q3/NUVlWWxta1k0SWRH/dThPSWlRdGJiUmdj/a2ZsbVBFZ1FTcWtf/NC1Edz0" },
];

const CategorySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [numDots, setNumDots] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const checkScrollable = () => {
      if (gridRef.current) {
        const { scrollWidth, clientWidth } = gridRef.current;
        setIsScrollable(scrollWidth > clientWidth);
        if (scrollWidth > clientWidth) {
          setNumDots(Math.round(scrollWidth / clientWidth));
        }
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);
  const handleScroll = () => {
    if (gridRef.current) {
      const { scrollLeft, clientWidth } = gridRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex(newIndex);
    }
  };

  return (
    <section className="category-section">
      <h3 className="category-section__title">Shop by Category</h3>
      <div className="category-scroll-wrapper">
        <div
          className="category-section__grid"
          ref={gridRef}
          onScroll={handleScroll}
        >
          {categories.map((cat, index) => (
            <Link to={`/category/${encodeURIComponent(cat.name)}`} key={`${cat.name}-${index}`} className="category-link">
              <CategoryCard name={cat.name} img={cat.img} />
            </Link>
          ))}
        </div>
      </div>
      {isScrollable && (
        <div className="category-section__dots">
          {Array.from({ length: numDots }).map((_, index) => (
            <span key={index} className={`dot ${index === activeIndex ? "active" : ""}`}></span>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;