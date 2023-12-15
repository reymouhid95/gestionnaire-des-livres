import img1 from '../../assets/cat1.png';
import img2 from '../../assets/cat2.png';
import img3 from '../../assets/cat3.png';
import img4 from '../../assets/cat4.png';
import img5 from '../../assets/cat5.png';
import img6 from '../../assets/cat6.png';
import imgTestimonials1 from '../../assets/c1.jpg';
import imgTestimonials2 from '../../assets/c2.jpg';
import imgTestimonials3 from '../../assets/c3.jpg';

export const menuUser = [
  {
    title: "Home",
    icon: "bi bi-house-door fs-5 me-3",
    path: "/user/dashboardUser",
  },
  { title: "Books", icon: "bi bi-book-half fs-5 me-3", path: "/user/books" },
  {
    title: "Books Borrowed",
    icon: "bi bi-bookmark-check fs-5 me-3",
    path: "/user/bookBorrowed",
  },
];

export const infoCategories = [
  { img: img1, category: "Textbooks"},
  { img: img2, category: "Science"},
  { img: img3, category: "History"},
  { img: img4, category: "Biography"},
  { img: img5, category: "Adventure"},
  { img: img6, category: "Fantasy"},
];

export const testimonials = [
  { img: imgTestimonials1, name: "Jone Mark" },
  { img: imgTestimonials2, name: "Anna Crowe" },
];

export const testimonialLastElem = [
  { img: imgTestimonials3, name: "Hilley James" },
];

