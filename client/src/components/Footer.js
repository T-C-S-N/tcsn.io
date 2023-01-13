/** @format */

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='media'>
        <a href='http://bit.ly/3XwVLgF' title='tocausan@Github' alt='github' target='_blank' rel='noreferrer'>
          <i className='fab fa-github'></i>
        </a>
        <a href='http://bit.ly/3X6WKUJ' title='tocausan@Codepen' alt='codepen' target='_blank' rel='noreferrer'>
          <i className='fab fa-codepen'></i>
        </a>
        <a href='https://bit.ly/3CNyi2S' title='tocausan@Linkedin' alt='linkedin' target='_blank' rel='noreferrer'>
          <i className='fab fa-linkedin'></i>
        </a>
        <a href='http://bit.ly/3H3JICa' title='tocausan@Pinterest' alt='pinterest' target='_blank' rel='noreferrer'>
          <i className='fab fa-pinterest'></i>
        </a>
        <a href='http://bit.ly/3CKsiHQ' title='tocausan@Instagram' alt='instagram' target='_blank' rel='noreferrer'>
          <i className='fab fa-instagram'></i>
        </a>
        <a href='http://bit.ly/3IIexNV' title='tocausan@Behance' alt='behance' target='_blank' rel='noreferrer'>
          <i className='fab fa-behance'></i>
        </a>
        <a href='mailto: hello@tcsn.io' title='hello@tcsn.io' alt='email' target='_blank' rel='noreferrer'>
          <i className='far fa-envelope'></i>
        </a>
      </div>
      <div className='copyright'>
        <p>tocausan | {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
