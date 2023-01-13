/** @format */

const Projects = () => {
  return (
    <div className='projects'>
      <div className='project__container'>
        <h1>Projects</h1>
        <div className='project__container__projects'>
          <div className='project'>
            <div className='project__image'>
              <img src='https://images.unsplash.com/photo-1610390000000-1b1b1b1b1b1b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' alt='' />
            </div>

            <div className='project__info'>
              <h2>Project 1</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, quod, quia, voluptate quae voluptatem quibusdam voluptatibus quos quas quidem nesciunt. Quisquam, quae.
                Quisquam voluptates, quod, quia, voluptate quae voluptatem quibusdam voluptatibus quos quas quidem nesciunt. Quisquam, quae.
              </p>
              <div className='project__info__links'>
                <a
                  href='
                '
                  target='_blank'
                  rel='noreferrer'>
                  <i className='fas fa-external-link-alt'></i>
                </a>
                <a href='' target='_blank' rel='noreferrer'>
                  <i className='fab fa-github'></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
