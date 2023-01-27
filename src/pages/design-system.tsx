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
      <main className='width-100 flex padding-bottom-100 sm-padding-vertical-40'>

        <div className='width-100 flex-column margin-10'>
          <h1>Design System</h1>

          <h2>Colors</h2>
          <div className='flex-wrap margin-horizontal-10 bg-white'>
            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Background colors</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Black background</td>
                    <td>.bg-black</td>
                    <td className='bg-black'>Text</td>
                  </tr>
                  <tr>
                    <td>White background</td>
                    <td>.bg-white</td>
                    <td className='bg-white'>Text</td>
                  </tr>
                  <tr>
                    <td>Light background</td>
                    <td>.bg-light</td>
                    <td className='bg-light'>Text</td>
                  </tr>
                  <tr>
                    <td>Dark background</td>
                    <td>.bg-dark</td>
                    <td className='bg-dark'>Text</td>
                  </tr>
                  <tr>
                    <td>Shadow background</td>
                    <td>.bg-shadow</td>
                    <td className='bg-shadow'>Text</td>
                  </tr>
                  <tr>
                    <td>Main background</td>
                    <td>.bg-main</td>
                    <td className='bg-main'>Text</td>
                  </tr>
                  <tr>
                    <td>Primary background</td>
                    <td>.bg-primary</td>
                    <td className='bg-primary'>Text</td>
                  </tr>
                  <tr>
                    <td>Secondary background</td>
                    <td>.bg-secondary</td>
                    <td className='bg-secondary'>Text</td>
                  </tr>
                  <tr>
                    <td>Info background</td>
                    <td>.bg-info</td>
                    <td className='bg-info'>Text</td>
                  </tr>
                  <tr>
                    <td>Success background</td>
                    <td>.bg-success</td>
                    <td className='bg-success'>Text</td>
                  </tr>
                  <tr>
                    <td>Warning background</td>
                    <td>.bg-warning</td>
                    <td className='bg-warning'>Text</td>
                  </tr>
                  <tr>
                    <td>Danger background</td>
                    <td>.bg-danger</td>
                    <td className='bg-danger'>Text</td>
                  </tr>
                  <tr>
                    <td>Light background</td>
                    <td>.bg-light</td>
                    <td className='bg-light'>Text</td>
                  </tr>
                  <tr>
                    <td>Light blue background</td>
                    <td>.bg-light-blue</td>
                    <td className='bg-light-blue'>Text</td>
                  </tr>
                  <tr>
                    <td>Blue background</td>
                    <td>.bg-blue</td>
                    <td className='bg-blue'>Text</td>
                  </tr>
                  <tr>
                    <td>Dark blue background</td>
                    <td>.bg-dark-blue</td>
                    <td className='bg-dark-blue'>Text</td>
                  </tr>
                  <tr>
                    <td>Light pink background</td>
                    <td>.bg-light-pink</td>
                    <td className='bg-light-pink'>Text</td>
                  </tr>
                  <tr>
                    <td>Pink background</td>
                    <td>.bg-pink</td>
                    <td className='bg-pink'>Text</td>
                  </tr>
                  <tr>
                    <td>Dark pink background</td>
                    <td>.bg-dark-pink</td>
                    <td className='bg-dark-pink'>Text</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Text colors</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Black text</td>
                    <td>.text-black</td>
                    <td className='text-black'>Text</td>
                  </tr>
                  <tr>
                    <td>White text</td>
                    <td>.text-white</td>
                    <td className='text-white'>Text</td>
                  </tr>
                  <tr>
                    <td>Light text</td>
                    <td>.text-light</td>
                    <td className='text-light'>Text</td>
                  </tr>
                  <tr>
                    <td>Dark text</td>
                    <td>.text-dark</td>
                    <td className='text-dark'>Text</td>
                  </tr>
                  <tr>
                    <td>Shadow text</td>
                    <td>.text-shadow</td>
                    <td className='text-shadow'>Text</td>
                  </tr>
                  <tr>
                    <td>Main text</td>
                    <td>.text-main</td>
                    <td className='text-main'>Text</td>
                  </tr>
                  <tr>
                    <td>Primary text</td>
                    <td>.text-primary</td>
                    <td className='text-primary'>Text</td>
                  </tr>
                  <tr>
                    <td>Secondary text</td>
                    <td>.text-secondary</td>
                    <td className='text-secondary'>Text</td>
                  </tr>
                  <tr>
                    <td>Info text</td>
                    <td>.text-info</td>
                    <td className='text-info'>Text</td>
                  </tr>
                  <tr>
                    <td>Success text</td>
                    <td>.text-success</td>
                    <td className='text-success'>Text</td>
                  </tr>
                  <tr>
                    <td>Warning text</td>
                    <td>.text-warning</td>
                    <td className='text-warning'>Text</td>
                  </tr>
                  <tr>
                    <td>Danger text</td>
                    <td>.text-danger</td>
                    <td className='text-danger'>Text</td>
                  </tr>
                  <tr>
                    <td>Light blue text</td>
                    <td>.text-light-blue</td>
                    <td className='text-light-blue'>Text</td>
                  </tr>
                  <tr>
                    <td>Blue text</td>
                    <td>.text-blue</td>
                    <td className='text-blue'>Text</td>
                  </tr>
                  <tr>
                    <td>Dark blue text</td>
                    <td>.text-dark-blue</td>
                    <td className='text-dark-blue'>Text</td>
                  </tr>
                  <tr>
                    <td>Light pink text</td>
                    <td>.text-light-pink</td>
                    <td className='text-light-pink'>Text</td>
                  </tr>
                  <tr>
                    <td>Pink text</td>
                    <td>.text-pink</td>
                    <td className='text-pink'>Text</td>
                  </tr>
                  <tr>
                    <td>Dark pink text</td>
                    <td>.text-dark-pink</td>
                    <td className='text-dark-pink'>Text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2>Icons, Logos & Illustrations</h2>
          <div className='flex-wrap margin-horizontal-10 bg-white'>
            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Logos</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Logo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Active</td>
                    <td><Logo active={true} /></td>
                  </tr>
                  <tr>
                    <td>Inactive</td>
                    <td><Logo active={false} /></td>
                  </tr>
                  <tr>
                    <td>Animated</td>
                    <td className='flex-center'><img src="/tcsn-animated.gif" alt="tcsn-animated" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Icons</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Icon</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Github</td>
                    <td><FaGithub color='black' size={20} /></td>
                  </tr>
                  <tr>
                    <td>Linkedin</td>
                    <td><FaLinkedin color='black' size={20} /></td>
                  </tr>
                  <tr>
                    <td>Behance</td>
                    <td><FaBehance color='black' size={20} /></td>
                  </tr>
                  <tr>
                    <td>Pinterest</td>
                    <td><FaPinterest color='black' size={20} /></td>
                  </tr>
                  <tr>
                    <td>Codepen</td>
                    <td><Codepen color='black' size={20} /></td>
                  </tr>
                  <tr>
                    <td>Instagram</td>
                    <td><Instagram color='black' size={20} /></td>
                  </tr>
                  <tr>
                    <td>Mail</td>
                    <td><Mail color='black' size={20} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <h2>Fonts</h2>
          <div className='flex-wrap margin-horizontal-10 bg-white'>
            <div className="flex-column padding-5 width-100 sm-width-50 none">
              <h3>Examples</h3>
              <SyntaxHighlighter language="html">
                {`<!-- Examples -->
<p className='font-size-text'>Text</p>
<p className='font-size-small'>Small text</p>
<p className='color-blue'>Blue text</p>`}
              </SyntaxHighlighter>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Font size</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Extra extra small text</td>
                    <td>.font-size-xxsmall</td>
                    <td className='font-size-xxsmall'>Text</td>
                  </tr>
                  <tr>
                    <td>Extra small text</td>
                    <td>.font-size-xsmall</td>
                    <td className='font-size-xsmall'>Text</td>
                  </tr>
                  <tr>
                    <td>Small text</td>
                    <td>.font-size-small</td>
                    <td className='font-size-small'>Text</td>
                  </tr>
                  <tr>
                    <td>Text</td>
                    <td>.font-size-text</td>
                    <td className='font-size-text'>Text</td>
                  </tr>
                  <tr>
                    <td>Subtitle</td>
                    <td>.font-size-subtitle</td>
                    <td className='font-size-subtitle'>Text</td>
                  </tr>
                  <tr>
                    <td>Title</td>
                    <td>.font-size-title</td>
                    <td className='font-size-title'>Text</td>
                  </tr>
                  <tr>
                    <td>Large text</td>
                    <td>.font-size-large</td>
                    <td className='font-size-large'>Text</td>
                  </tr>
                  <tr>
                    <td>Extra large text</td>
                    <td>.font-size-xlarge</td>
                    <td className='font-size-xlarge'>Text</td>
                  </tr>
                  <tr>
                    <td>Extra extra large text</td>
                    <td>.font-size-xxlarge</td>
                    <td className='font-size-xxlarge'>Text</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Font weight</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Light</td>
                    <td>.font-weight-light</td>
                    <td className='font-weight-light'>Text</td>
                  </tr>
                  <tr>
                    <td>Normal</td>
                    <td>.font-weight-normal</td>
                    <td className='font-weight-normal'>Text</td>
                  </tr>
                  <tr>
                    <td>Bold</td>
                    <td>.font-weight-bold</td>
                    <td className='font-weight-bold'>Text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <h2>Containers</h2>
          <div className='flex-wrap margin-horizontal-10 bg-white'>
            <div className="flex flex-column padding-5 width-100 sm-width-50 none">
              <h3>Examples</h3>
              <SyntaxHighlighter language="html">
                {`<!-- Examples -->
<div className='flex-row width-100 margin-top-50'></div>
<div className='flex-start width-50 bg-pink'></div>`}
              </SyntaxHighlighter>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Visibility</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Visible</td>
                    <td>.visible</td>
                    <td className='visible'>Text</td>
                  </tr>
                  <tr>
                    <td>Invisible</td>
                    <td>.invisible</td>
                    <td className='invisible'>Text</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Position</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Relative</td>
                    <td>.position-relative</td>
                  </tr>
                  <tr>
                    <td>Absolute</td>
                    <td>.position-absolute</td>
                  </tr>
                  <tr>
                    <td>Fixed</td>
                    <td>.position-fixed</td>
                  </tr>
                  <tr>
                    <td>Static</td>
                    <td>.position-static</td>
                  </tr>
                  <tr>
                    <td>Sticky</td>
                    <td>.position-sticky</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Display</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Display block</td>
                    <td>.block</td>
                  </tr>
                  <tr>
                    <td>Display inline-block</td>
                    <td>.inline-block</td>
                  </tr>
                  <tr>
                    <td>Display inline</td>
                    <td>.inline</td>
                  </tr>
                  <tr>
                    <td>Display none</td>
                    <td>.none</td>
                  </tr>
                  <tr>
                    <td>Display table</td>
                    <td>.table</td>
                  </tr>
                  <tr>
                    <td>Display table-cell</td>
                    <td>.table-cell</td>
                  </tr>
                  <tr>
                    <td>Display table-row</td>
                    <td>.table-row</td>
                  </tr>
                  <tr>
                    <td>Display flex</td>
                    <td>.flex</td>
                  </tr>
                  <tr>
                    <td>Display inline-flex</td>
                    <td>.inline-flex</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Flex</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Flex row</td>
                    <td>.flex-row</td>
                    <td className='flex-row example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex column</td>
                    <td>.flex-column</td>
                    <td className='flex-column example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex center</td>
                    <td>.flex-center</td>
                    <td className='flex-center example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex start</td>
                    <td>.flex-start</td>
                    <td className='flex-start example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex end</td>
                    <td>.flex-end</td>
                    <td className='flex-end example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex justify center</td>
                    <td>.flex-justify-center</td>
                    <td className='flex-justify-center example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex justify space-between</td>
                    <td>.flex-justify-space-between</td>
                    <td className='flex-justify-space-between example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex justify space-evenly</td>
                    <td>.flex-justify-space-evenly</td>
                    <td className='flex-justify-space-evenly example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex justify space-around</td>
                    <td>.flex-justify-space-around</td>
                    <td className='flex-justify-space-around example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex justify start</td>
                    <td>.flex-justify-start</td>
                    <td className='flex-justify-start example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex justify end</td>
                    <td>.flex-justify-end</td>
                    <td className='flex-justify-end example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex align center</td>
                    <td>.flex-align-center</td>
                    <td className='flex-align-center example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex align start</td>
                    <td>.flex-align-start</td>
                    <td className='flex-align-start example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex align end</td>
                    <td>.flex-align-end</td>
                    <td className='flex-align-end example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex align baseline</td>
                    <td>.flex-align-baseline</td>
                    <td className='flex-align-baseline example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex align stretch</td>
                    <td>.flex-align-stretch</td>
                    <td className='flex-align-stretch example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'></div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex wrap</td>
                    <td>.flex-wrap</td>
                    <td className='flex-wrap example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'>1</div>
                      <div className='example-box bg-dark-blue flex-center'>2</div>
                      <div className='example-box bg-dark-blue flex-center'>3</div>
                      <div className='example-box bg-dark-blue flex-center'>4</div>
                      <div className='example-box bg-dark-blue flex-center'>5</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex wrap reverse</td>
                    <td>.flex-wrap-reverse</td>
                    <td className='flex-wrap-reverse example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'>1</div>
                      <div className='example-box bg-dark-blue flex-center'>2</div>
                      <div className='example-box bg-dark-blue flex-center'>3</div>
                      <div className='example-box bg-dark-blue flex-center'>4</div>
                      <div className='example-box bg-dark-blue flex-center'>5</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex no wrap</td>
                    <td>.flex-no-wrap</td>
                    <td className='flex-no-wrap example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center'>1</div>
                      <div className='example-box bg-dark-blue flex-center'>2</div>
                      <div className='example-box bg-dark-blue flex-center'>3</div>
                      <div className='example-box bg-dark-blue flex-center'>4</div>
                      <div className='example-box bg-dark-blue flex-center'>5</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Flex grow</td>
                    <td>.flex-grow</td>
                  </tr>
                  <tr>
                    <td>Flex no grow</td>
                    <td>.flex-no-grow</td>
                  </tr>
                  <tr>
                    <td>Flex shrink</td>
                    <td>.flex-shrink</td>
                  </tr>
                  <tr>
                    <td>Flex no shrink</td>
                    <td>.flex-no-shrink</td>
                  </tr>
                  <tr>
                    <td>Flex (0 - 10)</td>
                    <td>.flex-[1-10]</td>
                    <td className='flex-grow example bg-light-blue'>
                      <div className='example-box bg-dark-blue flex-center flex-1'>1</div>
                      <div className='example-box bg-dark-blue flex-center flex-2'>2</div>
                      <div className='example-box bg-dark-blue flex-center flex-3'>3</div>
                      <div className='example-box bg-dark-blue flex-center flex-4'>4</div>
                      <div className='example-box bg-dark-blue flex-center flex-5'>5</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Size</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Width (0 - 100 by 5%)</td>
                    <td>.width-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Min width (0 - 100 by 5px)</td>
                    <td>.min-width-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Max width (0 - 100 by 5px)</td>
                    <td>.max-width-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Height (0 - 100 by 5%)</td>
                    <td>.height-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Min height (0 - 100 by 5px)</td>
                    <td>.min-height-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Max height (0 - 100 by 5px)</td>
                    <td>.max-height-[0-100]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Margin</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Margin <br /> (0 - 100 by 5px)</td>
                    <td>.margin-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Margin top <br /> (0 - 100 by 5px)</td>
                    <td>.margin-top-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Margin right <br /> (0 - 100 by 5px)</td>
                    <td>.margin-right-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Margin bottom <br /> (0 - 100 by 5px)</td>
                    <td>.margin-bottom-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Margin left <br /> (0 - 100 by 5px)</td>
                    <td>.margin-left-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Margin horizontal <br /> (0 - 100 by 5px)</td>
                    <td>.margin-horizontal-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Margin vertical <br /> (0 - 100 by 5px)</td>
                    <td>.margin-vertical-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Margin vertical & horizontal <br /> (0 - 100 by 5px) (0 - 100 by 5px)</td>
                    <td>.margin-[0-100]-[0-100]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Padding</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Padding <br /> (0 - 100 by 5px)</td>
                    <td>.padding-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Padding top <br /> (0 - 100 by 5px)</td>
                    <td>.padding-top-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Padding right <br /> (0 - 100 by 5px)</td>
                    <td>.padding-right-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Padding bottom <br /> (0 - 100 by 5px)</td>
                    <td>.padding-bottom-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Padding left <br /> (0 - 100 by 5px)</td>
                    <td>.padding-left-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Padding horizontal <br /> (0 - 100 by 5px)</td>
                    <td>.padding-horizontal-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Padding vertical <br /> (0 - 100 by 5px)</td>
                    <td>.padding-vertical-[0-100]</td>
                  </tr>
                  <tr>
                    <td>Padding vertical & horizontal <br /> (0 - 100 by 5px) (0 - 100 by 5px)</td>
                    <td>.padding-[0-100]-[0-100]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Border</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Border</td>
                    <td>.border</td>
                  </tr>
                  <tr>
                    <td>Border radius</td>
                    <td>.border-radius</td>
                  </tr>
                  <tr>
                    <td>Border top</td>
                    <td>.border-top</td>
                  </tr>
                  <tr>
                    <td>Border right</td>
                    <td>.border-right</td>
                  </tr>
                  <tr>
                    <td>Border bottom</td>
                    <td>.border-bottom</td>
                  </tr>
                  <tr>
                    <td>Border left</td>
                    <td>.border-left</td>
                  </tr>
                  <tr>
                    <td>Border none</td>
                    <td>.border-none</td>
                  </tr>
                  <tr>
                    <td>Border top none</td>
                    <td>.border-top-none</td>
                  </tr>
                  <tr>
                    <td>Border right none</td>
                    <td>.border-right-none</td>
                  </tr>
                  <tr>
                    <td>Border bottom none</td>
                    <td>.border-bottom-none</td>
                  </tr>
                  <tr>
                    <td>Border left none</td>
                    <td>.border-left-none</td>
                  </tr>
                  <tr>
                    <td>Border width <br /> (0 - 5 by 1px)</td>
                    <td>.border-width-[0-5]</td>
                  </tr>
                  <tr>
                    <td>Border radius <br /> (0 - 50 by 1px)</td>
                    <td>.border-radius-[0-50]</td>
                  </tr>
                  <tr>
                    <td>Border top left radius <br /> (0 - 50 by 1px)</td>
                    <td>.border-top-left-radius-[0-50]</td>
                  </tr>
                  <tr>
                    <td>Border top right radius <br /> (0 - 50 by 1px)</td>
                    <td>.border-top-right-radius-[0-50]</td>
                  </tr>
                  <tr>
                    <td>Border bottom left radius <br /> (0 - 50 by 1px)</td>
                    <td>.border-bottom-left-radius-[0-50]</td>
                  </tr>
                  <tr>
                    <td>Border bottom right radius <br /> (0 - 50 by 1px)</td>
                    <td>.border-bottom-right-radius-[0-50]</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <h2>Buttons & Controls</h2>
          <div className='flex-wrap margin-horizontal-10 bg-white'>
            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Standard</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Primary</td>
                    <td>.btn.primary</td>
                    <td><a className='btn primary'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Secondary</td>
                    <td>.btn.secondary</td>
                    <td><a className='btn secondary'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Success</td>
                    <td>.btn.success</td>
                    <td><a className='btn success'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Warning</td>
                    <td>.btn.warning-</td>
                    <td><a className='btn warning'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Danger</td>
                    <td>.btn.danger</td>
                    <td><a className='btn danger'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Info</td>
                    <td>.btn.info</td>
                    <td><a className='btn info'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Light</td>
                    <td>.btn.light</td>
                    <td><a className='btn light'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Dark</td>
                    <td>.btn.dark</td>
                    <td><a className='btn dark'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td>.btn.link</td>
                    <td><a className='btn link'>Button</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Small</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Primary</td>
                    <td>.btn .primary .small</td>
                    <td><a className='btn primary small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Secondary</td>
                    <td>.btn .secondary .small</td>
                    <td><a className='btn secondary small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Success</td>
                    <td>.btn .success .small</td>
                    <td><a className='btn success small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Warning</td>
                    <td>.btn .warning .small</td>
                    <td><a className='btn warning small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Danger</td>
                    <td>.btn .danger .small</td>
                    <td><a className='btn danger small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Info</td>
                    <td>.btn .info .small</td>
                    <td><a className='btn info small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Light</td>
                    <td>.btn .light .small</td>
                    <td><a className='btn light small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Dark</td>
                    <td>.btn .dark .small</td>
                    <td><a className='btn dark small'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td>.btn .link .small</td>
                    <td><a className='btn link small'>Button</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Disabled</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Primary</td>
                    <td>.btn .primary .disabled</td>
                    <td><a className='btn primary disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Secondary</td>
                    <td>.btn .secondary .disabled</td>
                    <td><a className='btn secondary disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Success</td>
                    <td>.btn .success .disabled</td>
                    <td><a className='btn success disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Warning</td>
                    <td>.btn .warning .disabled</td>
                    <td><a className='btn warning disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Danger</td>
                    <td>.btn .danger .disabled</td>
                    <td><a className='btn danger disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Info</td>
                    <td>.btn .info .disabled</td>
                    <td><a className='btn info disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Light</td>
                    <td>.btn .light .disabled</td>
                    <td><a className='btn light disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Dark</td>
                    <td>.btn .dark .disabled</td>
                    <td><a className='btn dark disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td>.btn .link .disabled</td>
                    <td><a className='btn link disabled'>Button</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Disabled small</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Primary</td>
                    <td>.btn .primary .small .disabled</td>
                    <td><a className='btn primary small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Secondary</td>
                    <td>.btn .secondary .small .disabled</td>
                    <td><a className='btn secondary small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Success</td>
                    <td>.btn .success .small .disabled</td>
                    <td><a className='btn success small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Warning</td>
                    <td>.btn .warning .small .disabled</td>
                    <td><a className='btn warning small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Danger</td>
                    <td>.btn .danger .small .disabled</td>
                    <td><a className='btn danger small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Info</td>
                    <td>.btn .info.small .disabled</td>
                    <td><a className='btn info small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Light</td>
                    <td>.btn .light .small .disabled</td>
                    <td><a className='btn light small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Dark</td>
                    <td>.btn .dark .small .disabled</td>
                    <td><a className='btn dark small disabled'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td>.btn .link .small .disabled</td>
                    <td><a className='btn link small disabled'>Button</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Border</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Primary</td>
                    <td>.btn .primary .border</td>
                    <td><a className='btn primary border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Secondary</td>
                    <td>.btn .secondary .border</td>
                    <td><a className='btn secondary border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Success</td>
                    <td>.btn .success .border</td>
                    <td><a className='btn success border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Warning</td>
                    <td>.btn .warning .border</td>
                    <td><a className='btn warning border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Danger</td>
                    <td>.btn .danger .border</td>
                    <td><a className='btn danger border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Info</td>
                    <td>.btn .info .border</td>
                    <td><a className='btn info border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Light</td>
                    <td>.btn .light .border</td>
                    <td><a className='btn lightborder'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Dark</td>
                    <td>.btn .dark .border</td>
                    <td><a className='btn dark border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td>.btn .link .border</td>
                    <td><a className='btn link border'>Button</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Border small</h3>
              <table>
                <thead>
                  <tr>
                    <th className='width-50 text-left'>Definition</th>
                    <th className='width-50 text-left'>Class</th>
                    <th className='width-50 text-left'>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Primary</td>
                    <td>.btn .primary .small .border</td>
                    <td><a className='btn primary small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Secondary</td>
                    <td>.btn .secondary .small .border</td>
                    <td><a className='btn secondary small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Success</td>
                    <td>.btn .success .small .border</td>
                    <td><a className='btn success small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Warning</td>
                    <td>.btn .warning .small .border</td>
                    <td><a className='btn warning small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Danger</td>
                    <td>.btn .danger .small .border</td>
                    <td><a className='btn danger small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Info</td>
                    <td>.btn .info .small .border</td>
                    <td><a className='btn info small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Light</td>
                    <td>.btn .light .small .border</td>
                    <td><a className='btn light small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Dark</td>
                    <td>.btn .dark .small .border</td>
                    <td><a className='btn dark small border'>Button</a></td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td>.btn .link .small .border</td>
                    <td><a className='btn link small border'>Button</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2> Forms</h2>
          <div className='flex-wrap margin-horizontal-10 bg-white'>
            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Inputs</h3>

              <div className='flex-column margin-vertical-5'>
                <label>Text input</label>
                <input type="text" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Password input</label>
                <input type="password" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Button input</label>
                <input type="button" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Submit input</label>
                <input type="submit" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Reset input</label>
                <input type="reset" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>File input</label>
                <input type="file" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Color input</label>
                <input type="color" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Datetime-local input</label>
                <input type="datetime-local" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Email input</label>
                <input type="email" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Number input</label>
                <input type="number" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Range input</label>
                <input type="range" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Search input</label>
                <input type="search" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Tel input</label>
                <input type="tel" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Url input</label>
                <input type="url" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Date input</label>
                <input type="date" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Time input</label>
                <input type="time" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Week input</label>
                <input type="week" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Month input</label>
                <input type="month" />
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Checkbox</label>
                <div className='flex-row'>
                  <input type="checkbox" />
                  <input type="checkbox" />
                </div>
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Radio</label>
                <div className='flex-row'>
                  <input type="radio" name='radio-input' />
                  <input type="radio" name='radio-input' />
                </div>
              </div>
            </div>

            <div className="flex-column padding-5 width-100 sm-width-50">
              <h3>Others</h3>
              <div className='flex-column margin-vertical-5'>
                <label>Textarea</label>
                <textarea></textarea>
              </div>

              <div className='flex-column margin-vertical-5'>
                <label>Select</label>
                <select>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </div>
          </div>

          <h2 className='none'>Pickers</h2>

          <h2 className='none'>Modals</h2>

        </div>
      </main>
      <Footer />
    </>
  )
}
