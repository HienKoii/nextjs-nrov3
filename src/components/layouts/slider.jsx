import { Image } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

export default function Slider() {
  const slider = null;
  return (
    <Carousel>
      {slider?.map((item, index) => {
        return (
          <Carousel.Item key={index}>
            <Image className="d-block w-100" src={item.src} alt={`slider ${index}`} />
            <Carousel.Caption>
              <div dangerouslySetInnerHTML={{ __html: item.caption }} />
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}
