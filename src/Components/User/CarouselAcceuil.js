import { Link } from "react-router-dom";
import { Carousel } from "rsuite";

function CarouselAcceuil() {
  return (
    <Carousel autoplay className="custom-slider">
      <div className="imgCarousel1 text-white fw-bold">
        <div className="text-start p-5">
          <h3>THIS WEEK SALE OF 40%</h3>
          <h1>COUPLE BEAUTY LOVE</h1>
          <p>
            Bienvenue chez eBook, la plateforme qui vous donne le goût de la
            lecture.
          </p>
          <Link to="/user/books">
            <button
              className="btn rounded-5 px-4 btn-lg mt-5"
              style={{ background: "hsl(187, 85%, 43%)", color: "white" }}
            >
              Découvrez
            </button>
          </Link>
        </div>
      </div>
      <div className="imgCarousel2 text-white fw-bold">
        <div className="text-start p-5">
          <h3>THIS WEEK SALE OF 40%</h3>
          <h1>COUPLE BEAUTY LOVE</h1>
          <p>
            Bienvenue chez eBook, la plateforme qui vous donne le goût de la
            lecture.
          </p>
          <Link to="/user/books">
            <button
              className="btn rounded-5 px-4 btn-lg mt-5"
              style={{ background: "hsl(187, 85%, 43%)", color: "white" }}
            >
              Découvrez
            </button>
          </Link>
        </div>
      </div>
      <div className="imgCarousel3 text-white fw-bold">
        <div className="text-start p-5">
          <h3>THIS WEEK SALE OF 40%</h3>
          <h1>COUPLE BEAUTY LOVE</h1>
          <p>
            Bienvenue chez eBook, la plateforme qui vous donne le goût de la
            lecture.
          </p>
          <Link to="/user/books">
            <button
              className="btn rounded-5 px-4 btn-lg mt-5"
              style={{ background: "hsl(187, 85%, 43%)", color: "white" }}
            >
              Découvrez
            </button>
          </Link>
        </div>
      </div>
    </Carousel>
  );
}

export default CarouselAcceuil;
