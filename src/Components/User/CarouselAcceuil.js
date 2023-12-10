import { Link } from "react-router-dom";
import { Carousel } from "rsuite";

function CarouselAcceuil() {
  return (
    <Carousel autoplay className="custom-slider">
      <div className="imgCarousel1 text-white fw-bold">
        <div className="text-start p-5">
          <h3 className="text-uppercase">This week, up to 40% loan</h3>
          <h1 className="text-uppercase">Knowledge is a weapon</h1>
          <p>
            eBook is the only platform that will give you a taste for reading.
          </p>
          <Link to="/user/books">
            <button
              className="btn rounded-5 px-4 btn-lg mt-5"
              style={{ background: "hsl(187, 85%, 43%)", color: "white" }}
            >
              Discovery
            </button>
          </Link>
        </div>
      </div>
      <div className="imgCarousel2 text-white fw-bold">
        <div className="text-start p-5">
          <h3 className="text-uppercase">This week, up to 40% loan</h3>
          <h1 className="text-uppercase">Knowledge is a weapon</h1>
          <p>
            eBook is the only platform that will give you a taste for reading.
          </p>
          <Link to="/user/books">
            <button
              className="btn rounded-5 px-4 btn-lg mt-5"
              style={{ background: "hsl(187, 85%, 43%)", color: "white" }}
            >
              Discovery
            </button>
          </Link>
        </div>
      </div>
      <div className="imgCarousel3 text-white fw-bold">
        <div className="text-start p-5">
          <h3 className="text-uppercase">This week, up to 40% loan</h3>
          <h1 className="text-uppercase">Knowledge is a weapon</h1>
          <p>
            eBook is the only platform that will give you a taste for reading.
          </p>
          <Link to="/user/books">
            <button
              className="btn rounded-5 px-4 btn-lg mt-5"
              style={{ background: "hsl(187, 85%, 43%)", color: "white" }}
            >
              Discovery
            </button>
          </Link>
        </div>
      </div>
    </Carousel>
  );
}

export default CarouselAcceuil;
