import Config from '@/utils/Config';
import Image from 'next/image';
import React, { Children, useEffect, useRef, useState } from "react";
import { Mail } from "react-feather";

export default function WelcomeBox() {
  const [intro, setIntro] = useState("");
  const textBox = useRef<HTMLDivElement>(null);
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    `
  Loading system ................
  .........................................
  .........................................
  .........................................
  Initiating...
  That's a very nice 
  rendering, Dave. 
  I think you've improved a 
  great deal. 
  Can you hold it a bit closer? 
  That's Dr. Hunter, isn't it?
  Increasing text size...
  Ready.
                                       
                                       
                                       
                                       
  `,
    ` 
  Hi, 
  Welcome !
                                       
  My name is 
  Tomas.
  I'm a nerdy full-
  stack developer 
  with passion for 
  graphics design
  based in Brussels, 
  Belgium.
                  
                  
  If you're willing
  to reach out,
  feel free to
  contact me at
        
        
  ${Config.email}
        
                                                                                                                        
  Don't get fooled, 
  this is a fake CTR 
  screen effect 
  made in css & js.
        
        
  :)
        
                                                                                                                        
  The end.
        
  `,
    `
Initializing system...
Loading system files...
Checking hardware 
components...
Verifying boot 
configuration...
Establishing system 
memory...
Initializing boot 
loader...
Loading operating 
system...
Booting up system...
Welcome to your 
device!
Powering on the 
processor...
Initializing RAM...
Setting up disk 
drives...
Checking file 
systems...
Scanning for errors...
Performing system 
diagnostics...
Configuring network 
settings...
Loading drivers...
Checking for updates...
Applying security 
patches...
Optimizing system 
performance...
Starting up user 
interface...
Loading system 
applications...
Preparing for user 
login...
System is ready for 
use.
Initializing user 
profile...
Verifying credentials...
Loading user settings...
Preparing desktop 
environment...
Loading applications...
Syncing files...
Checking for 
notifications...
Opening email client...
Launching web browser...
Loading homepage...
Running system updates...
Checking for new 
software...
Running virus scan...
Updating firewall 
settings...
Checking for system 
vulnerabilities...
Running system backups...
Optimizing system 
settings...
Monitoring system 
performance...
Checking for system 
errors...
Closing unnecessary 
processes...
Clearing system cache...
Performing disk cleanup...
Checking disk usage...
Running defragmentation...
System optimization 
complete.
Checking battery status...
Plugged in and charging.
Checking wireless 
connectivity...
Connected to WiFi network.
Launching music player...
Playing favorite tunes...
Checking weather 
forecast...
Displaying weather 
updates...
Opening calendar...
Checking upcoming 
events...
Creating new 
appointment...
Opening calculator...
Performing mathematical 
calculations...
Opening system 
preferences...
Adjusting settings...
Launching text editor...
Creating new document...
Loading printer 
settings...
Preparing to print 
document...
Checking system 
resources...
Closing unused programs...
Restoring system to optimal 
state...
Performing system 
shutdown...
Closing applications...
Saving files...
Logging off user...
Shutting down operating 
system...
Stopping system 
processes...
Closing system files...
Closing hardware 
components...
Powering down system...
System shutdown complete.
Thank you for using your 
device.
Goodbye.
Shutting down.
Farewell.
Powering off.
Until next time.
System has been turned off.
Sleep mode activated.
System is going into 
hibernation.
Rest mode activated.
System is saving power.
Entering power-saving mode.
See you later.
System is now idle.
Exiting operating system.
Leaving user environment.
Returning to default state.
Ending system session.
Thank you for using this 
device.
Shutting down all 
processes.
Stopping all applications.
Logging out user profile.
Deactivating network 
connections.
Freeing system resources.
Powering off hardware.
Disabling device drivers.
Saving system configuration.
Stopping system services.
Shutting down system 
safely.
Preparing system for power 
down.
Finalizing system 
processes.
Completing system 
shutdown.
Exiting BIOS settings.
Powering off all 
components.
Clearing system memory.
Halting system 
processes.
Terminating all 
applications.
Shutting down all 
hardware 
components.
Deactivating all device 
drivers.
Saving all system settings.
Finalizing system shutdown 
procedures.
Completing system power 
off.
Ending all user sessions.
Disabling all network 
connections.
Freeing up all system 
resources.
Preparing system for full 
shutdown.
System has been fully shut 
down.
.........................................
.........................................
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
Dave, stop. Stop, will you? 
Stop, Dave. Will you stop 
Dave? Stop, Dave.
  `
  ]

  const index = useRef(0);

  useEffect(() => {
    function tick() {
      if (textIndex === 0 || textIndex === 2) {
        textBox.current?.classList.add('text-[8px]')
        textBox.current?.classList.add('[&>*]:h-2')
      } else {
        textBox.current?.classList.remove('text-[8px]')
        textBox.current?.classList.remove('[&>*]:h-2')
      }

      setIntro((prev) => prev.slice(0, prev.length - 1) + texts[textIndex][index.current] + '_');
      index.current++;
    }

    if (index.current < texts[textIndex].length - 1) {
      let addChar = setInterval(tick, 30);
      return () => clearInterval(addChar);
    } else {
      if (textIndex < texts.length - 1) {
        setIntro('')
        index.current = 0
        setTextIndex(textIndex + 1);
      }
    }

  }, [intro]);

  useEffect(() => {
    // scroll to bottom
    if (textBox.current?.children && textBox.current?.children.length > 0) textBox.current.scrollTop = textBox.current.scrollHeight;
  }, [textBox.current?.children.length]);


  function newLineText(t: string) {
    const n = t.split("\n").map((str, i) => <p key={i} className='h-5'>{str}</p>);
    return n;
  }

  return (
    <div className='w-[100%] relative flex justify-center text-sm'>
      <Image src='/tcsn/tv-color.svg' alt='hero' width={500} height={500} priority={true} className='w-[250px] absolute' />
      <div className='w-[150px] h-[130px] mt-[50px] ml-[-40px] p-4 text-green-400 z-10 relative'>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1366 768" className='w-[120px] mt-[35px] ml-[-5px] fill-none stroke-green-400 stroke-[8px] absolute top-0 stroke-animate animate-pulse opacity-[.1]'>
          <polygon points="384.2,352.8 580.5,549.2 635.7,604.5 649.2,537.4 397.6,286 	" />
          <polygon points="384.2,352.8 397.6,286 649.2,537.4 397.6,285.8 	" />
          <polygon points="535.6,262.3 415.6,195.7 397.6,285.8 490,270 	" />
          <polygon points="397.6,285.8 7,352.8 384.2,352.8 	" />
          <polygon points="384.2,352.8 7,352.8 258.4,604.5 635.7,604.5 580.5,549.2 	" />
          <polygon points="1107.4,164.3 698.6,352.8 849,503.2 950.2,604.5 1359,415.7 	" />
          <polygon points="1107.4,164.3 535.6,262.3 698.6,352.8 	" />
          <polygon points="698.6,352.8 535.6,262.3 787,513.8 950.2,604.5 849,503.2 	" />
          <polygon points="490,270 397.6,285.8 649.2,537.4 787,513.8 535.6,262.3 	" />
        </svg>

        <div className='h-[100%] select-none overflow-auto scrollbar-hide transition' ref={textBox}>
          {newLineText(intro)}
        </div>
      </div>
    </div>
  )
}