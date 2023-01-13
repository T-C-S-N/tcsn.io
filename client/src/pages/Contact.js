/** @format */

const Contact = () => {
  return (
    <div className='contact'>
      <div className='contact__container'>
        <h1>Contact</h1>
        <div className='contact__container__form'>
          <form>
            <div className='contact__container__form__group'>
              <label htmlFor='name'>Name</label>
              <input type='text' name='name' id='name' />
            </div>
            <div className='contact__container__form__group'>
              <label htmlFor='email'>Email</label>
              <input type='email' name='email' id='email' />
            </div>
            <div className='contact__container__form__group'>
              <label htmlFor='message'>Message</label>
              <textarea name='message' id='message' cols='30' rows='10'></textarea>
            </div>
            <div className='contact__container__form__group'>
              <button type='submit'>Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
