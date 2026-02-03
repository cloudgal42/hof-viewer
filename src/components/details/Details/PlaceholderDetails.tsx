import {Card, Placeholder} from "react-bootstrap";
import PlaceholderImg from "../../../assets/placeholder.svg";
import {Eye, Heart, Person, Trophy} from "react-bootstrap-icons";

export const PlaceholderDetails = () => {
  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <div className="mb-2">
        <h2 className="mb-0">
          <Placeholder animation="glow">
            <Placeholder xs={5} size="lg"/>
          </Placeholder>
        </h2>
      </div>
      <h3 className="text-muted fs-5">
        <Placeholder animation="glow">
          <Placeholder xs={3} size="lg"/>
        </Placeholder>
      </h3>
      <section id="gallery" className="mt-3 position-relative">
        <img
          src={PlaceholderImg}
          className="w-100 object-fit-contain"
          style={{aspectRatio: "16/9"}}
          alt=""
        />
      </section>
      <section
        id="details"
        className="mt-3 position-relative"
      >
        <Card>
          <Card.Body>
            <section className="mb-3">
              <Placeholder className="mb-1" animation="glow">
                <Placeholder className="d-block mb-2" as={Card.Title} xs={3}/>
                <Placeholder className="d-block mb-2" as={Card.Text} xs={5}/>
              </Placeholder>
              <ul className="list-unstyled mb-0 row">
                <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                  <Person/>
                  <span className="visually-hidden">Population</span>
                  <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                    <Placeholder xs={1}/>
                  </Placeholder>
                </li>
                <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                  <Trophy/>
                  <span className="visually-hidden">Milestone</span>
                  <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                    <Placeholder xs={1}/>
                  </Placeholder>
                </li>
                <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                  <Eye/>
                  <span className="visually-hidden">Unique Views</span>
                  <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                    <Placeholder xs={1}/>
                  </Placeholder>
                </li>
                <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                  <Heart/>
                  <span className="visually-hidden">Favorites</span>
                  <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                    <Placeholder xs={1}/>
                  </Placeholder>
                </li>
              </ul>
            </section>
            <section className="mb-3">
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={5}/>
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7}/>
              </Placeholder>
            </section>
            <section className="mb-3">
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={5}/>
              </Placeholder>
              <Card>
                <Card.Body>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={4}/>
                  </Placeholder>
                </Card.Body>
              </Card>
            </section>
            <section>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={5}/>
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder className="d-block mb-2" xs={6}/>
                <Placeholder className="d-block mb-2" xs={4}/>
                <Placeholder className="d-block mb-2" xs={5}/>
                <Placeholder className="d-block mb-2" xs={4}/>
                <Placeholder className="d-block mb-2" xs={3}/>
              </Placeholder>
            </section>
          </Card.Body>
        </Card>
      </section>
    </div>
  )
}