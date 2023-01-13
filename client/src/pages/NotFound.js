/** @format */
import ColorBg from "../components/ColorBg";
import HeaderSketch from "../components/HeaderSketch";

const NotFound = () => {
  return (
    <div className='not-found'>
      <div className='container'>
        <div className='header'>
          <h1>Page not found.</h1>
          <a href='/' className='go-back'>
            <div className='icon'>
              <i className='fas fa-arrow-left'></i>
            </div>
            <div className='text'>Go back to home</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
