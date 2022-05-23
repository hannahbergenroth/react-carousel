import "./App.css";
import { Carousel } from "./Carousel";
import maldives from "./images/maldives.jpg";
import portugal from "./images/portugal.jpg";
const images = [maldives, portugal, maldives, portugal, maldives];

function App() {
  return (
    <div className="App">
      <Carousel images={images} />
    </div>
  );
}

export default App;
