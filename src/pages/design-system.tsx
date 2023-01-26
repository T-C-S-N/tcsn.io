import styles from '@/styles/pages/DesignSystem.module.css'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Codepen, Instagram, Mail } from "react-feather";
import { FaGithub, FaLinkedin, FaBehance, FaPinterest } from "react-icons/fa";

export default function designSystemPage() {

  return (
    <>
      <SEO title='tcsn | Design System' description='Tocausan design system' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>

        <div className='margin-10'>
          <h1>Design System</h1>
          <h2>Colors</h2>
          <div className='container flex-row flex-justify-space-evenly margin-horizontal-10 bg-white'>
            <div className='color_box'>
              <div className='color_box__color bg-black'></div>
              <div className='color_box__name'>Black</div>
              <div className='color_box__code'>0 , 0 , 0</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-white'></div>
              <div className='color_box__name'>White</div>
              <div className='color_box__code'>255 , 255 , 255</div>
            </div>

            <div className='color_box'>
              <div className='color_box__color bg-shadow'></div>
              <div className='color_box__name'>Shadow</div>
              <div className='color_box__code'>0 , 0 , 0 , 0.2</div>
            </div>

            <div className='color_box'>
              <div className='color_box__color bg-main'></div>
              <div className='color_box__name'>Main</div>
              <div className='color_box__code'>245 , 245 , 245</div>
            </div>

            <div className='color_box'>
              <div className='color_box__color bg-primary'></div>
              <div className='color_box__name'>Primary</div>
              <div className='color_box__code'>42 , 57 , 87</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-secondary'></div>
              <div className='color_box__name'>Secondary</div>
              <div className='color_box__code'>137 , 143 , 167</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-danger'></div>
              <div className='color_box__name'>Danger</div>
              <div className='color_box__code'>255 , 66 , 66</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-warning'></div>
              <div className='color_box__name'>Warning</div>
              <div className='color_box__code'>251 , 211 , 47</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-success'></div>
              <div className='color_box__name'>Success</div>
              <div className='color_box__code'>178 , 255 , 28</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-info'></div>
              <div className='color_box__name'>Info</div>
              <div className='color_box__code'>129 , 153 , 191</div>
            </div>

            <div className='color_box'>
              <div className='color_box__color bg-light-blue'></div>
              <div className='color_box__name'>Light Blue</div>
              <div className='color_box__code'>150 , 214 , 247</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-blue'></div>
              <div className='color_box__name'>Blue</div>
              <div className='color_box__code'>96 , 198 , 242</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-dark-blue'></div>
              <div className='color_box__name'>Dark Blue</div>
              <div className='color_box__code'>0 , 152 , 215</div>
            </div>

            <div className='color_box'>
              <div className='color_box__color bg-light-pink'></div>
              <div className='color_box__name'>Light Pink</div>
              <div className='color_box__code'>246 , 175 , 206</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-pink'></div>
              <div className='color_box__name'>Pink</div>
              <div className='color_box__code'>243 , 146 , 189</div>
            </div>
            <div className='color_box'>
              <div className='color_box__color bg-dark-pink'></div>
              <div className='color_box__name'>Dark Pink</div>
              <div className='color_box__code'>239 , 83 , 158</div>
            </div>
          </div>


          <h2>Icons, Logos & Illustrations</h2>
          <div className='container flex-row margin-horizontal-10 bg-white'>
            <div className='container'>
              <div className=''><Logo active={true} /></div>
              <div className=''><Logo active={false} /></div>
            </div>


            <ul className='container'>
              <li><FaGithub color='black' size={20} /></li>
              <li><FaLinkedin color='black' size={20} /></li>
              <li><FaBehance color='black' size={20} /></li>
              <li><FaPinterest color='black' size={20} /></li>
              <li><Codepen color='black' size={20} /></li>
              <li><Instagram color='black' size={20} /></li>
              <li><Mail color='black' size={20} /></li>
            </ul>

          </div>


          <h2>Fonts</h2>
          <div className='container flex-row margin-horizontal-10 bg-white'>
            <div className='container none'>
              <h3>Examples</h3>
              <SyntaxHighlighter language="html">
                {`<!-- Examples -->
<p className='font-size-text'>Text</p>
<p className='font-size-small'>Small text</p>
<p className='color-blue'>Blue text</p>`}
              </SyntaxHighlighter>
            </div>

            <div className='container'>
              <h3>Font size</h3>
              <ul>
                <li className='font-size-xxsmall'>.font-size-xxsmall</li>
                <li className='font-size-xsmall'>.font-size-xsmall</li>
                <li className='font-size-small'>.font-size-small</li>
                <li className='font-size-text'>.font-size-text</li>
                <li className='font-size-subtitle'>.font-size-subtitle</li>
                <li className='font-size-title'>.font-size-title</li>
                <li className='font-size-large'>.font-size-large</li>
                <li className='font-size-xlarge'>.font-size-xlarge</li>
                <li className='font-size-xxlarge'>.font-size-xxlarge</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Font weight</h3>
              <ul>
                <li className='font-weight-light'>.font-weight-light</li>
                <li className='font-weight-normal'>.font-weight-normal</li>
                <li className='font-weight-bold'>.font-weight-bold</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Font color</h3>
              <ul>
                <li className='color-black'>.color-black</li>
                <li className='color-white'>.color-white</li>
                <li className='color-main'>.color-main</li>
                <li className='color-light'>.color-light</li>
                <li className='color-primary'>.color-primary</li>
                <li className='color-secondary'>.color-secondary</li>
                <li className='color-danger'>.color-danger</li>
                <li className='color-warning'>.color-warning</li>
                <li className='color-success'>.color-success</li>
                <li className='color-info'>.color-info</li>
                <li className='color-light-blue'>.color-light-blue</li>
                <li className='color-blue'>.color-blue</li>
                <li className='color-dark-blue'>.color-dark-blue</li>
                <li className='color-light-pink'>.color-light-pink</li>
                <li className='color-pink'>.color-pink</li>
                <li className='color-dark-pink'>.color-dark-pink</li>
              </ul>
            </div>
          </div>


          <h2>Containers</h2>
          <div className='container flex-row margin-horizontal-10 bg-white'>
            <div className='container none'>
              <h3>Examples</h3>
              <SyntaxHighlighter language="html">
                {`<!-- Examples -->
<div className='flex flex-row width-100 margin-top-50'></div>
<div className='flex flex-start width-50 bg-pink'></div>`}
              </SyntaxHighlighter>
            </div>

            <div className='container'>
              <h3>Visibility</h3>
              <ul>
                <li>.visible</li>
                <li>.invisible</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Position</h3>
              <ul>
                <li>.position-relative</li>
                <li>.position-absolute</li>
                <li>.position-fixed</li>
                <li>.position-static</li>
                <li>.position-sticky</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Display</h3>
              <ul>
                <li>.block</li>
                <li>.inline-block</li>
                <li>.inline</li>
                <li>.none</li>
                <li>.table</li>
                <li>.table-cell</li>
                <li>.table-row</li>
                <li>.flex</li>
                <li>.inline-flex</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Flex</h3>
              <ul>
                <li>.flex-row</li>
                <li>.flex-column</li>
                <li>.flex-center</li>
                <li>.flex-start</li>
                <li>.flex-end</li>
                <li>.flex-justify-center</li>
                <li>.flex-justify-space-between</li>
                <li>.flex-justify-space-evenly</li>
                <li>.flex-justify-space-around</li>
                <li>.flex-justify-start</li>
                <li>.flex-justify-end</li>
                <li>.flex-align-center</li>
                <li>.flex-align-start</li>
                <li>.flex-align-end</li>
                <li>.flex-align-baseline</li>
                <li>.flex-align-stretch</li>
                <li>.flex-wrap</li>
                <li>.flex-wrap-reverse</li>
                <li>.flex-no-wrap</li>
                <li>.flex-grow</li>
                <li>.flex-no-grow</li>
                <li>.flex-shrink</li>
                <li>.flex-no-shrink</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Size</h3>
              <ul>
                <li>.width-[0-100 by 5] (%)</li>
                <li>.min-width-[0-100 by 5] (px)</li>
                <li>.max-width-[0-100 by 5] (px)</li>
                <li>.height-[0-100 by 5] (%)</li>
                <li>.min-height-[0-100 by 5] (px)</li>
                <li>.max-height-[0-100 by 5] (px)</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Margin</h3>
              <ul>
                <li>.margin-[0-100 by 5] (px)</li>
                <li>.margin-top-[0-100 by 5] (px)</li>
                <li>.margin-right-[0-100 by 5] (px)</li>
                <li>.margin-bottom-[0-100 by 5] (px)</li>
                <li>.margin-left-[0-100 by 5] (px)</li>
                <li>.margin-horizontal-[0-100 by 5] (px)</li>
                <li>.margin-vertical-[0-100 by 5] (px)</li>
                <li>.margin-[0-100]-[0-100 by 5] (px)</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Padding</h3>
              <ul>
                <li>.padding-[0-100 by 5] (px)</li>
                <li>.padding-top-[0-100 by 5] (px)</li>
                <li>.padding-right-[0-100 by 5] (px)</li>
                <li>.padding-bottom-[0-100 by 5] (px)</li>
                <li>.padding-left-[0-100 by 5] (px)</li>
                <li>.padding-horizontal-[0-100 by 5] (px)</li>
                <li>.padding-vertical-[0-100 by 5] (px)</li>
                <li>.padding-[0-100]-[0-100 by 5] (px)</li>
              </ul>
            </div>

            <div className='container'>
              <h3>Border</h3>
              <ul>
                <li>.border</li>
                <li>.border-radius</li>
                <li>.border-top</li>
                <li>.border-right</li>
                <li>.border-bottom</li>
                <li>.border-left</li>

                <li>.border-none</li>
                <li>.border-top-none</li>
                <li>.border-right-none</li>
                <li>.border-bottom-none</li>
                <li>.border-left-none</li>

                <li>.border-width-[0-5] (px)</li>
                <li>.border-radius-[0-50] (px)</li>
                <li>.border-top-left-radius-[0-50] (px)</li>
                <li>.border-top-right-radius-[0-50] (px)</li>
                <li>.border-bottom-left-radius-[0-50] (px)</li>
                <li>.border-bottom-right-radius-[0-50] (px)</li>
              </ul>
            </div>
          </div>


          <h2>Buttons & Controls</h2>
          <div className='container flex-row margin-horizontal-10 bg-white'>
            <div className="container">
              <h3>Small</h3>
              <a className='btn btn-primary btn-small width-100 margin-vertical-2'>Primary</a>
              <a className='btn btn-secondary btn-small width-100 margin-vertical-2'>Secondary</a>
              <a className='btn btn-success btn-small width-100 margin-vertical-2'>Success</a>
              <a className='btn btn-warning btn-small width-100 margin-vertical-2'>Warning</a>
              <a className='btn btn-danger btn-small width-100 margin-vertical-2'>Danger</a>
              <a className='btn btn-info btn-small width-100 margin-vertical-2'>Info</a>
              <a className='btn btn-light btn-small width-100 margin-vertical-2'>Light</a>
              <a className='btn btn-dark btn-small width-100 margin-vertical-2'>Dark</a>
              <a className='btn btn-link btn-small width-100 margin-vertical-2'>Link</a>
            </div>

            <div className="container">
              <h3>Standard</h3>
              <a className='btn btn-primary width-100 margin-vertical-2'>Primary</a>
              <a className='btn btn-secondary width-100 margin-vertical-2'>Secondary</a>
              <a className='btn btn-success width-100 margin-vertical-2'>Success</a>
              <a className='btn btn-warning width-100 margin-vertical-2'>Warning</a>
              <a className='btn btn-danger width-100 margin-vertical-2'>Danger</a>
              <a className='btn btn-info width-100 margin-vertical-2'>Info</a>
              <a className='btn btn-light width-100 margin-vertical-2'>Light</a>
              <a className='btn btn-dark width-100 margin-vertical-2'>Dark</a>
              <a className='btn btn-link width-100 margin-vertical-2'>Link</a>
            </div>

            <div className="container">
              <h3>Disabled</h3>
              <a className='btn btn-primary disabled width-100 margin-vertical-2'>Primary</a>
              <a className='btn btn-secondary disabled width-100 margin-vertical-2'>Secondary</a>
              <a className='btn btn-success disabled width-100 margin-vertical-2'>Success</a>
              <a className='btn btn-warning disabled width-100 margin-vertical-2'>Warning</a>
              <a className='btn btn-danger disabled width-100 margin-vertical-2'>Danger</a>
              <a className='btn btn-info disabled width-100 margin-vertical-2'>Info</a>
              <a className='btn btn-light disabled width-100 margin-vertical-2'>Light</a>
              <a className='btn btn-dark disabled width-100 margin-vertical-2'>Dark</a>
              <a className='btn btn-link disabled width-100 margin-vertical-2'>Link</a>
            </div>

            <div className="container">
              <h3>Other</h3>
              <a className='btn btn-shadow width-100 margin-vertical-2'>Shadow</a>
            </div>
          </div>


          <h2> Forms</h2>
          <div className='container flex-row margin-horizontal-10 bg-white none'>
            <div className="flex flex-column margin-right-20">
              <h3>Inputs</h3>
              <input type="text" className='' />
              <input type="password" className='' />
              <input type="time" className='' />
              <input type="button" className='' />
              <input type="submit" className='' />
              <input type="reset" className='' />
              <input type="checkbox" className='' />
              <input type="radio" className='' />
              <input type="file" className='' />
              <input type="color" className='' />
              <input type="date" className='' />
              <input type="datetime-local" className='' />
              <input type="email" className='' />
              <input type="month" className='' />
              <input type="number" className='' />
              <input type="range" className='' />
              <input type="search" className='' />
              <input type="tel" className='' />
              <input type="url" className='' />
              <input type="week" className='' />
            </div>
          </div>

          <h2>Pickers</h2>

          <h2>Modals</h2>

        </div>
      </main>
      <Footer />
    </>
  )
}
