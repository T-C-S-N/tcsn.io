/** @format */

import WelcomeBox from "@/components/WelcomeBox";
import { useEffect, useState } from "react";
import ImagesUtils from "@/utils/ImagesUtils";
import Layout from "@/components/layout/Layout";
import Clients from "@/components/Clients";
import TVSet from "@/components/TVSet";
import Config from "@/utils/Config";

export default function HomePage() {

  const [texts, setTexts] = useState([
    `                                       `,
    `
  Loading system ................
  .........................................
  .........................................
  .........................................

  That's a very nice 
  rendering, Dave. 
  I think you've improved a 
  great deal. 
  Can you hold it a bit closer? 
  That's Dr. Hunter, isn't it?
                                       
                                       
                                       
  Initiating...
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
  based in 
  Brussels, 
  Belgium.
                                       
                                       
  If you're willing
  to reach out,
  feel free to
  contact me at
                                       

  ${Config.email}

                                                                                                                        
  Don't get fooled, 
  this is a fake CTR 
  screen effect 
  made in JS&CSS.
                                       
                                       
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
Entering power-saving 
mode.
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
  ])

  useEffect(() => {
    ImagesUtils.getImages()
  }, [])

  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[850px] flex flex-col justify-center items-center'>
        <div className="w-[100%] mt-[-100px]">
          <WelcomeBox />
        </div>
      </div>
      {/*
       <div className='w-[100%] p-[30px] flex flex-col justify-center items-center bg-neutral-900'>
        <div className="w-[90%] flex flex-row ">
          <Clients />
        </div>
      </div>
      */}

    </Layout>
  );
}
